'use strict';

import * as mat4 from "./esm/mat4.js";
import { ballMove, computerMove, playerMove, draw, reset, init_game } from "./game_logic.js";
import { initBuffers } from "./webgl.js";

var canvas;
var game;
var anim;
var gl;
var shaderProgram;
var programInfo;

const is3D = false;

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
    draw(canvas, game);

    game = computerMove(game);
    game = ballMove(canvas, game);

    anim = requestAnimationFrame(play);
}

function stop() {
    cancelAnimationFrame(anim);

    game = reset(canvas);

    // Init score
    game.computer.score = 0;
    game.player.score = 0;

    document.querySelector('#computer-score').textContent = game.computer.score;
    document.querySelector('#player-score').textContent = game.player.score;

    draw();
}

function playerMovement(event) {
	game = playerMove(event, canvas, game);
}

document.addEventListener('DOMContentLoaded', function () {
    canvas = document.getElementById('jeu-pong');

    console.log(canvas);
    if (canvas)
    {
        game = init_game();
    } else {
        console.error("Canvas element not found.");
};

    game = reset(canvas);

    // Mouse move event
    canvas.addEventListener('mousemove', playerMovement);

    document.querySelector('#start-game').addEventListener('click', play);
    document.querySelector('#stop-game').addEventListener('click', stop);

});