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

## Refactoring Notes

The application is organized into focused, reusable components:

- `starter/app.py` contains Flask routes and request/response handling.
- `starter/sudoku_logic.py` encapsulates board creation, solving, validation, and puzzle generation.
- `starter/static/main.js` manages browser state, rendering, timer behavior, validation, hints, and the leaderboard.
- `starter/templates/index.html` contains the page structure, while `starter/static/styles.css` contains presentation rules.
- `starter/tests/test_sudoku_logic.py` verifies the reusable Sudoku logic independently from the web layer.

This separation keeps the game rules testable and lets the UI call shared behavior without duplicating Sudoku algorithms. Names are descriptive, functions have focused responsibilities, and the existing board representation is reused throughout the application.

## Error Handling and Documentation

Invalid difficulty values are rejected by the domain layer and returned by the Flask endpoint as a JSON `400` response. The browser handles failed requests with user-facing messages, while successful responses use the same JSON shape across the game endpoints. The code includes focused explanatory documentation where behavior crosses the route, domain, and browser layers; `instruction.md` records the project conventions for future contributors and Copilot-assisted changes.

## Verification

Run the automated tests from the `starter/` directory:

```bash
pytest -q
```

Start the application to verify the complete workflow:

```bash
python app.py
```

The refactored application was verified with the test suite and can be exercised at `http://127.0.0.1:5000`.

## References

- [JavaScript Modules - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Refactoring Techniques - Refactoring.Guru](https://refactoring.guru/refactoring)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [JavaScript `try...catch` - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [Google JavaScript Style Guide: Comments](https://google.github.io/styleguide/jsguide.html#formatting-comments)
