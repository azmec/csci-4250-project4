const MID_RADIUS = 3;
const NUM_HEART_FACES = 2;

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

const MAX_PROTRUSION = 5;

const HEART_VERTICES = [
	vec4(0, 0, MAX_PROTRUSION, 1), // A
	vec4(0, 8, MAX_PROTRUSION / 2, 1), // B
	vec4(6, 6, MAX_PROTRUSION / 2, 1), // C
	vec4(11, 3, MAX_PROTRUSION / 2, 1), // D
	vec4(10, -2, MAX_PROTRUSION / 2, 1), // E
	vec4(7, -6, MAX_PROTRUSION / 2, 1), // F
	vec4(0, -6, MAX_PROTRUSION / 2, 1), // G
	vec4(7, 10, 0, 1), // H
	vec4(11, 7, 0, 1), // I
	vec4(4, -9, 0, 1), // J
	vec4(0, -10, 0, 1), // K

	// AD-HOC VERTEX DEFINITIONS TO FILL GAPS
	// FILLING THE SIDES
	vec4(11, 3, -2.5, 1), // L
	vec4(10, -2, -2.5, 1), // M
	vec4(7, -6, -2.5, 1), // N

	// FILLING THE TOP
	vec4(0, 8, -2.5, 1) // O
];

const HEART_FACES = [
	// The middle of the heart. Designed to be drawn with `TRIANGLE_FAN`.
	HEART_VERTICES[A],
	HEART_VERTICES[B],
	HEART_VERTICES[C],
	HEART_VERTICES[D],
	HEART_VERTICES[E],
	HEART_VERTICES[F],
	HEART_VERTICES[G],

	// Right "hump" of the heart. Drawn with `TRIANGLE_FAN`.
	HEART_VERTICES[C],
	HEART_VERTICES[B],
	HEART_VERTICES[H],
	HEART_VERTICES[I],
	HEART_VERTICES[D],

	// Right half of bottom "tip" of the heart. Drawn with `TRIANGLE_FAN`.
	HEART_VERTICES[G],
	HEART_VERTICES[F],
	HEART_VERTICES[J],
	HEART_VERTICES[K],

	// TRIANGLES time
	HEART_VERTICES[L],
	HEART_VERTICES[D],
	HEART_VERTICES[I],

	// TRIANGLE_STRIP time
	HEART_VERTICES[E],
	HEART_VERTICES[D],
	HEART_VERTICES[M],
	HEART_VERTICES[L],

	HEART_VERTICES[F],
	HEART_VERTICES[E],
	HEART_VERTICES[N],
	HEART_VERTICES[M],

	HEART_VERTICES[F],
	HEART_VERTICES[N],
	HEART_VERTICES[J],

	HEART_VERTICES[H],
	HEART_VERTICES[B],
	HEART_VERTICES[O],
]
