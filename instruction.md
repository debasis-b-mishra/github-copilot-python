# Project Instructions

## Project Overview

This repository contains a Flask-based Sudoku game. The application serves the web interface from `starter/templates/` and `starter/static/`, exposes JSON endpoints from `starter/app.py`, and keeps Sudoku generation and validation logic in `starter/sudoku_logic.py`.

## Coding Style

- Use Python 3 with four spaces for indentation.
- Follow PEP 8 and use clear, descriptive `snake_case` names for functions and variables.
- Use `UPPER_SNAKE_CASE` for module-level constants.
- Keep functions focused and prefer small, readable changes over broad refactors.
- Add concise docstrings when a public function's behavior is not self-evident.
- Use standard-library functionality or the existing dependencies before adding a new package.
- Preserve existing public function names, endpoint paths, response shapes, and project structure unless the task explicitly requires a breaking change.

## Project-Specific Rules

- Flask routes belong in `starter/app.py`.
- Sudoku rules, board operations, puzzle generation, and validation belong in `starter/sudoku_logic.py`.
- HTML belongs in `starter/templates/index.html`.
- Browser behavior belongs in `starter/static/main.js`, and presentation belongs in `starter/static/styles.css`.
- Add or update tests in `starter/tests/test_sudoku_logic.py` for changes to Sudoku behavior.
- Keep the application compatible with the existing `requirements.txt`; do not introduce a framework or database for a small feature without a clear requirement.
- Maintain the existing 9x9 board model, where `0` represents an empty cell.
- Validate user-provided request data at the Flask boundary and return consistent JSON errors for invalid input.
- Do not expose debug-only behavior or hard-code generated puzzle results in production-facing logic.

## Testing and Verification

Before considering a change complete:

1. Run `pytest -q` from the `starter/` directory.
2. For route or frontend changes, start the app with `python app.py` and manually verify the affected workflow at `http://127.0.0.1:5000`.
3. Check both desktop and mobile layouts when changing the UI.

## Copilot Guidance

When implementing a request, first inspect the nearby code and existing tests. Reuse established helpers and patterns. Make the smallest complete change, explain any assumptions, and add focused tests for new behavior or edge cases.

Useful prompts for this project include:

- "Add focused pytest coverage for this Sudoku rule without changing the public API."
- "Add a Flask endpoint following the response and error-handling patterns already used in `starter/app.py`."
- "Update the Sudoku UI while preserving the existing board behavior and responsive layout."
- "Review this change for invalid board input, regressions, and missing tests."
