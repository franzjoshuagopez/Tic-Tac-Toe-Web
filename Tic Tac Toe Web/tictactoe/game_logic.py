WINNING_COMBOS = [
[0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
[0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
[0, 4, 8], [2, 4, 6]              # Diagonals
]

def check_winner(board):
    for cell1, cell2, cell3 in WINNING_COMBOS:
        if board[cell1] and board[cell1] == board[cell2] and board[cell1] == board[cell3]:
            return board[cell1]
    return None