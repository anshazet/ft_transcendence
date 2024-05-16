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
			normals: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
			vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
			textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
		},
		uniformLocations: {
		  projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
		  modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
		  uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
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
	const texture = loadTexture(gl, 'cubetexture.png');
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
		const numComponents = 3;
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
			offset,);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}

	{
		const numComponents = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
		gl.vertexAttribPointer(
			programInfo.attribLocations.normals,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		);
		gl.enableVertexAttribArray(programInfo.attribLocations.normals);
	}

	{
		const num = 2; // chaque coordonnée est composée de 2 valeurs
		const type = gl.FLOAT; // les données dans le tampon sont des flottants 32 bits
		const normalize = false; // ne pas normaliser
		const stride = 0; // combien d'octets à récupérer entre un jeu et le suivant
		const offset = 0; // à combien d'octets du début faut-il commencer
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
		gl.vertexAttribPointer(
			programInfo.attributeLocations.textureCoord,
			num,
			type,
			normalize,
			stride,
			offset,
		);
		gl.enableVertexAttribArray(programInfo.attributeLocations.textureCoord);
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

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

	gl.useProgram(programInfo.program);

	var normalMatrix = mvMatrix.inverse();
	normalMatrix = normalMatrix.transpose();
	var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");

	gl.uniformMatrix4fv(
		nUniform,
		false,
		new Float32Array(normalMatrix.flatten()),
	);

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
		const vertexCount = 36;
		const type = gl.UNSIGNED_SHORT;
		const offset = 0;
		gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}
}

export function initBuffers(gl)
{

	const positions = [
		// Face avant
		-1.0, -1.0, 2.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,
	  
		// Face arrière
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,
	  
		// Face supérieure
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0,
	  
		// Face inférieure
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,
	  
		// Face droite
		1.0, -1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,
	  
		// Face gauche
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0,
	];

	var vertexNormals = [
		// Front
		0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

		// Back
		0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

		// Top
		0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

		// Bottom
		0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

		// Right
		1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

		// Left
		-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
	];

	const indices = [
		0,  1,  2,      0,  2,  3,    // avant
		4,  5,  6,      4,  6,  7,    // arrière
		8,  9,  10,     8,  10, 11,   // haut
		12, 13, 14,     12, 14, 15,   // bas
		16, 17, 18,     16, 18, 19,   // droite
		20, 21, 22,     20, 22, 23,   // gauche
	];

	const faceColors = [
		[1.0, 1.0, 1.0, 1.0], // Face avant : blanc
		[1.0, 0.0, 0.0, 1.0], // Face arrière : rouge
		[0.0, 1.0, 0.0, 1.0], // Face supérieure : vert
		[0.0, 0.0, 1.0, 1.0], // Face infiérieure : bleu
		[1.0, 1.0, 0.0, 1.0], // Face droite : jaune
		[1.0, 0.0, 1.0, 1.0], // Face gauche : violet
	];

	var colors = [];
	var j;
	for (j = 0; j < faceColors.length; j++) {
		const c = faceColors[j];
		colors = colors.concat(c, c, c, c);
	}

	const textureCoordinates = [
		// Front
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Back
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Top
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Bottom
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Right
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Left
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
	];

	const textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

	const normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	
	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		position: positionBuffer,
		normals: normalBuffer,
		color: colorBuffer,
		indices: indexBuffer,
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

export function loadTexture(gl, url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
  
	// Du fait que les images doivent être téléchargées depuis l'internet,
	// il peut s'écouler un certain temps avant qu'elles ne soient prêtes.
	// Jusque là, mettre un seul pixel dans la texture, de sorte que nous puissions
	// l'utiliser immédiatement. Quand le téléchargement de la page sera terminé,
	// nous mettrons à jour la texture avec le contenu de l'image.
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]); // bleu opaque
	gl.texImage2D(
	  gl.TEXTURE_2D,
	  level,
	  internalFormat,
	  width,
	  height,
	  border,
	  srcFormat,
	  srcType,
	  pixel,
	);
  
	const image = new Image();
	image.onload = function () {
	  gl.bindTexture(gl.TEXTURE_2D, texture);
	  gl.texImage2D(
		gl.TEXTURE_2D,
		level,
		internalFormat,
		srcFormat,
		srcType,
		image,
	  );  
	  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
		gl.generateMipmap(gl.TEXTURE_2D);
	  } else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	  }
	};
	image.src = url;
  
	return texture;
  }
  
  function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
  }