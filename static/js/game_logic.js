import * as engine from './engine.js';

export function init_game() {
	return {
		player: {
			score: 0
		},
		computer: {
			score: 0,
			speedRatio: 0.75
		},
		ball: {
			r: 5,
			speed: {}
		}
	} 
}

export function draw(canvas, game) {
	var context = canvas.getContext('2d');
	
	// Draw field
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw middle line
	context.strokeStyle = 'white';
	context.beginPath();
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.stroke();

	// Draw players
	context.fillStyle = 'white';
	context.fillRect(0, game.player.y, engine.PLAYER_WIDTH, engine.PLAYER_HEIGHT);
	context.fillRect(canvas.width - engine.PLAYER_WIDTH, game.computer.y, engine.PLAYER_WIDTH, engine.PLAYER_HEIGHT);

	// Draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
	context.fill();
}

export function changeDirection(playerPosition, game) {
    var impact = game.ball.y - playerPosition - engine.PLAYER_HEIGHT / 2;
    var ratio = 100 / (engine.PLAYER_HEIGHT / 2);

    // Get a value between 0 and 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
	return game;
}

export function playerMove(event, canvas, game) {
    // Get the mouse location in the canvas
    var canvasLocation = canvas.getBoundingClientRect();
    var mouseLocation = event.clientY - canvasLocation.y;

    if (mouseLocation < engine.PLAYER_HEIGHT / 2) {
        game.player.y = 0;
    } else if (mouseLocation > canvas.height - engine.PLAYER_HEIGHT / 2) {
        game.player.y = canvas.height - engine.PLAYER_HEIGHT;
    } else {
        game.player.y = mouseLocation - engine.PLAYER_HEIGHT / 2;
    }
	return game;
}

export function computerMove(game) {
    game.computer.y += game.ball.speed.y * game.computer.speedRatio * engine.FrameTime/20.0;
	return game;
}

export function collide(player, game, canvas) {
    // The player does not hit the ball
    if (game.ball.y < player.y || game.ball.y > player.y + engine.PLAYER_HEIGHT) {
        game = reset(canvas);

        // Update score
        if (player == game.player) {
            game.computer.score++;
            document.querySelector('#computer-score').textContent = game.computer.score;
        } else {
            game.player.score++;
            document.querySelector('#player-score').textContent = game.player.score;
        }
    } else {
        // Change direction
        game.ball.speed.x *= -1;
        game = changeDirection(player.y, game);

        // Increase speed if it has not reached max speed
        if (Math.abs(game.ball.speed.x) < engine.MAX_SPEED) {
            game.ball.speed.x *= 1.2;
        }
    }
	return game;
}

export function ballMove(canvas, game) {
    // Rebounds on top and bottom
	if (game.ball.y > canvas.height && game.ball.speed.y > 0) {
		game.ball.speed.y *= -1;
	}
	if (game.ball.y < 0 && game.ball.speed.y < 0) {
		game.ball.speed.y *= -1;
	}

    if (game.ball.x > canvas.width - engine.PLAYER_WIDTH) {
        game = collide(game.computer, game, canvas);
    } else if (game.ball.x < engine.PLAYER_WIDTH) {
        game = collide(game.player, game, canvas);
    }
    game.ball.x += game.ball.speed.x * engine.FrameTime/20.0;
    game.ball.y += game.ball.speed.y * engine.FrameTime/20.0;

	return game;
}

export function reset(canvas) {
    // Set ball and players to the center
	var game
	game = init_game();
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.player.y = canvas.height / 2 - engine.PLAYER_HEIGHT / 2;
    game.computer.y = canvas.height / 2 - engine.PLAYER_HEIGHT / 2;

    // Reset speed
    game.ball.speed.x = 3;
    game.ball.speed.y = Math.random() * 3;

	return game;
}