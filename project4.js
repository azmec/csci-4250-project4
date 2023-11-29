/*
 * Carlos Aldana Lira
 * CSCI 4250-D01
 * Project 4.2
 *
 * Render a polygonal heart atop a pedestal. The pedestal is composed of many
 * primitive shapes of at least two different types, a unit cube and a cylinder.
 */

/*
 * Constants controlling the orthographic projection bounds.
 */
const ORTHO_Y_MAX =  8;
const ORTHO_Y_MIN = -8;
const ORTHO_X_MAX =  8;
const ORTHO_X_MIN = -8;
const ORTHO_NEAR  = -100;
const ORTHO_FAR   =  100;

/**
 * Light property definitions.
 */
const LIGHT_AMBIENT  = vec4(0.1, 0.1, 0.1, 1.0);
const LIGHT_DIFFUSE  = vec4(0.5, 0.5, 0.5, 1.0);
const LIGHT_SPECULAR = vec4(0.4, 0.4, 0.7, 1.0);
const LIGHT_POSTIION = vec4(30, 40, 40, 0.0);

// Point at which the camera looks.
const LOOK_AT_POINT = vec3(0, 0, 0);
// The relative "up" direction for the camera.
const UP_DIRECTION  = vec3(0, 1, 0);

// The number of points a face is assumed to be composed of.
const POINTS_PER_FACE = 3;

let canvas, program;

let pointsArray = [];
let normalsArray = [];

let projectionMatrix, projectionMatrixLoc;

let ambientProductLoc, diffuseProductLoc, specularProductLoc;
let lightPositionLoc, shininessLoc;

// "Previous" time in milliseconds since the page was first loaded.
let then = 0.0;

// Whether to play the animation(s) in the current frame.
let playAnimation = false;

// The "anchor" the heart bobs under and over during animation.
let heartAnchorY = 10.0;
// Frequency of the wave the heart bobs along during animation.
let heartFrequency = 0.01;
// Amplitude of the wave the heart bobs along during animation.
let heartAmplitude = 2.0;

let heartPos = vec3(10, heartAnchorY, -20);
let heartRotationDegrees = 0.0;
let heartRotationIncrement = 45.0;

// Number of times `update` has executed.
let timer = 0.0;

/**
 * Global WebGL state variables.
 */
var gl;
var modelViewMatrix, modelViewMatrixLoc;
var matrixStack = [];

// Global namespace for camera control.
let AllInfo = {
	// Properties controlling the camera's zoom and position.
	zoomFactor: 8,
	translateX: 0,
	translateY: 0,

	// Properties controlling the camera's rotation around a point.
	phi: 1,
	theta: 0.5,
	radius: 8,
	dr: 2.0 * Math.PI/180.0,

	// Whether the corresponding mouse button is pressed.
	mouseDownRight: false,
	mouseDownLeft: false,

	// The mouse's position on clicking either button.
	mousePosOnClickX: 0,
	mousePosOnClickY: 0
};

function main() {
	// Retrieve the canvas and initialize the WebGL context.
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
		return;
	}

	// Add vertices and normals for the wall.
	let wallVertices = generateWallVertices();
	let wallNormals = generateNormals(wallVertices);
	pointsArray = pointsArray.concat(wallVertices);
	normalsArray = normalsArray.concat(wallNormals);

	// Add the vertices and normals for the heart.
	pointsArray = pointsArray.concat(HEART_FACES);
	let heartNormals = generateNormals(HEART_FACES);
	normalsArray = normalsArray.concat(heartNormals);

	// Add the vertices and normals for the shrine.
	let shrinePoints = generateShrineVertices();
	let shrineNormals = generateNormals(shrinePoints);
	pointsArray = pointsArray.concat(shrinePoints);
	normalsArray = normalsArray.concat(shrineNormals);

	// Add the vertices for the pot (surface of revolution).
	let potPoints = generateSurfaceOfRevolution(POT_VERTICES, NUM_POT_SLICES);
	let potNormals = generateNormals(potPoints);
	pointsArray = pointsArray.concat(potPoints);
	normalsArray = normalsArray.concat(potNormals);

	let chestPoints = generateChestVertices();
	let chestNormals = generateNormals(chestPoints);
	pointsArray = pointsArray.concat(chestPoints);
	normalsArray = normalsArray.concat(chestNormals);

	let swordPoints = generateSwordVertices();
	console.log(swordPoints.length);
	let swordNormals = generateNormals(swordPoints);
	pointsArray = pointsArray.concat(swordPoints);
	normalsArray = normalsArray.concat(swordNormals);

	let chalicePoints = generateSurfaceOfRevolution(CHALICE_VERTICES, NUM_CHALICE_SLICES);
	let chaliceNormals = generateNormals(chalicePoints);
	pointsArray = pointsArray.concat(chalicePoints);
	normalsArray = normalsArray.concat(chaliceNormals);

	let cobblePoints = generatedExtrudedVertices(BEEG_CUBE_VERTICES, 5.0);
	let cobbleNormals = generateNormals(cobblePoints);
	pointsArray = pointsArray.concat(cobblePoints);
	normalsArray = normalsArray.concat(cobbleNormals);

	// Initailize the WebGL context.
	initWebGL();

	// Initialize the HTML elements.
	initHtmlButtons();
	initHtmlKeyControls();
	initHtmlMouseControls();

	requestAnimationFrame(loop);
}

