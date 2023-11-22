const POT_VERTICES = [
	vec3(6.0, -8.5, 0), // A
	vec3(8.0, -3.5, 0), // B
	vec3(7.0,  0.0, 0), // C
	vec3(4.0,  3.5, 0), // D
	vec3(4.0,  4.5, 0), // E
	vec3(5.0,  6.5, 0), // F
	vec3(5.0,  7.0, 0), // G
	vec3(4.5,  7.0, 0), // H
];

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
