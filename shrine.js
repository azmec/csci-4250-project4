const SHRINE_MATERIAL_AMBIENT   = vec4( 0.5, 0.5, 0.5, 1.0 );
const SHRINE_MATERIAL_DIFFUSE   = vec4( 0.5, 0.5, 0.5, 1.0);
const SHRINE_MATERIAL_SPECULAR  = vec4( 0.3, 0.3, 0.3, 1.0 );
const SHRINE_MATERIAL_SHININESS = 10.0;

function generateShrineVertices() {
	let vertices = [];
	vertices = vertices.concat(CUBE_FACES);
	vertices = vertices.concat(generateCylinderVertices(1.0, 1.0));

	return vertices;
}

function drawShrine(offset) {
	setMaterial(
		SHRINE_MATERIAL_AMBIENT, SHRINE_MATERIAL_DIFFUSE, 
		SHRINE_MATERIAL_SPECULAR, SHRINE_MATERIAL_SHININESS
	);

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, -8.5, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(5.5, 0.5, 5.5));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	drawCube(offset);
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, -11, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(6, 2.0, 6));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	drawCube(offset);
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, -7.5, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(5.0, 1.5, 5.0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	drawCube(offset);
	offset += CUBE_FACES.length;
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(2, -8, 2));
	modelViewMatrix = mult(modelViewMatrix, scale4(2.0, 16.0, 2.0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	drawCylinder(offset);
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(2, -8, -2));
	modelViewMatrix = mult(modelViewMatrix, scale4(2.0, 16.0, 2.0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	drawCylinder(offset);
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-2, -8, -2));
	modelViewMatrix = mult(modelViewMatrix, scale4(2.0, 16.0, 2.0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	drawCylinder(offset);
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(-2, -8, 2));
	modelViewMatrix = mult(modelViewMatrix, scale4(2.0, 16.0, 2.0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	drawCylinder(offset);
	offset -= CUBE_FACES.length;
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, 8, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(6.0, 1.0, 6.0));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	drawCube(offset);
	modelViewMatrix = matrixStack.pop();

	matrixStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, translate(0, 9.2, 0));
	modelViewMatrix = mult(modelViewMatrix, scale4(5.5, 0.2, 5.5));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

	drawCube(offset);
	offset += CUBE_FACES.length;
}