/**
 * Initialize the global WebGL context and buffer generated vertex data.
 */
function initWebGL() {
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	gl.enable(gl.DEPTH_TEST);

	//  Load shaders.
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Initialize the normal attribute buffer.
	let nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
	
	// Make normal attribute writable by buffer.
	let vNormal = gl.getAttribLocation(program, "vNormal");
	gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vNormal);

	// Initialize vertex attribute buffer.
	let vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	// Make vertex attribute writable by buffer.
	let vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Retrieve addresses to model-view and projection matrices.
	modelViewMatrixLoc  = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

	// Retrieve addresses to light/shading properties.
	ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program, "specularProduct");
	shininessLoc = gl.getUniformLocation(program, "shininess");
	
	// Set the position of the global light.
	gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(LIGHT_POSTIION));
}

function initHtmlKeyControls() {
	window.addEventListener("keydown", (event) => {
		let code = event.code;
		
		// Toggle whether the animation(s) is playing by the `A` key.
		if (code == "KeyA") {
			playAnimation = !playAnimation;
		}
	});
}

/**
 * Initialize the mouse controls for the HTML page.
 */
function initHtmlMouseControls() {
	// Zoom in and out in response to the mouse scroll wheel. `wheelDelta`
	// is the distance the wheel "rolled"; positive distance implies
	// scrolling up, negative distance implies scrolling down.
	canvas.addEventListener("wheel", function(e) {
		if (e.wheelDelta > 0) {
			AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
		} else {
			AllInfo.zoomFactor += 0.1;
		}
	});

	// When either mouse button is clicked, record which clicked and the
	// mouse's current position.
	canvas.addEventListener("mousedown", function(e) {
		if (e.which == 1) {
			AllInfo.mouseDownLeft = true;
			AllInfo.mouseDownRight = false;
			AllInfo.mousePosOnClickY = e.y;
			AllInfo.mousePosOnClickX = e.x;
		} else if (e.which == 3) {
			AllInfo.mouseDownRight = true;
			AllInfo.mouseDownLeft = false;
			AllInfo.mousePosOnClickY = e.y;
			AllInfo.mousePosOnClickX = e.x;
		}
	});

	// Reset mouse-click flags when either mouse button releases.
	document.addEventListener("mouseup", function(_) {
		AllInfo.mouseDownLeft = false;
		AllInfo.mouseDownRight = false;
	});

	// Whenever the mouse moves and one of the mouse buttons are pressed,
	// calculate and record the distance traveled from the point at which
	// the mouse button was initially clicked.
	document.addEventListener("mousemove", function(e) {
		if (AllInfo.mouseDownRight) {
			// Right-button clicks correspond to panning, so the
			// difference in position is used for translation.
			AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
			AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;

			AllInfo.mousePosOnClickY = e.y;
			AllInfo.mousePosOnClickX = e.x;
		} else if (AllInfo.mouseDownLeft) {
			// Left-button clicks correspond to shape rotation, so
			// the difference in position is used for rotation.
			AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
			AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;

			AllInfo.mousePosOnClickX = e.x;
			AllInfo.mousePosOnClickY = e.y;
		}
	});
}

/**
 * Initialize the events necessary to respond to buttons on the HTML page.
 */
