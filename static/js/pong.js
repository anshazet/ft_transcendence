'use strict';

import { ballMove, computerMove, playerMove, draw, reset, init_game } from "./game_logic.js";
import { draw_scene, init_program_info, init_webgl } from "./webgl.js";
import * as engine from "./engine.js";

var canvas;
var game;
var anim;
var gl;
var programInfo;

const is3D = true;

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

function play() {
	if (is3D)
		draw_scene(gl, programInfo);
	else
		draw(canvas, game);

    game = computerMove(game);
    game = ballMove(canvas, game);

    anim = requestAnimationFrame(play);
	engine.update();
}

function stop() {
    cancelAnimationFrame(anim);

    game = reset(canvas);

	game.computer.score = 0;
	game.player.score = 0;

	document.querySelector('#computer-score').textContent = game.computer.score;
	document.querySelector('#player-score').textContent = game.player.score;

    if (is3D)
		draw_scene(gl, programInfo);
	else
		draw(canvas, game);
}

function playerMovement(event) {
	game = playerMove(event, canvas, game);
}

window.onload = (event) => {
	canvas = document.getElementById('jeu-pong');

	if (is3D)
	{
		gl = init_webgl(canvas, vsSource, fsSource);
		programInfo = init_program_info(gl);
	}

    console.log(canvas);
    if (canvas) {
        game = init_game();
    } else {
        console.error("Canvas element not found.");
	}

	game = reset(canvas);

    // Mouse move event
    canvas.addEventListener('mousemove', playerMovement);

    document.querySelector('#start-game').addEventListener('click', play);
    document.querySelector('#stop-game').addEventListener('click', stop);
};