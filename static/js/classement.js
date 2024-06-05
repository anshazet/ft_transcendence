var sectionHistorique = document.getElementById('section-historique');
var gameHistoryList = document.getElementById('game-history-list');
var totalGamesPlayed = document.getElementById('total-games');
var gamesWon = document.getElementById('won-games');

function fetchGameHistory() {
    fetch('/get_game_history/')
        .then(response => response.json())
        .then(data => {
            gameHistoryList.innerHTML = '';
            data.game_history.forEach(function(game) {
                var listItem = document.createElement('li');
                var player1Name = game.current_user;
                var winnerName = game.player1_won ? player1Name : 'Invité';
                listItem.textContent = player1Name + ' : ' + game.player1_score + ' || Invité : ' + game.player2_score + ' ---> Gagnant : ' + winnerName;
                gameHistoryList.appendChild(listItem);
            });
            totalGamesPlayed.textContent = data.total_games_played;
            gamesWon.textContent = data.games_won;
        })
        .catch(error => console.error('Erreur lors de la récupération des données d\'historique :', error));
}




fetchGameHistory();

document.getElementById('sendGameDataButton').addEventListener('click', function() {
    // Construire le JSON avec les données du jeu
    var gameData = {
        player1_score: 100,
        player2_score: 80,
    };

    // Envoyer une requête POST avec les données JSON
    fetch('/save_game_history/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ game_data: gameData })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Données envoyées avec succès :', data);
        alert('Données envoyées avec succès');
        fetchGameHistory(); // Actualiser l'historique des parties après l'envoi des données
    })
    .catch((error) => {
        console.error('Erreur lors de l\'envoi des données :', error);
        alert('Erreur lors de l\'envoi des données');
    });
});

// Fonction pour obtenir le cookie CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}