function initHtmlButtons() {
	// Increment theta when corresponding button is clicked.
	document.getElementById("thetaup").addEventListener("click", function(_) {
		AllInfo.theta += AllInfo.dr;
	});

	// Decrement theta when corresponding button is clicked.
	document.getElementById("thetadown").addEventListener("click", function(_) {
		AllInfo.theta -= AllInfo.dr;
	});
	
	// Increment phi when corresponding button is clicked.
	document.getElementById("phiup").addEventListener("click", function(_) {
		AllInfo.phi += AllInfo.dr;
	});

	// Decrement phi when corresponding button is clicked.
	document.getElementById("phidown").addEventListener("click", function(_) {
		AllInfo.phi -= AllInfo.dr;
	});

	// Toggle animation when corresponding button is clicked.
	document.getElementById("animate").addEventListener("click", function(_) {
		playAnimation = !playAnimation;
	});
}

/**
 * Configure WebGL to render objects according to given material properties.
 * @param {vec4}   ambient   The ambient material property.
 * @param {vec4}   diffuse   The diffuse material property.
 * @param {vec4}   specular  The specular material property.
 * @param {number} shininess The object's shininess property.
 */
function setMaterial(ambient, diffuse, specular, shininess) {
	// Compute the products given by the material.
	let ambientProduct  = mult(LIGHT_AMBIENT, ambient);
	let diffuseProduct  = mult(LIGHT_DIFFUSE, diffuse);
	let specularProduct = mult(LIGHT_SPECULAR, specular);

	// Write the new material properties into the vertex shader.
	gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
	gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));
	gl.uniform4fv(specularProductLoc, flatten(specularProduct));
	gl.uniform1f(shininessLoc, shininess);
}

/**
 * Return the normal for the polygon represented by the given vertices.
 * @param {Array} List of vertices defining the polygon.
 * @returns The `vec3` representing the normal of the polygon.
 */
function newell(vertices) {
	let length = vertices.length;
	let x = 0, y = 0, z = 0;

	// Compute the normal for the polygon.
	for (let i = 0; i < length; i++) {
		let next = (i + 1) % length;

		x += (vertices[i][1] - vertices[next][1]) * (vertices[i][2] + vertices[next][2]);
		y += (vertices[i][2] - vertices[next][2]) * (vertices[i][0] + vertices[next][0]);
		z += (vertices[i][0] - vertices[next][0]) * (vertices[i][1] + vertices[next][1]);
	}

	// Return the normal, normalized.
	return normalize(vec3(x, y, z));
}

/**
 * Compute the scale matrix described by the scale factors.
 *
 * @param {number} sx - Factor by which to scale the x-axis.
 * @param {number} sy - Factor by which to scale the y-axis.
 * @param {number} sz - Factor by which to scale the z-axis.
 */
function scale4(sx, sy, sz) {
	let matrix = mat4();
	matrix[0][0] = sx;
	matrix[1][1] = sy;
	matrix[2][2] = sz;

	return matrix;
}

/**
 * Return the list of normals for the faces composed by the given vertices.
 * @param {Array} The list of vertices composed faces with `POINTS_PER_FACE`
 *                vertices each.
 * @returns The list of normals for the faces. Will be equivalent in length to
 *          the length of the given list of vertices.
 */
function generateNormals(vertices) {
	let normals = [];
	for (let i = 0; i < vertices.length; i+= POINTS_PER_FACE) {
		let facePoints = vertices.slice(i, i + POINTS_PER_FACE);
		let normal = newell(facePoints);

		// Push appropriate copies of normal into the array.
		for (let j = 0; j < POINTS_PER_FACE; j++)
			normals.push(normal);
	}

	return normals;
}

/**
 * Update and render the world forever.
 * @param {number} now - Time in milliseconds since the page was first loaded.
 */
function loop(now) {
	let delta = (now - then) / 1000.0;
	then = now;

	// Update and render the world.
	update(delta);
	render();

	requestAnimationFrame(loop);
}

let testRotation = 0;

/**
 * Update the world's state.
 * @param {number} delta - Time in seconds since the last frame was rendered.
 */
function update(delta) {
	// Compute the viewing volume based on the current zoom and mouse movements.
	projectionMatrix = ortho(
		ORTHO_X_MIN * AllInfo.zoomFactor - AllInfo.translateX,
		ORTHO_X_MAX * AllInfo.zoomFactor - AllInfo.translateX,
		ORTHO_Y_MIN * AllInfo.zoomFactor - AllInfo.translateY,
		ORTHO_Y_MAX * AllInfo.zoomFactor - AllInfo.translateY,
		ORTHO_NEAR, ORTHO_FAR
	);
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

	// Compute the position of the eye based on the user's rotation.
	// Essentially, compute the position of the eye as a point on a sphere.
	let eye = vec3(
		AllInfo.radius * Math.cos(AllInfo.phi),
		AllInfo.radius * Math.sin(AllInfo.theta),
		AllInfo.radius * Math.sin(AllInfo.phi)
	);

	// Set the position of the eye.
	modelViewMatrix = lookAt(eye, LOOK_AT_POINT, UP_DIRECTION);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	// If we're playing an animation, update the appropriate states.
	if (playAnimation) {
		/*
		 * Rotate the heart while it bobs up and down.
		 */
		heartRotationDegrees += heartRotationIncrement * delta;
		let heartYDelta = Math.sin(timer * heartFrequency) * heartAmplitude;
		heartPos[1] = heartAnchorY + (heartYDelta );

		testRotation += heartRotationIncrement * delta;

		timer += 1;
	}
}

