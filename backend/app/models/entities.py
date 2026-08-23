from datetime import datetime,timezone
from ..extensions import db
def now():return datetime.now(timezone.utc)
class TimestampMixin:created_at=db.Column(db.DateTime(timezone=True),default=now,nullable=False);updated_at=db.Column(db.DateTime(timezone=True),default=now,onupdate=now,nullable=False)
class User(TimestampMixin,db.Model):
 __tablename__='users';id=db.Column(db.Integer,primary_key=True);email=db.Column(db.String(255),unique=True,index=True,nullable=False);password_hash=db.Column(db.String(255),nullable=False);full_name=db.Column(db.String(120),nullable=False);profile=db.relationship('StudentProfile',backref='user',uselist=False,cascade='all,delete-orphan');state_record=db.relationship('UserState',backref='user',uselist=False,cascade='all,delete-orphan')
class StudentProfile(TimestampMixin,db.Model):
 __tablename__='student_profiles';id=db.Column(db.Integer,primary_key=True);user_id=db.Column(db.Integer,db.ForeignKey('users.id',ondelete='CASCADE'),unique=True,nullable=False);student_id=db.Column(db.String(64),unique=True,index=True,nullable=False);course=db.Column(db.String(120),nullable=False);year=db.Column(db.String(20),nullable=False)
class UserState(TimestampMixin,db.Model):
 __tablename__='user_states';id=db.Column(db.Integer,primary_key=True);user_id=db.Column(db.Integer,db.ForeignKey('users.id',ondelete='CASCADE'),unique=True,index=True,nullable=False);data=db.Column(db.JSON,nullable=False,default=dict)
class Content(db.Model):
 __abstract__=True;id=db.Column(db.String(64),primary_key=True);title=db.Column(db.String(255),nullable=False);payload=db.Column(db.JSON,nullable=False);created_at=db.Column(db.DateTime(timezone=True),default=now,nullable=False)
class Lesson(Content):__tablename__='lessons'
class Question(Content):__tablename__='questions';topic=db.Column(db.String(80),index=True,nullable=False);difficulty=db.Column(db.String(16),index=True,nullable=False);question_type=db.Column(db.String(40),index=True,nullable=False)
class Quiz(Content):__tablename__='quizzes'
class CodingProblem(Content):__tablename__='coding_problems';difficulty=db.Column(db.String(16),index=True,nullable=False)
class Project(Content):__tablename__='projects';difficulty=db.Column(db.String(16),index=True,nullable=False)
class Progress(db.Model):
 __abstract__=True;id=db.Column(db.Integer,primary_key=True);user_id=db.Column(db.Integer,db.ForeignKey('users.id',ondelete='CASCADE'),index=True,nullable=False);completed_at=db.Column(db.DateTime(timezone=True),default=now)
class LessonProgress(Progress):__tablename__='lesson_progress';lesson_id=db.Column(db.String(64),db.ForeignKey('lessons.id'),nullable=False);__table_args__=(db.UniqueConstraint('user_id','lesson_id'),)
class QuestionAttempt(Progress):__tablename__='question_attempts';question_id=db.Column(db.String(64),db.ForeignKey('questions.id'),nullable=False);answer=db.Column(db.Text);correct=db.Column(db.Boolean,nullable=False)
class QuizAttempt(Progress):__tablename__='quiz_attempts';quiz_id=db.Column(db.String(64),db.ForeignKey('quizzes.id'),nullable=False);score=db.Column(db.Integer,nullable=False);total=db.Column(db.Integer,nullable=False);seconds=db.Column(db.Integer,nullable=False,default=0)
class CodingSubmission(Progress):__tablename__='coding_submissions';problem_id=db.Column(db.String(64),db.ForeignKey('coding_problems.id'),nullable=False);status=db.Column(db.String(20),nullable=False);code=db.Column(db.Text,nullable=False)
class ProjectProgress(Progress):__tablename__='project_progress';project_id=db.Column(db.String(64),db.ForeignKey('projects.id'),nullable=False);__table_args__=(db.UniqueConstraint('user_id','project_id'),)
class Bookmark(TimestampMixin,db.Model):__tablename__='bookmarks';id=db.Column(db.Integer,primary_key=True);user_id=db.Column(db.Integer,db.ForeignKey('users.id',ondelete='CASCADE'),index=True,nullable=False);kind=db.Column(db.String(30),nullable=False);item_id=db.Column(db.String(64),nullable=False);__table_args__=(db.UniqueConstraint('user_id','kind','item_id'),)
class Achievement(Content):__tablename__='achievements'
class StudentAchievement(Progress):__tablename__='student_achievements';achievement_id=db.Column(db.String(64),db.ForeignKey('achievements.id'),nullable=False);__table_args__=(db.UniqueConstraint('user_id','achievement_id'),)
class Notification(TimestampMixin,db.Model):__tablename__='notifications';id=db.Column(db.Integer,primary_key=True);user_id=db.Column(db.Integer,db.ForeignKey('users.id',ondelete='CASCADE'),index=True,nullable=False);message=db.Column(db.Text,nullable=False);read=db.Column(db.Boolean,default=False,nullable=False)
