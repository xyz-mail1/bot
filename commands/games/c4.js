const { Connect4 } = require('discord-gamecord');
module.exports = {
  name: 'c4',
  execute(client, message, args) {
    const opp = message.mentions.members.first();
    const Game = new Connect4({
      message: message,
      isSlashGame: false,
      opponent: opp,
      embed: {
        title: 'Connect4 Game',
        statusTitle: 'Status',
        color: '#5865F2'
      },
      emojis: {
        board: '⚪',
        player1: '🔴',
        player2: '🟡'
      },
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: 'PRIMARY',
      turnMessage: '{emoji} | Its turn of player **{player}**.',
      winMessage: '{emoji} | **{player}** won the Connect4 Game.',
      tieMessage: 'The Game tied! No one won the Game!',
      timeoutMessage: 'The Game went unfinished! No one won the Game!',
      playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
    });

    Game.startGame();
    Game.on('gameOver', result => {
      console.log(result);  // =>  { result... }
    })
  },
}
