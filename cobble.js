/**
 * Heart material definitions.
 */
const COBBLE_MATERIAL_AMBIENT   = vec4(0.6, 0.6, 0.6, 1.0);
const COBBLE_MATERIAL_DIFFUSE   = vec4(0.6, 0.6, 0.6, 1.0);
const COBBLE_MATERIAL_SPECULAR  = vec4(0.1, 0.1, 0.1, 1.0);
const COBBLE_MATERIAL_SHININESS = 30.0;

const COBBLE_VERTICES = [
	vec4(-1, 0,  1, 1), // A
	vec4(-1, 0,  0, 1), // B
	vec4(-1, 0, -1, 1), // C
	vec4( 0, 0, -1, 1), // D
	vec4( 1, 0, -1, 1), // E
	vec4( 1, 0,  0, 1), // F
	vec4( 1, 0,  1, 1), // G
	vec4( 0, 0,  1, 1), // H
];

const COBBLESTONE_OFFSET = 5;

function generateCobblestoneVertices() {
	return generatedExtrudedVertices(COBBLE_VERTICES, 5.0);
}

function drawCobblestoneWall(offset, width, height) {
	setMaterial(
		COBBLE_MATERIAL_AMBIENT, COBBLE_MATERIAL_DIFFUSE, 
		COBBLE_MATERIAL_SPECULAR, COBBLE_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);

	let xOffset = COBBLESTONE_OFFSET;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			matrixStack.push(modelViewMatrix);

			const WIDTH = 16;
			const HEIGHT = 8;

			let xPos = x * WIDTH + xOffset;
			let yPos = y * HEIGHT;

			modelViewMatrix = mult(modelViewMatrix, translate(xPos, yPos, 0));
			drawCobblestone(offset);

			modelViewMatrix = matrixStack.pop();
		}

		xOffset *= -1;	
	}

	modelViewMatrix = matrixStack.pop();
}

function drawCobblestone(offset) {
	matrixStack.push(modelViewMatrix);

	/*
	 * These center the brick at its origin while scaled and rotated.
	 */
	modelViewMatrix = mult(modelViewMatrix, scale4(7.5, 3.5, 0.5));
	modelViewMatrix = mult(modelViewMatrix, rotate(90, 1, 0, 0));
	modelViewMatrix = mult(modelViewMatrix, translate(0, -2.5, 0));

	// Draw the brick.
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.drawArrays(gl.TRIANGLES, offset, NUM_COBBLE_VERTICES);

	modelViewMatrix = matrixStack.pop();
}
