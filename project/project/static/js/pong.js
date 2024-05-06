'use strict';

import * as mat4 from "./esm/mat4.js";

var canvas;
var game;
var anim;
var gl;
var shaderProgram;
var programInfo;

const is3D = true;
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const MAX_SPEED = 12;

const vsSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;

const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

function initBuffers(gl){
	const positionBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	return {
		position: positionBuffer,
	};
}

function draw() {
	if (!is3D) {
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
		context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
		context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);

		// Draw ball
		context.beginPath();
		context.fillStyle = 'white';
		context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
		context.fill();
	} else {
		const buffers = initBuffers(gl);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const fieldOfView = (45 * Math.PI) / 180; // en radians
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = mat4.create();

		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
		const modelViewMatrix = mat4.create();
		mat4.translate(
			modelViewMatrix,
			modelViewMatrix,
			[-0.0, 0.0, -6.0],
		);
  		{
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset,
			);
			gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
		}

		gl.useProgram(programInfo.program);
		gl.uniformMatrix4fv(
    		programInfo.uniformLocations.projectionMatrix,
    		false,
    		projectionMatrix,
		);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix,
		);

		{
			const offset = 0;
			const vertexCount = 4;
			gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
		}
	}
}

function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
  
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	  alert(
		"Impossible d'initialiser le programme shader : " +
		  gl.getProgramInfoLog(shaderProgram),
	  );
	  return null;
	}
  
	return shaderProgram;
}

function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
	
	gl.shaderSource(shader, source);
	gl.compileShader(shader);	

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(
			"An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader),
		);
		gl.deleteShader(shader);
		return null;
	}
	
	return shader;
}

function changeDirection(playerPosition) {
    var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);

    // Get a value between 0 and 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

function playerMove(event) {
    // Get the mouse location in the canvas
    var canvasLocation = canvas.getBoundingClientRect();
    var mouseLocation = event.clientY - canvasLocation.y;

    if (mouseLocation < PLAYER_HEIGHT / 2) {
        game.player.y = 0;
    } else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
        game.player.y = canvas.height - PLAYER_HEIGHT;
    } else {
        game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
    }
}

function computerMove() {
    game.computer.y += game.ball.speed.y * game.computer.speedRatio;
}

function collide(player) {
    // The player does not hit the ball
    if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {
        reset();

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
        changeDirection(player.y);

        // Increase speed if it has not reached max speed
        if (Math.abs(game.ball.speed.x) < MAX_SPEED) {
            game.ball.speed.x *= 1.2;
        }
    }
}

function ballMove() {
    // Rebounds on top and bottom
    if (game.ball.y > canvas.height || game.ball.y < 0) {
        game.ball.speed.y *= -1;
    }

    if (game.ball.x > canvas.width - PLAYER_WIDTH) {
        collide(game.computer);
    } else if (game.ball.x < PLAYER_WIDTH) {
        collide(game.player);
    }
    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}

function play() {
    draw();

    computerMove();
    ballMove();

    anim = requestAnimationFrame(play);
}

function reset() {
    // Set ball and players to the center
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

    // Reset speed
    game.ball.speed.x = 3;
    game.ball.speed.y = Math.random() * 3;
}

function stop() {
    cancelAnimationFrame(anim);

    reset();

    // Init score
    game.computer.score = 0;
    game.player.score = 0;

    document.querySelector('#computer-score').textContent = game.computer.score;
    document.querySelector('#player-score').textContent = game.player.score;

    draw();
}

document.addEventListener('DOMContentLoaded', function () {
    canvas = document.getElementById('jeu-pong');
	if (is3D)
	{
		gl = canvas.getContext("webgl");

		if (!gl) {
			alert("Impossible d'initialiser WebGL. Votre navigateur ou votre machine peut ne pas le supporter.",);
			return;
		}
		console.log("WebGL initialized.");
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		shaderProgram = initShaderProgram(gl, vsSource, fsSource);
		programInfo = {
			program: shaderProgram,
			attribLocations: {
			  vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
			},
			uniformLocations: {
			  projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
			  modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
			},
		};
	}
    console.log(canvas);
    if (canvas)
    {
        game = {
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
    } else {
        console.error("Canvas element not found.");
};

    reset();

    // Mouse move event
    canvas.addEventListener('mousemove', playerMove);

    document.querySelector('#start-game').addEventListener('click', play);
    document.querySelector('#stop-game').addEventListener('click', stop);

});