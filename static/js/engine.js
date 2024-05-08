export var FrameTime = 0
export const PLAYER_HEIGHT = 100;
export const PLAYER_WIDTH = 5;
export const MAX_SPEED = 12;
var lastLoop = new Date, thisLoop;

export function update() {
	thisLoop = new Date;
	FrameTime = thisLoop - lastLoop;
	lastLoop = thisLoop;
}