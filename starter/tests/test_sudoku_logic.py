import copy

import sudoku_logic


def _is_valid_solution(board):
    size = len(board)
    expected = set(range(1, size + 1))

    for row in board:
        if set(row) != expected:
            return False

    for col in range(size):
        values = {board[row][col] for row in range(size)}
        if values != expected:
            return False

    for box_row in range(0, size, 3):
        for box_col in range(0, size, 3):
            values = {
                board[r][c]
                for r in range(box_row, box_row + 3)
                for c in range(box_col, box_col + 3)
            }
            if values != expected:
                return False

    return True


def test_generate_puzzle_has_valid_complete_solution():
    puzzle, solution = sudoku_logic.generate_puzzle(35)

    assert len(puzzle) == 9
    assert all(len(row) == 9 for row in puzzle)
    assert len(solution) == 9
    assert all(len(row) == 9 for row in solution)
    assert _is_valid_solution(solution)

    for row, col in zip(range(9), range(9)):
        assert (puzzle[row][col] == 0) or (1 <= puzzle[row][col] <= 9)


def test_generate_puzzle_has_different_clues_and_solution():
    puzzle, solution = sudoku_logic.generate_puzzle(30)

    zeroes = sum(cell == 0 for row in puzzle for cell in row)
    assert zeroes > 0
    assert zeroes < 81
    assert puzzle != solution

    if any(cell == 0 for row in puzzle for cell in row):
        assert copy.deepcopy(puzzle) != copy.deepcopy(solution)


def test_generate_puzzle_supports_difficulties():
    for difficulty in ["easy", "medium", "hard"]:
        puzzle, solution = sudoku_logic.generate_puzzle(difficulty)
        assert len(puzzle) == 9
        assert len(solution) == 9
        assert _is_valid_solution(solution)


def test_has_unique_solution_detects_non_unique_boards():
    board = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]
    assert sudoku_logic.has_unique_solution(board) is True

    non_unique = [
        [5, 3, 4, 0, 7, 8, 9, 1, 2],
        [6, 7, 2, 0, 9, 5, 3, 0, 8],
        [0, 9, 8, 0, 4, 2, 5, 6, 7],
        [0, 0, 9, 0, 6, 1, 0, 2, 3],
        [4, 0, 6, 8, 5, 3, 7, 9, 1],
        [0, 1, 3, 0, 2, 0, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 0],
        [2, 8, 0, 0, 1, 0, 6, 0, 5],
        [3, 0, 5, 0, 8, 6, 1, 7, 9],
    ]
    assert sudoku_logic.has_unique_solution(non_unique) is False
