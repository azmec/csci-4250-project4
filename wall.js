/**
 * Wall material definitions.
 */
const WALL_MATERIAL_AMBIENT   = vec4(0.4, 0.4, 0.4, 1.0);
const WALL_MATERIAL_DIFFUSE   = vec4(0.4, 0.4, 0.4, 1.0);
const WALL_MATERIAL_SPECULAR  = vec4(0.2, 0.2, 0.2, 1.0);
const WALL_MATERIAL_SHININESS = 30.0;

const NUM_WALL_VERTICES = CUBE_FACES.length;

function generateWallVertices() {
	let vertices = [];

	vertices = vertices.concat(CUBE_FACES);

	return vertices;
}

function drawWall(offset) {
	setMaterial(
		WALL_MATERIAL_AMBIENT, WALL_MATERIAL_DIFFUSE, 
		WALL_MATERIAL_SPECULAR, WALL_MATERIAL_SHININESS
	);

	drawCube(offset, vec3(0, 0, 0), vec3(1, 1, 1));
}
