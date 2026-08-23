import re,bcrypt
from flask import Blueprint,request,jsonify
from flask_jwt_extended import create_access_token,get_jwt_identity,jwt_required
from ..extensions import db
from ..models import User,StudentProfile
bp=Blueprint('auth',__name__)
def view(u):return{'id':str(u.id),'fullName':u.full_name,'email':u.email,'studentId':u.profile.student_id,'course':u.profile.course,'year':u.profile.year}
@bp.post('/register')
def register():
 d=request.get_json(silent=True)or{};required=['fullName','email','studentId','course','year','password']
 if any(not str(d.get(k,'')).strip()for k in required):return jsonify(error='All fields are required'),400
 if not re.match(r'^[^@]+@[^@]+\.[^@]+$',d['email'])or len(d['password'])<8:return jsonify(error='Invalid email or password'),400
 if User.query.filter_by(email=d['email'].lower()).first():return jsonify(error='Email already registered'),409
 u=User(full_name=d['fullName'],email=d['email'].lower(),password_hash=bcrypt.hashpw(d['password'].encode(),bcrypt.gensalt()).decode());u.profile=StudentProfile(student_id=d['studentId'],course=d['course'],year=str(d['year']));db.session.add(u);db.session.commit();return jsonify(token=create_access_token(identity=str(u.id)),user=view(u)),201
@bp.post('/login')
def login():
 d=request.get_json(silent=True)or{};u=User.query.filter_by(email=str(d.get('email','')).lower()).first()
 if not u or not bcrypt.checkpw(str(d.get('password','')).encode(),u.password_hash.encode()):return jsonify(error='Invalid credentials'),401
 return jsonify(token=create_access_token(identity=str(u.id)),user=view(u))
@bp.get('/me')
@jwt_required()
def me():return jsonify(view(db.session.get(User,int(get_jwt_identity()))))
