import copy
import random

SIZE = 9
BOX_SIZE = 3
EMPTY = 0
DIFFICULTY_SETTINGS = {
    "easy": 40,
    "medium": 32,
    "hard": 26,
}


def deep_copy(board):
    return copy.deepcopy(board)


def create_empty_board():
    return [[EMPTY for _ in range(SIZE)] for _ in range(SIZE)]


def is_safe(board, row, col, num):
    for x in range(SIZE):
        if board[row][x] == num or board[x][col] == num:
            return False

    start_row = row - row % BOX_SIZE
    start_col = col - col % BOX_SIZE
    for i in range(BOX_SIZE):
        for j in range(BOX_SIZE):
            if board[start_row + i][start_col + j] == num:
                return False
    return True


def find_empty_cell(board):
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                return row, col
    return None


def fill_board(board):
    empty_cell = find_empty_cell(board)
    if empty_cell is None:
        return True

    row, col = empty_cell
    values = list(range(1, SIZE + 1))
    random.shuffle(values)

    for number in values:
        if is_safe(board, row, col, number):
            board[row][col] = number
            if fill_board(board):
                return True
            board[row][col] = EMPTY
    return False


def remove_cells(board, clues):
    cells_to_remove = SIZE * SIZE - clues
    positions = [(row, col) for row in range(SIZE) for col in range(SIZE)]
    random.shuffle(positions)

    for row, col in positions:
        if cells_to_remove <= 0:
            break
        original = board[row][col]
        board[row][col] = EMPTY
        if not has_unique_solution(board):
            board[row][col] = original
        else:
            cells_to_remove -= 1


def solve_board(board):
    empty_cell = find_empty_cell(board)
    if empty_cell is None:
        return True

    row, col = empty_cell
    for number in range(1, SIZE + 1):
        if is_safe(board, row, col, number):
            board[row][col] = number
            if solve_board(board):
                return True
            board[row][col] = EMPTY
    return False


def has_unique_solution(board):
    working_board = deep_copy(board)
    solutions = 0

    def search(board_state):
        nonlocal solutions
        if solutions > 1:
            return
        empty_cell = find_empty_cell(board_state)
        if empty_cell is None:
            solutions += 1
            return

        row, col = empty_cell
        for number in range(1, SIZE + 1):
            if is_safe(board_state, row, col, number):
                board_state[row][col] = number
                search(board_state)
                board_state[row][col] = EMPTY
                if solutions > 1:
                    return

    search(working_board)
    return solutions == 1


def normalize_difficulty(difficulty):
    if isinstance(difficulty, int):
        return max(17, min(SIZE * SIZE, difficulty))

    key = str(difficulty).lower()
    if key in DIFFICULTY_SETTINGS:
        return DIFFICULTY_SETTINGS[key]

    raise ValueError(f"Unsupported difficulty: {difficulty}")


def generate_puzzle(difficulty="easy"):
    clues = normalize_difficulty(difficulty)
    board = create_empty_board()
    fill_board(board)
    solution = deep_copy(board)
    puzzle = deep_copy(board)
    remove_cells(puzzle, clues)
    return puzzle, solution


def is_complete(board):
    return all(cell != EMPTY for row in board for cell in row)
