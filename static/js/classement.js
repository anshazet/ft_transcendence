fetch('/record_game/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      player1_id: player1Id,
      player2_id: player2Id,
      player1_score: player1Score,
      player2_score: player2Score,
      date_played: new Date().toISOString(),
      winner_id: winnerId
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  