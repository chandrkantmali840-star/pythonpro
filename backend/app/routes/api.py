from flask import Blueprint,jsonify,request
from flask_jwt_extended import jwt_required,get_jwt_identity
from ..extensions import db
from ..models import Lesson,LessonProgress,Question,QuestionAttempt,Quiz,CodingProblem,CodingSubmission,Project,ProjectProgress,Bookmark,User,UserState
from ..services.execution_service import SafeMockExecutionService
bp=Blueprint('api',__name__);runner=SafeMockExecutionService()
def uid():return int(get_jwt_identity())
def dump(x):return{'id':x.id,'title':x.title,**(x.payload or{})}
@bp.get('/health')
def health():return jsonify(status='ok')
@bp.get('/state')
@jwt_required()
def state_get():
 record=UserState.query.filter_by(user_id=uid()).first()
 return jsonify((record.data if record else {}) or {})
@bp.put('/state')
@jwt_required()
def state_put():
 data=request.get_json(silent=True)
 if not isinstance(data,dict):return jsonify(error='State must be a JSON object'),400
 data.pop('user',None)
 record=UserState.query.filter_by(user_id=uid()).first()
 if record:record.data=data
 else:db.session.add(UserState(user_id=uid(),data=data))
 db.session.commit()
 return jsonify(saved=True)
@bp.get('/lessons')
def lessons():return jsonify([dump(x)for x in Lesson.query.all()])
@bp.get('/lessons/<item_id>')
def lesson(item_id):return jsonify(dump(Lesson.query.get_or_404(item_id)))
@bp.post('/lessons/<item_id>/complete')
@jwt_required()
def lesson_complete(item_id):
 Lesson.query.get_or_404(item_id)
 if not LessonProgress.query.filter_by(user_id=uid(),lesson_id=item_id).first():db.session.add(LessonProgress(user_id=uid(),lesson_id=item_id));db.session.commit()
 return jsonify(completed=True)
@bp.get('/questions')
def questions():
 q=Question.query
 for key,col in [('topic',Question.topic),('difficulty',Question.difficulty),('type',Question.question_type)]:
  if request.args.get(key):q=q.filter(col==request.args[key])
 return jsonify([dump(x)for x in q.limit(min(int(request.args.get('limit',50)),100)).all()])
@bp.post('/questions/<item_id>/attempt')
@jwt_required()
def attempt(item_id):
 q=Question.query.get_or_404(item_id);d=request.get_json(silent=True)or{};correct=d.get('answer')==q.payload.get('correctAnswer');db.session.add(QuestionAttempt(user_id=uid(),question_id=item_id,answer=str(d.get('answer','')),correct=correct));db.session.commit();return jsonify(correct=correct,correctAnswer=q.payload.get('correctAnswer'),explanation=q.payload.get('explanation'))
@bp.get('/quizzes')
def quizzes():return jsonify([dump(x)for x in Quiz.query.all()])
@bp.post('/quizzes/<item_id>/start')
def quiz_start(item_id):Quiz.query.get_or_404(item_id);return jsonify(quizId=item_id,started=True)
@bp.post('/quizzes/<item_id>/submit')
@jwt_required()
def quiz_submit(item_id):return jsonify(quizId=item_id,accepted=True)
@bp.get('/coding/problems')
def coding():return jsonify([dump(x)for x in CodingProblem.query.all()])
@bp.get('/coding/problems/<item_id>')
def coding_one(item_id):return jsonify(dump(CodingProblem.query.get_or_404(item_id)))
@bp.post('/coding/problems/<item_id>/run')
@jwt_required()
def coding_run(item_id):
 p=CodingProblem.query.get_or_404(item_id);d=request.get_json(silent=True)or{};return jsonify(runner.run(d.get('code',''),p.payload.get('tests',[])))
@bp.post('/coding/problems/<item_id>/submit')
@jwt_required()
def coding_submit(item_id):
 p=CodingProblem.query.get_or_404(item_id);d=request.get_json(silent=True)or{};result=runner.run(d.get('code',''),p.payload.get('tests',[]));db.session.add(CodingSubmission(user_id=uid(),problem_id=item_id,status=result['status'],code=d.get('code','')));db.session.commit();return jsonify(result)
@bp.get('/projects')
def project_list():return jsonify([dump(x)for x in Project.query.all()])
@bp.get('/projects/<item_id>')
def project_one(item_id):return jsonify(dump(Project.query.get_or_404(item_id)))
@bp.post('/projects/<item_id>/complete')
@jwt_required()
def project_complete(item_id):
 Project.query.get_or_404(item_id)
 if not ProjectProgress.query.filter_by(user_id=uid(),project_id=item_id).first():db.session.add(ProjectProgress(user_id=uid(),project_id=item_id));db.session.commit()
 return jsonify(completed=True)
@bp.get('/bookmarks')
@jwt_required()
def bookmarks():return jsonify([{'id':x.id,'kind':x.kind,'itemId':x.item_id}for x in Bookmark.query.filter_by(user_id=uid()).all()])
@bp.post('/bookmarks')
@jwt_required()
def bookmark_add():
 d=request.get_json(silent=True)or{};b=Bookmark(user_id=uid(),kind=d.get('kind'),item_id=d.get('itemId'));db.session.add(b);db.session.commit();return jsonify(id=b.id),201
@bp.delete('/bookmarks/<int:item_id>')
@jwt_required()
def bookmark_delete(item_id):b=Bookmark.query.filter_by(id=item_id,user_id=uid()).first_or_404();db.session.delete(b);db.session.commit();return'',204
@bp.get('/profile')
@jwt_required()
def profile():
 u=db.session.get(User,uid());return jsonify(id=u.id,fullName=u.full_name,email=u.email,studentId=u.profile.student_id,course=u.profile.course,year=u.profile.year)
@bp.put('/profile')
@jwt_required()
def profile_update():
 u=db.session.get(User,uid());d=request.get_json(silent=True)or{};u.full_name=str(d.get('fullName',u.full_name))[:120];u.profile.course=str(d.get('course',u.profile.course))[:120];u.profile.year=str(d.get('year',u.profile.year))[:20];db.session.commit();return profile()
@bp.get('/progress')
@bp.get('/analytics')
@jwt_required()
def progress():return jsonify(lessons=LessonProgress.query.filter_by(user_id=uid()).count(),questions=QuestionAttempt.query.filter_by(user_id=uid()).count(),coding=CodingSubmission.query.filter_by(user_id=uid()).count(),projects=ProjectProgress.query.filter_by(user_id=uid()).count())
