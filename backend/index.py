from flask import Flask

from problem import SeatingProblem

app = Flask(__name__)

@app.route("/solve", methods=['POST'])
def solve():
    json = request.get_json()
    return json

if __name__ == "__main__":
    app.run()
