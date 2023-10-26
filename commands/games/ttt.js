const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' })


module.exports = {
  name: "ttt",
  execute(message, args) {
    game.handleMessage(message);
  }
}

