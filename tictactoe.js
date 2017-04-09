/*Tic Tac Toe - Athul Ganesh
    Unfortunately, while running this on Codepen, it doesn't run as smoothly as on the browser directly because I used a minimax algorithm. But the program is fully functional and never loses and always goes for the win if it has one.
    I used a game object to store all the important variables and functions and used a bootstrap modal to let the users pick either X or O.
    In my game, X always goes first.
*/

//Game Object that contains the board, and methods to calculate computer moves.
var game = {
    //0-Empty, 1: X, -1: O
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    //Shows the status of board onto the div.
    displayBoard: function(board) {
        for (var i=0; i<9; i++) {
            if (board[i] === 1) {
                $("#text" + i).html("X");
            } else if (board[i] === -1) {
                $("#text" + i).html("O");
            } else {
                $('#text' + i).html("");
            }
        }
        
        if (board[0] === board[1] && board[1] === board[2] && board[0] !== 0)
            $('#square0, #square1, #square2').animate({'background-color': '#000'}, 1200);
        if (board[3] === board[4] && board[4] === board[5] && board[4] !== 0)
            $('#square3, #square4, #square5').animate({'background-color': '#000'}, 1200);
        if (board[6] === board[7] && board[7] === board[8] && board[6] !== 0)
            $('#square6, #square7, #square8').animate({'background-color': '#000'}, 1200);
        
        if (board[0] === board[3] && board[3] === board[6] && board[0] !== 0)
            $('#square0, #square3, #square6').animate({'background-color': '#000'}, 1200);
        if (board[1] === board[4] && board[4] === board[7] && board[4] !== 0)
            $('#square1, #square4, #square7').animate({'background-color': '#000'}, 1200);
        if (board[2] === board[5] && board[5] === board[8] && board[2] !== 0)
            $('#square2, #square5, #square8').animate({'background-color': '#000'}, 1200);
        
        if (board[0] === board[4] && board[4] === board[8] && board[4] !== 0)
            $('#square0, #square4, #square8').animate({'background-color': '#000'}, 1200);
        if (board[2] === board[4] && board[4] === board[6] && board[4] !== 0)
            $('#square2, #square4, #square6').animate({'background-color': '#000'}, 1200);
    },
    //Checks if the game state is won and returns a boolean
    checkWin: function(board) {
        if ((board[0] === board[1] && board[1] === board[2] && board[0] !== 0) ||
            (board[3] === board[4] && board[4] === board[5] && board[4] !== 0) ||
            (board[6] === board[7] && board[7] === board[8] && board[6] !== 0)) {
            return true;
        }
        else if ((board[0] === board[3] && board[3] === board[6] && board[0] !== 0) ||
            (board[1] === board[4] && board[4] === board[7] && board[4] !== 0) ||
            (board[2] === board[5] && board[5] === board[8] && board[2] !== 0)) {
            return true;
        }
        else if ((board[0] === board[4] && board[4] === board[8] && board[4] !== 0) ||
            (board[2] === board[4] && board[4] === board[6] && board[4] !== 0)) {
            return true;
        }
        else {
            return false;
        }
    },
    //Checks for a draw and returns a boolean
    checkDraw: function(board) {
        var counter = 0;
        for (var i = 0; i<9; i++) {
            if (board[i] !== 0) {
                counter++;
            }
        }
        if (counter === 9) {
            return true;
        }
        else {
            return false;
        }
    },
    //Evaluates the board for X.
    maxEval: function(board) {
        if (game.checkWin(board)) {
            return -1000;
        }
        else if (game.checkDraw(board)) {
            return 0;
        }
        var finalScore = -1000;
        for (var i = 0; i < 9; i++) {
            if (board[i] === 0) {
                board[i] = 1;
                var score = game.minEval(board);
                if (score > finalScore) {
                    finalScore = score;
                }
                board[i] = 0;
            }
        }
        return finalScore;
    },
    //Evaluates the board for O.
    minEval: function(board) {
        if (game.checkWin(board)) {
            return 1000;
        }
        else if (game.checkDraw(board)) {
            return 0;
        }
        
        var finalScore = 1000;
        for (var i = 0; i < 9; i++) {
            if (board[i] === 0) {
                board[i] = -1;
                var score = game.maxEval(board);
                if (score < finalScore) {
                    finalScore = score;
                }
                board[i] = 0;
            }
        }
        return finalScore;
    },
    //human Object with player, icon, turn, and a playMove function.
    human: {
        player: -1,
        icon: "O",
        //The turn is used to determine whether it is ok for the human to move and the victor of the game.
        turn: false,
        //This function places the human's icon (X or O) on the respective position, but is in fact never used in the program.
        playMove: function(board, position) {
            board[position] = game.human.player;
        }
    },
    //computer object with identical functions as that of the human.
    computer: {
        player: 1,
        icon: "X",
        turn: true,
        //This function is the critical component of the program. It utilizes maxEval and minEval to determine which position to place the icon for the computer. This is an implementation of the minimax algorithm (including maxEval and minEval). So the basic idea: The algorithm tries all possible moves in a position and also finds all possible combinations after the move and returns a score for every move for either X or O depending on what the computer is playing. So in essence, it calculates all possible variations, and the respective score with each variation (1000 for X win, -1000 for O win and 0 for a draw) and places the icon on the one with the highest score.
        playMove: function(board) {
            var finalScore = game.computer.player * -1000;
            var position;
            for (var i = 0; i < 9; i++) {
                if (board[i] === 0) {
                    board[i] = game.computer.player;
                    var score;
                    if (game.computer.player === 1) {
                        score = game.minEval(board);
                    }
                    else {
                        score = game.maxEval(board);
                    }
                    if (game.computer.player === 1 && score > finalScore) {
                        finalScore = score;
                        position = i;
                    }
                    else if (game.computer.player === -1 && score < finalScore) {
                        finalScore = score;
                        position = i;
                    }
                    board[i] = 0;
                }
            }

            board[position] = game.computer.player;
        }
    },
    //Resets the board and the color of the square divs.
    reset: function() {
        game.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 9; i++) {
            $('#square' + i).css("background-color", "#594B31");
        }
    },
    //Method that computer uses to play. It includes the game.computer.playMove function among others.
    playProcedure: function() {
        if(!game.checkDraw(game.board) && !game.checkWin(game.board)) {
            if (game.computer.turn === true) {
                game.computer.playMove(game.board);
                game.displayBoard(game.board);
                game.terminal();
                //The turn is needed to determine the victor of the game and is necessary to know if this particular segment of code is to be executed.
                game.computer.turn = false;
                game.human.turn = true;
            }
        }
    },
    //The terminal function performs some actions when the game is in a terminal state (that is the game is over).
    terminal: function() {
        //If the game is a draw or a win, the same modal is brought up again so the user can select either X or O and play another game.
        if (game.checkDraw(game.board) && !game.checkWin(game.board)) {
            $('#who-won').html("It's a draw.");
            setTimeout(function() {
                $('#play-again').modal({"backdrop": "static"});
                $('#play-again').modal('show');
            }, 1000);
            game.displayBoard(game.board);
        }
        else if (game.checkWin(game.board)) {
            if (game.computer.turn === true) {
                $('#who-won').html("You Lose. The Computer Wins.");
            }
            else {
                $('#who-won').html("You Win!");
            }
            setTimeout(function() {
                $('#play-again').modal({"backdrop": "static"});
                $('#play-again').modal('show');
            }, 2000);
            
            
            game.displayBoard(game.board);
        }
    },
    //This function was added to simplify the content in each of the #square click functions to save space.
    squareOptions: function(board) {
        if (game.checkDraw(game.board) || game.checkWin(game.board)) {
            game.terminal();
        }
        else {
            game.human.turn = false;
            game.computer.turn = true;
            game.playProcedure();
        }
    }
};

