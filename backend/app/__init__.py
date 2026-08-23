from flask import Flask, jsonify

from .extensions import cors, db, jwt
from .config.settings import Config


def create_app(config_overrides=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if config_overrides:
        app.config.update(config_overrides)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
    )

    from .routes.api import bp as api
    from .routes.auth import bp as auth

    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(api, url_prefix="/api")

    @app.errorhandler(404)
    def missing(_):
        return jsonify(error="Resource not found"), 404

    @app.errorhandler(413)
    def too_large(_):
        return jsonify(error="Request is too large"), 413

    @app.errorhandler(500)
    def failed(_):
        db.session.rollback()
        return jsonify(error="Unexpected server error"), 500

    @jwt.unauthorized_loader
    def missing_token(_):
        return jsonify(error="Authentication required"), 401

    @jwt.invalid_token_loader
    def invalid_token(_):
        return jsonify(error="Invalid authentication token"), 401

    @jwt.expired_token_loader
    def expired_token(_header, _payload):
        return jsonify(error="Your session expired. Please log in again."), 401

    with app.app_context():
        db.create_all()
    return app
