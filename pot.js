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

	//Setup initial points matrix
	for (let i = 0; i<25; i++) {
		vertices.push(vec4(pawnPoints[i][0], pawnPoints[i][1], 
			pawnPoints[i][2], 1));
	}

	let r;
	let t=Math.PI/12;

	// sweep the original curve another "angle" degree
	for (let j = 0; j < 24; j++) {
		let angle = (j+1)*t; 

		// for each sweeping step, generate 25 new points corresponding to the original points
		for(let i = 0; i < 25 ; i++ )
		{	
			r = vertices[i][0];
			vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
		}    	
	}

	let N=25; 
	// quad strips are formed slice by slice (not layer by layer)
	//          ith slice      (i+1)th slice
	//            i*N+(j+1)-----(i+1)*N+(j+1)
	//               |              |
		//               |              |
		//            i*N+j --------(i+1)*N+j
	// define each quad in counter-clockwise rotation of the vertices
	for (let i=0; i<24; i++) { // slices
		for (let j=0; j<24; j++) { // layers
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
