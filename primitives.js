const CUBE_VERTICES = [
	vec4(-1, -1,  1, 1), // A
	vec4(-1,  1,  1, 1), // B
	vec4( 1,  1,  1, 1), // C
	vec4( 1, -1,  1, 1), // D
	vec4(-1, -1, -1, 1), // E
	vec4(-1,  1, -1, 1), // F
	vec4( 1,  1, -1, 1), // G
	vec4( 1, -1, -1, 1)  // H
];

export const CUBE_FACES = [
	// The front face.
	CUBE_VERTICES[B],
	CUBE_VERTICES[A],
	CUBE_VERTICES[D],
	CUBE_VERTICES[B],
	CUBE_VERTICES[D],
	CUBE_VERTICES[C],

	// The right face.
	CUBE_VERTICES[C],
	CUBE_VERTICES[D],
	CUBE_VERTICES[H],
	CUBE_VERTICES[C],
	CUBE_VERTICES[H],
	CUBE_VERTICES[G],

	// The left face.
	CUBE_VERTICES[F],
	CUBE_VERTICES[E],
	CUBE_VERTICES[A],
	CUBE_VERTICES[F],
	CUBE_VERTICES[A],
	CUBE_VERTICES[B],

	// The back face.
	CUBE_VERTICES[G],
	CUBE_VERTICES[H],
	CUBE_VERTICES[E],
	CUBE_VERTICES[G],
	CUBE_VERTICES[E],
	CUBE_VERTICES[F],

	// The top face.
	CUBE_VERTICES[F],
	CUBE_VERTICES[B],
	CUBE_VERTICES[C],
	CUBE_VERTICES[F],
	CUBE_VERTICES[C],
	CUBE_VERTICES[G],

	// The bottom face.
	CUBE_VERTICES[D],
	CUBE_VERTICES[A],
	CUBE_VERTICES[E],
	CUBE_VERTICES[D],
	CUBE_VERTICES[E],
	CUBE_VERTICES[H],
];

export function drawCube(offset) {
	gl.drawArrays(gl.TRIANGLES, offset, CUBE_FACES.length);
}

export function generateCylinderVertices(radius, height) {
	let half = [];
	for (let i = 0; i < 25; i++) {
		half.push(vec4(radius, height * i / 24, 0, 1.0));
	}

	let slices = 12;
	let curr1, curr2;
	let prev1, prev2;

	let vertices = [];
	for (let i = 0; i < 24; i++) {
		let init1 = half[i];
		let init2 = half[i + 1];

		prev1 = init1;
		prev2 = init2;

		for (let j = 0; j < slices; j++) {
			let angle = (j + 1) * 360 / slices;
			let rotation = rotate(angle, 0, 1, 0);
			curr1 = multiply(rotation, init1);
			curr2 = multiply(rotation, init2);

			vertices.push(prev1);
			vertices.push(curr1);
			vertices.push(curr2);
			vertices.push(prev1);
			vertices.push(curr2);
			vertices.push(prev2);

			prev1 = curr1;
			prev2 = curr2;
		}
	}

	return vertices;
}

function multiply(m, v) {
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}
