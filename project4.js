/*
 * Carlos Aldana Lira
 * CSCI 4250-D01
 * Project 4.1
 */

import * as Primitives from "./primitives.js";

/*
 * Constants controlling the orthographic projection bounds.
 */
const ORTHO_Y_MAX =  8;
const ORTHO_Y_MIN = -8;
const ORTHO_X_MAX =  8;
const ORTHO_X_MIN = -8;
const ORTHO_NEAR  = -50;
const ORTHO_FAR   =  50;

// Point at which the camera looks.
const LOOK_AT_POINT = vec3(0, 0, 0);
// The relative "up" direction for the camera.
const UP_DIRECTION  = vec3(0, 1, 0);

const LIGHT_POSTIION = vec4(20, 20, 20, 0.0);

let canvas, program;

let pointsArray = [];
let normalsArray = [];

let projectionMatrix, projectionMatrixLoc;

// Global namespace for camera control.
let AllInfo = {
	// Properties controlling the camera's zoom and position.
	zoomFactor: 12,
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

	// Add and color the faces of the tetrahedron.
	pointsArray = pointsArray.concat(HEART_FACES);
	for (let i = 0; i < NUM_HEART_FACES; i++) {
		let j = i * 3;
		let facePoints = [HEART_FACES[j], HEART_FACES[j + 1], HEART_FACES[j + 2]];
		let normal = newell(facePoints);
		normalsArray.push(normal);
		normalsArray.push(normal);
		normalsArray.push(normal);
	}

	pointsArray = pointsArray.concat(Primitives.CUBE_FACES);
	for (let i = 0; i < Primitives.CUBE_FACES.length; i += 3) {
		let facePoints = Primitives.CUBE_FACES.slice(i, i + 3);
		let normal = newell(facePoints);

		normalsArray.push(normal);
		normalsArray.push(normal);
		normalsArray.push(normal);
	}

	// Initailize the WebGL context.
	initWebGL();

	// Initialize the HTML elements.
	initHtmlButtons();
	initHtmlMouseControls();

	render();
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

		render();
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
		render();
	});

	// Reset mouse-click flags when either mouse button releases.
	document.addEventListener("mouseup", function(_) {
		AllInfo.mouseDownLeft = false;
		AllInfo.mouseDownRight = false;
		render();
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

		render();
	});
}

/**
 * Initialize the events necessary to respond to buttons on the HTML page.
 */
function initHtmlButtons() {
	// Increment theta when corresponding button is clicked.
	document.getElementById("thetaup").addEventListener("click", function(_) {
		AllInfo.theta += AllInfo.dr;
		render();
	});

	// Decrement theta when corresponding button is clicked.
	document.getElementById("thetadown").addEventListener("click", function(_) {
		AllInfo.theta -= AllInfo.dr;
		render();
	});
	
	// Increment phi when corresponding button is clicked.
	document.getElementById("phiup").addEventListener("click", function(_) {
		AllInfo.phi += AllInfo.dr;
		render();
	});

	// Decrement phi when corresponding button is clicked.
	document.getElementById("phidown").addEventListener("click", function(_) {
		AllInfo.phi -= AllInfo.dr;
		render();
	});
}

/**
 * Return the normal for the polygon represented by the given vertices.
 * @param {Array} List of vertices defining the polygon.
 * @returns The `vec3` representing the normal of the polygon.
 */
function newell(vertices) {
	let length = vertices.length;
	let x = 0, y = 0, z = 0;
	for (let i = 0; i < length; i++) {
		let next = (i + 1) % length;

		x += (vertices[i][1] - vertices[next][1]) * (vertices[i][2] + vertices[next][2]);
		y += (vertices[i][2] - vertices[next][2]) * (vertices[i][0] + vertices[next][0]);
		z += (vertices[i][0] - vertices[next][0]) * (vertices[i][1] + vertices[next][1]);
	}

	return normalize(vec3(x, y, z));
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

	let startIdx = 0;

	// Draw the three-dimensional heart.
	drawHeart(startIdx);
	startIdx += HEART_FACES.length;

	modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 15));
	modelViewMatrix = mult(modelViewMatrix, scale4(5, 5, 5));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	Primitives.drawCube(startIdx);
}

window.main = main;
