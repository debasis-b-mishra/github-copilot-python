from flask import Flask, jsonify, render_template, request

import sudoku_logic

app = Flask(__name__)

CURRENT = {
    "puzzle": None,
    "solution": None,
    "difficulty": "easy",
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/new")
def new_game():
    difficulty = request.args.get("difficulty", "easy")
    try:
        puzzle, solution = sudoku_logic.generate_puzzle(difficulty)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    CURRENT["puzzle"] = puzzle
    CURRENT["solution"] = solution
    CURRENT["difficulty"] = str(difficulty).lower()
    return jsonify({
        "puzzle": puzzle,
        "solution": solution,
        "difficulty": CURRENT["difficulty"],
    })


@app.route("/check", methods=["POST"])
def check_solution():
    data = request.get_json(silent=True) or {}
    board = data.get("board")
    solution = CURRENT.get("solution")
    if solution is None:
        return jsonify({"error": "No game in progress"}), 400

    incorrect = []
    for row in range(sudoku_logic.SIZE):
        for col in range(sudoku_logic.SIZE):
            value = board[row][col] if board and len(board) > row else 0
            if value != solution[row][col]:
                incorrect.append([row, col])

    return jsonify({"incorrect": incorrect, "solved": not incorrect})


@app.route("/validate-unique", methods=["POST"])
def validate_unique():
    data = request.get_json(silent=True) or {}
    board = data.get("board")
    if board is None:
        return jsonify({"error": "Board is required"}), 400
    return jsonify({"unique": sudoku_logic.has_unique_solution(board)})


if __name__ == "__main__":
    app.run(debug=True)