/**
 * Material definitions for the pot.
 */
const POT_MATERIAL_AMBIENT   = vec4(0.8, 0.7, 0.5, 1.0);
const POT_MATERIAL_DIFFUSE   = vec4(0.8, 0.7, 0.5, 1.0);
const POT_MATERIAL_SPECULAR  = vec4(0.1, 0.1, 0.1, 1.0);
const POT_MATERIAL_SHININESS = 10.0;

const POT_VERTICES = [
	// Outer face of the pot.
	vec3(0.0, -8.5, 0), // A
	vec3(6.0, -8.5, 0), // B
	vec3(8.0, -3.5, 0), // C
	vec3(7.0,  0.0, 0), // D
	vec3(4.0,  3.5, 0), // E
	vec3(4.0,  4.5, 0), // F
	vec3(5.0,  6.5, 0), // G
	vec3(5.0,  7.0, 0), // H
	vec3(4.5,  7.0, 0), // I

	// Inner face of the pot.
	vec3(4.5,  6.5, 0), // J
	vec3(3.5,  4.5, 0), // K
	vec3(3.5,  3.5, 0), // L
	vec3(6.5,  0.0, 0), // M
	vec3(7.5,  -3.5, 0), // N
	vec3(5.5,  -8.0, 0), // O
	vec3(0.0,  -8.0, 0), // P
];

// Number of vertical slices composing the pot.
const NUM_POT_SLICES = 16;

// Number of vertices composing the pot.
const NUM_POT_VERTICES = (POT_VERTICES.length - 1) * NUM_POT_SLICES * 6;

const CHALICE_VERTICES = [
	// Outer-surface of the chalice.
	vec3(0  , 0   , 0), // A
	vec3(4  , 0   , 0), // B
	vec3(3.5, 1   , 0), // C
	vec3(1  , 1.5 , 0), // D
	vec3(1  , 4   , 0), // E
	vec3(1.2, 4   , 0), // F
	vec3(1.2, 6   , 0), // G
	vec3(1  , 6   , 0), // H
	vec3(1  , 7.5 , 0), // I
	vec3(1.2, 7.5 , 0), // J
	vec3(1.2, 7.7 , 0), // K
	vec3(2  , 8   , 0), // L
	vec3(3  , 9   , 0), // M
	vec3(4  , 11  , 0), // N
	vec3(5, 13  , 0), // 0
	vec3(5, 14  , 0), // P
	vec3(5.2, 14, 0), // Q
	vec3(5.2, 14.2, 0), // R
	vec3(5  , 14.2, 0), // S

	// Inner-surface of the chalice.
	vec3(4, 11, 0), // T
	vec3(2, 9, 0), // U
	vec3(1, 8, 0), // V
	vec3(0, 8, 0), // W
];

const NUM_CHALICE_SLICES = 8;

const NUM_CHALICE_VERTICES = (CHALICE_VERTICES.length - 1) * NUM_CHALICE_SLICES * 6;

/**
 * Draw a pot.
 * @param {number} offset The index in the global points array at which the
 *                        pot's vertices begin.
 */
function drawPot(offset) {
	setMaterial(
		POT_MATERIAL_AMBIENT, POT_MATERIAL_DIFFUSE, 
		POT_MATERIAL_SPECULAR, POT_MATERIAL_SHININESS
	);

	gl.drawArrays(gl.TRIANGLES, offset, NUM_POT_VERTICES);
}

/**
 * Return the points composing the surface of revolution resulting from the
 * polyline composed by `vertices`. The surface is composed of `numSlices`.
 * @param {Array} vertices  - The points composing the polyline.
 * @param {num}   numSlices - The number of slices to composed the surface by.
 * @returns The list of vertices (mesh) modeling the surface of revolution.
 *          The length of the returned list is:
 *          `numSlices * (vertices.length - 1) * 6`
 */
function generateSurfaceOfRevolution(vertices, numSlices) {
	const NUM_VERTICES = vertices.length;

	let revolvedVertices = [];
	let faces = [];

	// Initialize our initial list of vertices to revolve.
	for (let i = 0; i < NUM_VERTICES; i++) {
		let [x, y, z] = vertices[i];
		revolvedVertices.push(vec4(x, y, z, 1));
	}

	// Revolve our list of vertices `numSlices` times about the y-axis,
	// incrementing the rotation so as to create a close "shell".
	let rotationInc = 360.0 / numSlices * (Math.PI / 180.0);
	for (let j = 0; j < numSlices; j++) {
		let angle = (j + 1) * rotationInc;

		// Compute and append the rotated set of vertices.
		for (let i = 0; i < NUM_VERTICES; i++) {	
			let radius = revolvedVertices[i][0];
			let x = radius * Math.cos(angle);
			let y = revolvedVertices[i][1];
			let z = -radius * Math.sin(angle);

			revolvedVertices.push(vec4(x, y, z, 1));
		}    	
	}

	// Form the quad strips slice-by-slice (not layer by layer).
	//
	//          ith slice      (i+1)th slice
	//            i*N+(j+1)-----(i+1)*N+(j+1)
	//               |              |
	//               |              |
	//            i*N+j --------(i+1)*N+j
	//
	// Each quad is defined in counter-clockwise rotation of the vertices.
	let numLayers = NUM_VERTICES - 1;
	for (let i = 0; i < numSlices; i++) { // slices
		for (let j = 0; j < numLayers; j++) { // layers
			let a = i * NUM_VERTICES + j;
			let b = (i + 1) * NUM_VERTICES + j;
			let c = (i + 1) * NUM_VERTICES + (j + 1);
			let d = i * NUM_VERTICES + (j + 1);

			faces.push(revolvedVertices[a]);
			faces.push(revolvedVertices[b]);
			faces.push(revolvedVertices[c]);

			faces.push(revolvedVertices[a]);
			faces.push(revolvedVertices[c]);
			faces.push(revolvedVertices[d]);
		}
	}    

	return faces;
}