/**
 * Render the world.
 */
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Index into the `pointsArray` and `normalsArray`.
	let startIdx = 0;

	// Draw the wall
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, -24, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(30, 1, 30));
	drawWall(startIdx);
	modelViewMatrix = matrixStack.pop();

	// Draw left-back wall
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-29, 6, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, scale4(30, 1, 30));
	drawWall(startIdx);
	modelViewMatrix = matrixStack.pop();

	// Draw right-back wall
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, 6, -29));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 0, 1));
	modelViewMatrix = mult(modelViewMatrix, scale4(30, 1, 30));
	drawWall(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_WALL_VERTICES;

	// Draw the three-dimensional heart.
	matrixStack.push(modelViewMatrix);
	let [heartX, heartY, heartZ] = heartPos;
	modelViewMatrix = mult(modelViewMatrix, translate(heartX, heartY, heartZ));
	modelViewMatrix = mult(modelViewMatrix, rotate(heartRotationDegrees, 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(0.5, 0.5, 0.5));
	drawHeart(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += HEART_FACES.length;

	// Draw the shrine/pedestal.
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(heartX, -10, heartZ));
	drawShrine(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_SHRINE_VERTICES;

	// Draw the pot.
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-20, -14.5, 15));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	drawPot(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_POT_VERTICES 

	// Draw the chest.
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-13, -15.5, -13));
	modelViewMatrix = mult(modelViewMatrix, rotate(-45, 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(4, 5, 10));
	drawChest(startIdx)
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_CHEST_VERTICES;

	// Draw the sword.
	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(20, 4.0, -26.5));
	modelViewMatrix = mult(modelViewMatrix, rotate(75, 1, 0, 0));
	drawSword(startIdx);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_SWORD_VERTICES;

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-8, -21.0, -2));
	modelViewMatrix = mult(modelViewMatrix, rotate(-45, 0, 1, 0));
	modelViewMatrix = mult(modelViewMatrix, rotate(85, 1, 0, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(0.5, 0.5, 0.5));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, startIdx, NUM_CHALICE_VERTICES);
	modelViewMatrix = matrixStack.pop();

	startIdx += NUM_CHALICE_VERTICES;


	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-25, -20, 0));

	let foo = -5;
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 4; x++) {
			matrixStack.push(modelViewMatrix);

			const WIDTH = 16;
			const HEIGHT = 8;

			modelViewMatrix = mult(modelViewMatrix, translate(x * WIDTH + foo, y * HEIGHT, -28)); // Center origin

			// Modeling transformations
			modelViewMatrix = mult(modelViewMatrix, scale4(7.5, 3.5, 0.5));
			modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
			modelViewMatrix = mult(modelViewMatrix, translate(0, -2.5, 0)); // Center origin
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			gl.drawArrays(gl.TRIANGLES, startIdx, NUM_COBBLE_VERTICES);

			modelViewMatrix = matrixStack.pop();
		}

		foo *= -1;
	}

	modelViewMatrix = mult(modelViewMatrix, translate(25, 0, 30));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 4; x++) {
			matrixStack.push(modelViewMatrix);

			const WIDTH = 16;
			const HEIGHT = 8;

			modelViewMatrix = mult(modelViewMatrix, translate(x * WIDTH + foo, y * HEIGHT, -28)); // Center origin

			// Modeling transformations
			modelViewMatrix = mult(modelViewMatrix, scale4(7.5, 3.5, 0.5));
			modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
			modelViewMatrix = mult(modelViewMatrix, translate(0, -2.5, 0)); // Center origin
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
			gl.drawArrays(gl.TRIANGLES, startIdx, NUM_COBBLE_VERTICES);

			modelViewMatrix = matrixStack.pop();
		}

		foo *= -1;
	}

	modelViewMatrix = matrixStack.pop();
}
