import os
class Config:
 SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URL','sqlite:///pythonpro.db')
 SQLALCHEMY_TRACK_MODIFICATIONS=False
 JWT_SECRET_KEY=os.environ['JWT_SECRET_KEY']
 CORS_ORIGINS=[x.strip() for x in os.getenv('CORS_ORIGINS','http://localhost:5173').split(',')]
 JSON_SORT_KEYS=False
