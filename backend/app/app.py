from flask_migrate import Migrate
from dotenv import load_dotenv
from flask import Flask
from config import configure_db, db
from controllers import index, create_formula

load_dotenv()

app = Flask(__name__)
configure_db(app)
migrate = Migrate(app, db)

app.route("/")(index)
app.route("/formula/create")(create_formula)
