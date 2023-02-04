from flask_migrate import Migrate
from dotenv import load_dotenv
from flask import Flask, Blueprint
from flask_cors import CORS
from .containers import Container
from .config import configure_db, db
from .controllers.FormulaController import create_formula, delete_formula, get_formulas_by_workspace, update_formula
from .controllers.WorkspaceController import create_workspace
from .controllers.UserController import register

load_dotenv()

container = Container()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.container = container
configure_db(app)
migrate = Migrate(app, db)


app.route("/api/formulas", methods=["GET"])(get_formulas_by_workspace)
app.route("/api/formula/create", methods=['POST'])(create_formula)
app.route("/api/formula/update/<int:formula_id>", methods=["PUT"])(update_formula)
app.route("/api/formula/delete/<int:formula_id>", methods=["DELETE"])(delete_formula)
app.route("/api/workspace/create", methods=['POST'])(create_workspace)
app.route("/api/user/register", methods=['POST'])(register)
