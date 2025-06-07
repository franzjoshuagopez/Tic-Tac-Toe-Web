import os
from flask import Flask
import secrets


def create_app():
    app = Flask(
        __name__,
        static_folder='./static',
        template_folder='./templates'
        )
    #app.secret_key = secrets.token_hex(16)
    app.config['SECRET_KEY'] = secrets.token_hex(16)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    return app