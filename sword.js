const TRAPEZOID_VERTICES = [
	vec4(-1, 0,  1, 1), // A
	vec4(-2, 0, -1, 1), // B
	vec4( 2, 0, -1, 1), // C
	vec4( 1, 0,  1, 1), // D
];


const HILT_VERTICES = [
	vec4(-1.0,  0.0,  1.0, 1), // A
	vec4(-1.0,  0.0, -1.0, 1), // B
	vec4( 1.0,  0.0, -1.0, 1), // C
	vec4( 1.5,  0.0, -0.5, 1), // D
	vec4( 5.0,  0.0, -0.5, 1), // E
	vec4( 6.0,  0.0,  0.5, 1), // F
	vec4( 5.5,  0.0,  1.0, 1), // G
	vec4( 5.0,  0.0,  0.5, 1), // H
	vec4( 1.5,  0.0,  0.5, 1), // I
	vec4( 1.0,  0.0,  1.0, 1), // J
];

const HILT_BODY_VERTICES = [
	HILT_VERTICES[A],
	HILT_VERTICES[B],
	HILT_VERTICES[C],
	HILT_VERTICES[D],
	HILT_VERTICES[I],
	HILT_VERTICES[J],
]

const HILT_ARM_VERTICES = [
	HILT_VERTICES[I],
	HILT_VERTICES[D],
	HILT_VERTICES[E],
	HILT_VERTICES[H],
];

const HILT_TIP_VERTICES = [
	HILT_VERTICES[H],
	HILT_VERTICES[E],
	HILT_VERTICES[F],
	HILT_VERTICES[G],
];

const BLADE_VERTICES = [
	vec4(0, 0, 9, 1),
	vec4(-1, 0, 7, 1),
	vec4(-1, 0, 0, 1),
	vec4(1, 0, 0, 1),
	vec4(1, 0, 7, 1),
];

const NUM_HILT_VERTICES = 132;

const NUM_SWORD_VERTICES = 1944;

function generateSwordVertices() {
	let vertices = [];

	let hiltVertices = generateHiltVeritces();
	let pummelVertices = generatePummelVeritces();
	let handleVertices = generateCylinderVertices(1.0, 1.0);
	let bladeVertices = generateBladeVertices();
	vertices = vertices.concat(pummelVertices, handleVertices, hiltVertices, bladeVertices);

	return vertices;
}

function generateHiltVeritces() {
	let vertices = [];

	let extrudedBody = generatedExtrudedVertices(HILT_BODY_VERTICES, 1.0);
	let extrudedArm = generatedExtrudedVertices(HILT_ARM_VERTICES, 1.0);
	let extrudedTip = generatedExtrudedVertices(HILT_TIP_VERTICES, 1.0);
	vertices = vertices.concat(extrudedBody, extrudedArm, extrudedTip);

	return vertices;
}

function generatePummelVeritces() {
	return generatedExtrudedVertices(TRAPEZOID_VERTICES, 1.0);
}

function generateBladeVertices() {
	return generatedExtrudedVertices(BLADE_VERTICES, 1.0);
}
