import * as mat4 from "./esm/mat4.js";
var shaderProgram;
var gl;
var programInfo;

export function init_program_info(gl)
{
	programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
		},
		uniformLocations: {
		  projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
		  modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
		},
	};
}

export function init_webgl(canvas, vsSource, fsSource)
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
	init_program_info(gl);
}

export function draw_scene()
{
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

	{
		const numComponents = 4;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexColor,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
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

export function initBuffers(gl)
{

	const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const colors = [
		1.0,  1.0,  1.0,  1.0,    // blanc
		1.0,  0.0,  0.0,  1.0,    // rouge
		0.0,  1.0,  0.0,  1.0,    // vert
		0.0,  0.0,  1.0,  1.0,    // bleu
	];
	
	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	
	return {
		position: positionBuffer,
		color: colorBuffer,
	};
}

export function initShaderProgram(gl, vsSource, fsSource)
{
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

export function loadShader(gl, type, source)
{
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