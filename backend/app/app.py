from flask_migrate import Migrate
from dotenv import load_dotenv
from flask import Flask

from .containers import Container
from .config import configure_db, db
from .controllers import index, create_formula

load_dotenv()

container = Container()

app = Flask(__name__)
app.container = container
configure_db(app)
migrate = Migrate(app, db)

app.route("/")(index)
app.route("/formula/create", methods=['POST'])(create_formula)
