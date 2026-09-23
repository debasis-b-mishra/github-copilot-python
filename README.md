# Sudoku Challenge

This project is a refactored Flask Sudoku game with difficulty levels, a live validator, timer, hint system, and a local top-10 leaderboard.

## Running the app

1. Open a terminal in the starter folder.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the Flask app:

```bash
python app.py
```

4. Open http://127.0.0.1:5000 in a browser.

## Test command

```bash
pytest -q
```

## Features

- Multiple difficulty selections: easy, medium, and hard
- Unique-solution puzzle generation
- Live incorrect entry highlighting
- Hint button for one correct cell
- Check button for validation
- Timer for elapsed game time
- Dark mode toggle
- Persistent top 10 leaderboard saved in localStorage
- Responsive layout for desktop and mobile
