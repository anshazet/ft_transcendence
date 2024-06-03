document.addEventListener('DOMContentLoaded', function() {
  var sectionHistorique = document.getElementById('section-historique');
  var gameHistoryList = document.getElementById('game-history-list');
  var totalGamesPlayed = document.getElementById('total-games');
  var gamesWon = document.getElementById('won-games');

  function fetchGameHistory() {
      fetch('/get_game_history')
          .then(response => response.json())
          .then(data => {
              gameHistoryList.innerHTML = '';
              data.game_history.forEach(function(game) {
                  var listItem = document.createElement('li');
                  listItem.textContent = 'Joueur 1 : ' + game.player1_score + ', Joueur 2 : ' + game.player2_score + ', Date : ' + game.date_played;
                  gameHistoryList.appendChild(listItem);
              });
              totalGamesPlayed.textContent = data.total_games_played;
              gamesWon.textContent = data.games_won;
          })
          .catch(error => console.error('Erreur lors de la récupération des données d\'historique :', error));
  }
  fetchGameHistory();
});
