const NUM_HEART_FACES = 17;
const HEART_SCALE_Y = 3 / 4;

const HEART_MATERIAL_AMBIENT   = vec4( 1.0, 0.0, 0.0, 1.0 );
const HEART_MATERIAL_DIFFUSE   = vec4( 1.0, 0.1, 0.1, 1.0);
const HEART_MATERIAL_SPECULAR  = vec4( 1.0, 1.0, 1.0, 1.0 );
const HEART_MATERIAL_SHININESS = 30.0;

/*
 * Letter constants to notate faces and points.
 * Given a drawing, this makes the below easier to parse for humans.
 */
const A = 0;
const B = 1;
const C = 2;
const D = 3;
const E = 4;
const F = 5;
const G = 6;
const H = 7;
const I = 8;
const J = 9;
const K = 10;
const L = 11;
const M = 12;
const N = 13;
const O = 14;
const P = 15;
const Q = 16;
const R = 17;

const HEART_VERTICES = [
	// Vertices for the front right-half of the heart.
	vec4(0, 0, 5.0, 1),   // A
	vec4(0, 8, 2.5, 1),   // B
	vec4(6, 6, 2.5, 1),   // C
	vec4(11, 3, 2.5, 1),  // D
	vec4(10, -2, 2.5, 1), // E
	vec4(7, -6, 2.5, 1),  // F
	vec4(0, -6, 2.5, 1),  // G
	vec4(7, 10, 0, 1),    // H
	vec4(11, 7, 0, 1),    // I
	vec4(4, -9, 0, 1),    // J
	vec4(0, -10, 0, 1),   // K

	// Vertices for the right-side of the heart.
	vec4(11, 3, -2.5, 1),  // L
	vec4(10, -2, -2.5, 1), // M
	vec4(7, -6, -2.5, 1),  // N

	// Vertex for the top-middle point of the heart.
	vec4(0, 8, -2.5, 1) // O
];

const HEART_FACES = [
	HEART_VERTICES[B],
	HEART_VERTICES[A],
	HEART_VERTICES[C],

	HEART_VERTICES[C],
	HEART_VERTICES[A],
	HEART_VERTICES[D],

	HEART_VERTICES[D],
	HEART_VERTICES[A],
	HEART_VERTICES[E],

	HEART_VERTICES[E],
	HEART_VERTICES[A],
	HEART_VERTICES[F],

	HEART_VERTICES[F],
	HEART_VERTICES[A],
	HEART_VERTICES[G],

	// Right "hump" of the heart.
	HEART_VERTICES[B],
	HEART_VERTICES[C],
	HEART_VERTICES[H],

	HEART_VERTICES[H],
	HEART_VERTICES[C],
	HEART_VERTICES[I],

	HEART_VERTICES[I],
	HEART_VERTICES[C],
	HEART_VERTICES[D],

	// Right half of bottom "tip" of the heart. Drawn with `TRIANGLE_FAN`.
	HEART_VERTICES[G],
	HEART_VERTICES[J],
	HEART_VERTICES[F],

	HEART_VERTICES[G],
	HEART_VERTICES[K],
	HEART_VERTICES[J],

	// TRIANGLES time
	HEART_VERTICES[I],
	HEART_VERTICES[D],
	HEART_VERTICES[L],

	HEART_VERTICES[D],
	HEART_VERTICES[E],
	HEART_VERTICES[M],

	HEART_VERTICES[D],
	HEART_VERTICES[M],
	HEART_VERTICES[L],

	HEART_VERTICES[E],
	HEART_VERTICES[F],
	HEART_VERTICES[N],

	HEART_VERTICES[E],
	HEART_VERTICES[N],
	HEART_VERTICES[M],

	HEART_VERTICES[F],
	HEART_VERTICES[J],
	HEART_VERTICES[N],

	HEART_VERTICES[O],
	HEART_VERTICES[B],
	HEART_VERTICES[H],
]

/**
 * Draw a three-dimensional heart.
 * @param {number} startIdx The index in the global points array at which the
 *                          heart's vertices begin.
 */
function drawHeart(startIdx) {
	setMaterial(
		HEART_MATERIAL_AMBIENT, HEART_MATERIAL_DIFFUSE, 
		HEART_MATERIAL_SPECULAR, HEART_MATERIAL_SHININESS
	);
	matrixStack.push(modelViewMatrix);

	// FRONT HALF
	modelViewMatrix = mult(modelViewMatrix, scale4(1, HEART_SCALE_Y, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, startIdx, HEART_FACES.length);

	modelViewMatrix = mult(modelViewMatrix, scale4(-1, 1, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, startIdx, HEART_FACES.length);

	// BACK HALF
	modelViewMatrix = mult(modelViewMatrix, scale4(-1, 1, -1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, startIdx, HEART_FACES.length);

	modelViewMatrix = mult(modelViewMatrix, scale4(-1, 1, 1));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, startIdx, HEART_FACES.length);
}
