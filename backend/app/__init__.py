from flask import Flask,jsonify
from .extensions import db,jwt,cors
from .config.settings import Config
def create_app():
 app=Flask(__name__);app.config.from_object(Config);db.init_app(app);jwt.init_app(app);cors.init_app(app,resources={r'/api/*':{'origins':app.config['CORS_ORIGINS']}})
 from .routes.auth import bp as auth;from .routes.api import bp as api
 app.register_blueprint(auth,url_prefix='/api/auth');app.register_blueprint(api,url_prefix='/api')
 @app.errorhandler(404)
 def missing(_):return jsonify(error='Resource not found'),404
 @app.errorhandler(500)
 def failed(_):return jsonify(error='Unexpected server error'),500
 with app.app_context():db.create_all()
 return app
