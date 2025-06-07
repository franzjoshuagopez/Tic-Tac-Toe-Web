const header_status = document.getElementById("game-status");
const player1_score = document.getElementById("player1-score");
const player2_score = document.getElementById("player2-score");
const clicksound = document.getElementById("click-sound");
const winsound = document.getElementById("win-sound");
const players = {
    X: "Player 1",
    O: "Player 2"
};
let gameisover = false;

document.addEventListener("DOMContentLoaded", () => {

    const init_board = [...document.querySelectorAll(".board-cell")].map(cell => cell.textContent.trim());
    const init_filled = init_board.filter(Boolean).length;
    const init_player = init_filled % 2 === 0 ? "Player 1" : "Player 2";
    header_status.textContent = `${init_player}'s turn`;

    document.querySelectorAll('.board-cell').forEach(cell => {
        cell.addEventListener('click', async () => {
            if (gameisover) return;
            clicksound.currentTime = 0.3;
            clicksound.play();
            const cellIndex = cell.dataset.cell;
            const res = await fetch('/move', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({cell: cellIndex})
            });

            const data = await res.json();

            if (data.success){
                data.board.forEach( (val,i) => {
                    const cell = document.querySelector(`[data-cell="${i}"]`);
                    if(cell) {
                        cell.textContent = val;
                    } else {
                        console.warn(`No element found for data-cell="${i}"`);
                    }
                });

                if (data.winner){
                    header_status.textContent = `${players[data.winner]} wins!`;
                    player1_score.textContent = `Score: ${data.player1score}`;
                    player2_score.textContent = `Score: ${data.player2score}`;
                    setTimeout(() => {
                        winsound.currentTime = 0;
                        winsound.play();
                    }, 300);
                    gameisover = true;

                }
                else if (data.draw){
                    header_status.textContent = "it is a draw!";
                    gameisover = true;
                }
                else{
                    const change_player = data.board.filter(Boolean).length % 2 === 0 ? "X" : "O";
                    header_status.textContent = `${players[change_player]}'s turn`;
                }
            } else {
                alert(data.message);
            }
        });
    });

    const reset_button = document.getElementById("game-reset");
    if (reset_button){
        reset_button.addEventListener("click", async () => {
            const reset = await fetch("/reset", { method: "POST"});
            const data = await reset.json();

            if (data.success) {
                document.querySelectorAll(".board-cell").forEach(cell => {
                    cell.textContent = "";
                });
                header_status.textContent = "Player 1's turn";
                gameisover = false;
            }
        });
    }

});