$(document).ready(function() {
    //Shows the modal on startup.
    $("#choose-player").modal({"backdrop": "static"});
    $('#choose-player').modal('show');
    
    //Respective settings if the human selects either X or O.
    $(".x-button").click(function() {
        game.reset();
        game.displayBoard(game.board);
        game.human.player = 1;
        game.human.icon = "X";
        game.human.turn = true;
        game.computer.player = -1;
        game.computer.icon = "O";
        game.computer.turn = false;
    });
    $(".o-button").click(function() {
        game.reset();
        game.displayBoard(game.board);
        game.human.player = -1;
        game.human.icon = "O";
        game.human.turn = false;
        game.computer.player = 1;
        game.computer.icon = "X";
        game.computer.turn = true;
        game.playProcedure();
    });
    
    //Unfortunately, I did not find a quicker way of doing this apart from using the class square and getting the substring of the id, which seemed even more of a hassle than what I have, so I stuck to this.
    $('#square0').click(function() {
        if (game.human.turn === true && !game.checkDraw(game.board) && !game.checkWin(game.board) && game.board[0] === 0) {
            game.board[0] = game.human.player;
            game.displayBoard(game.board);
            game.squareOptions(game.board);
        }
    });
    $('#square1').click(function() {
        if (game.human.turn === true && !game.checkDraw(game.board) && !game.checkWin(game.board) && game.board[1] === 0) {
            game.board[1] = game.human.player;
            game.displayBoard(game.board);
            game.squareOptions(game.board);
        }
    });
    $('#square2').click(function() {
        if (game.human.turn === true && !game.checkDraw(game.board) && !game.checkWin(game.board) && game.board[2] === 0) {
            game.board[2] = game.human.player;
            game.displayBoard(game.board);
            game.squareOptions(game.board);
        }
    });
    $('#square3').click(function() {
        if (game.human.turn === true && !game.checkDraw(game.board) && !game.checkWin(game.board) && game.board[3] === 0) {
            game.board[3] = game.human.player;
            game.displayBoard(game.board);
            game.squareOptions(game.board);
        }
    });
    $('#square4').click(function() {
        if (game.human.turn === true && !game.checkDraw(game.board) && !game.checkWin(game.board) && game.board[4] === 0) {
            game.board[4] = game.human.player;
            game.displayBoard(game.board);
            game.squareOptions(game.board);
        }
    });
    $('#square5').click(function() {
        if (game.human.turn === true && !game.checkDraw(game.board) && !game.checkWin(game.board) && game.board[5] === 0) {
            game.board[5] = game.human.player;
            game.displayBoard(game.board);
            game.squareOptions(game.board);
        }
    });
    $('#square6').click(function() {
        if (game.human.turn === true && !game.checkDraw(game.board) && !game.checkWin(game.board) && game.board[6] === 0) {
            game.board[6] = game.human.player;
            game.displayBoard(game.board);
            game.squareOptions(game.board);
        }
    });
    $('#square7').click(function() {
        if (game.human.turn === true && !game.checkDraw(game.board) && !game.checkWin(game.board) && game.board[7] === 0) {
            game.board[7] = game.human.player;
            game.displayBoard(game.board);
            game.squareOptions(game.board);
        }
    });
    $('#square8').click(function() {
        if (game.human.turn === true && !game.checkDraw(game.board) && !game.checkWin(game.board) && game.board[8] === 0) {
            game.board[8] = game.human.player;
            game.displayBoard(game.board);
            game.squareOptions(game.board);
        }
    });
});