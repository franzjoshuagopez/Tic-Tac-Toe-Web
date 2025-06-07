from flask import Blueprint, render_template, render_template_string, session, request, jsonify
from .game_logic import check_winner

views = Blueprint('views', __name__)

@views.route('/')
def home():
    if 'board' not in session:
        session['board'] = [''] * 9
        session['player'] = 'X'
        session.setdefault('player1_score', 0)
        session.setdefault('player2_score', 0)
    return render_template("base.html", board=session['board'])

@views.route('/move', methods=['POST'])
def player_move():
    post_data = request.get_json()
    clicked_cell = int(post_data['cell'])

    board = session.get('board', [''] * 9)
    player = session.get('player', 'X')

    if board[clicked_cell] != '':
        return jsonify(success=False, message="This tile has already been played!")
    
    board[clicked_cell] = player
    session['board'] = board

    winner = check_winner(board)

    if winner:
        if player == 'X':
            session['player1_score'] += 1
        elif player == 'O':
            session['player2_score'] += 1
        return jsonify(success=True, board=board, winner=winner, player1score=session['player1_score'], player2score=session['player2_score'])
            
    
    if all(clicked_cell != "" for clicked_cell in board):
        return jsonify(success=True, board=board, draw=True)
    
    session['player'] = 'O' if player == 'X' else 'X'
    
    return jsonify(success=True, board=board)

@views.route('/reset', methods=["POST"])
def reset():
    session['board'] = [''] * 9
    session['player'] = 'X'
    
    return jsonify(success=True)