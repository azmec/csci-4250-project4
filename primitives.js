const CUBE_VERTICES = [
	vec4(-1, -1,  1, 1),
	vec4(-1,  1,  1, 1),
	vec4( 1,  1,  1, 1),
	vec4( 1, -1,  1, 1),
	vec4(-1, -1, -1, 1),
	vec4(-1,  1, -1, 1),
	vec4( 1,  1, -1, 1),
	vec4( 1, -1, -1, 1)
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
	CUBE_VERTICES[B],
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
	CUBE_VERTICES[H],
	CUBE_VERTICES[D],
	CUBE_VERTICES[A],
	CUBE_VERTICES[H],
	CUBE_VERTICES[D],
	CUBE_VERTICES[E],
];

export function drawCube(offset) {
	gl.drawArrays(gl.TRIANGLES, offset, CUBE_FACES.length);
}
