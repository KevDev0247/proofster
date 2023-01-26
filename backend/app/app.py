from flask_migrate import Migrate
from dotenv import load_dotenv
from flask import Flask
from config import configure_db, db
from controllers import create_function_atom, create_function_function, create_binary, create_unary, index

load_dotenv()

app = Flask(__name__)
configure_db(app)
migrate = Migrate(app, db)

app.route("/")(index)
app.route('/function-atom', methods=['POST'])(create_function_atom)
app.route('/function-function', methods=['POST'])(create_function_function)
app.route('/binary', methods=['POST'])(create_binary)
app.route('/unary', methods=['POST'])(create_unary)
