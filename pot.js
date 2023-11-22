const POT_VERTICES = [
	vec2(6, -8.5), // A
	vec2(8, -3.5), // B
	vec2(6, -0.5), // C
	vec2(2,  3.5), // D
	vec2(2,  4.5), // E
	vec2(4,  6.5), // F
	vec2(4,  7.0), // G
	vec2(3,  7.0), // H
];

//Pawn initial 2d line points for surface of revolution  (25 points)
//The points are defined from bottom up in the X-Y plane
let pawnPoints = [
	[0,    .104, 0.0],
	[.028, .110, 0.0],
	[.052, .126, 0.0],
	[.068, .161, 0.0],
	[.067, .197, 0.0],
	[.055, .219, 0.0],
	[.041, .238, 0.0],
	[.033, .245, 0.0],
	[.031, .246, 0.0],
	[.056, .257, 0.0],
	[.063, .266, 0.0],
	[.059, .287, 0.0],
	[.048, .294, 0.0],
	[.032, .301, 0.0],
	[.027, .328, 0.0],
	[.032, .380, 0.0],
	[.043, .410, 0.0],
	[.058, .425, 0.0],
	[.066, .433, 0.0],
	[.069, .447, 0.0],
	[.093, .465, 0.0],
	[.107, .488, 0.0],
	[.106, .512, 0.0],
	[.115, .526, 0.0],
	[0, .525, 0.0],
];


//Sets up the vertices array so the pawn can be drawn
function SurfaceRevPoints() {
	let vertices = [];
	let points = [];

	// Initialize our initial list of points to revolve.
	for (let i = 0; i < pawnPoints.length; i++) {
		let [x, y, z] = pawnPoints[i];
		vertices.push(vec4(x, y, z, 1));
	}

	let numSlices = 16;
	let numLayers = 24;

	// Revolve our list of points `numSlices` times about the y-axis,
	// incrementing the rotation so as to create a close "shell".
	let rotationInc = 360.0 / numSlices * (Math.PI / 180.0);
	for (let j = 0; j < numSlices; j++) {
		let angle = (j + 1) * rotationInc;

		// Compute and append the rotated set of points.
		for (let i = 0; i < pawnPoints.length ; i++) {	
			let radius = vertices[i][0];
			let x = radius * Math.cos(angle);
			let y = vertices[i][1];
			let z = -radius * Math.sin(angle);

			vertices.push(vec4(x, y, z, 1));
		}    	
	}

	let N = pawnPoints.length; 

	// quad strips are formed slice by slice (not layer by layer)
	//          ith slice      (i+1)th slice
	//            i*N+(j+1)-----(i+1)*N+(j+1)
	//               |              |
	//               |              |
	//            i*N+j --------(i+1)*N+j
	// define each quad in counter-clockwise rotation of the vertices
	for (let i = 0; i < numSlices; i++) { // slices
		for (let j = 0; j < numLayers; j++) { // layers
			let a = i * N + j;
			let b = (i + 1) * N + j;
			let c = (i + 1) * N + (j + 1);
			let d = i * N + (j + 1);

			points.push(vertices[a]);
			points.push(vertices[b]);
			points.push(vertices[c]);

			points.push(vertices[a]);
			points.push(vertices[c]);
			points.push(vertices[d]);
		}
	}    

	return points;
}
