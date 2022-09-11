from flask import Flask, request, render_template
from managers import TodoManager
from redis_om import Migrator
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/ping')
def ping():
    return 'pong'


@app.route('/redis-todo', strict_slashes=False)
def home_page():
    return render_template('index.html')


@app.route('/todo', methods=["POST"])
def set_todo():
    result = TodoManager().set_todo(request.json)
    return result.dict()


@app.route('/todos', methods=["GET"])
def get_todos():
    result = TodoManager().get_todo(request)
    return result.dict()


@app.route('/todo', methods=["PUT"])
def upsert_todos():
    result = TodoManager().upsert_todo(request.json)
    return result.dict()


@app.route('/todos', methods=["DELETE"])
def delete_todos():
    result = TodoManager().delete_todos()
    return result.dict()


if __name__ == "__main__":
    Migrator().run()
    app.run(host='0.0.0.0', port=8080)
