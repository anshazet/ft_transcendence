'use strict';

import { ballMove, computerMove, playerMove, draw, reset, init_game } from "./game_logic.js";
import { draw_scene, init_webgl, initBuffers, loadTexture } from "./webgl.js";
import * as engine from "./engine.js";

var canvas;
var game;
var anim;

const is3D = true;

const vsSource = `
attribute highp vec3 aVertexNormal;
attribute highp vec3 aVertexPosition;
attribute highp vec2 aTextureCoord;

uniform highp mat4 uNormalMatrix;
uniform highp mat4 uMVMatrix;
uniform highp mat4 uPMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;

  // Apply lighting effect

  highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
  highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
  highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);

  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
}
`;

const fsSource = `
varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;

  void main(void) {
    mediump vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
`;

function play() {
	if (is3D)
		draw_scene();
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
		draw_scene();
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
		init_webgl(canvas, vsSource, fsSource);
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