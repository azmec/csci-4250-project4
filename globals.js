const LIGHT_AMBIENT  = vec4(0.1, 0.1, 0.1, 1.0);
const LIGHT_DIFFUSE  = vec4(0.8, 0.5, 0.5, 1.0);
const LIGHT_SPECULAR = vec4(0.0, 1.0, 1.0, 1.0);

let ambientProductLoc, diffuseProductLoc, specularProductLoc;
let lightPositionLoc, shininessLoc;

var gl;
var modelViewMatrix, modelViewMatrixLoc;
var matrixStack = [];

/**
 * Configure WebGL to render objects according to given material properties.
 * @param {vec4}   ambient   The ambient material property.
 * @param {vec4}   diffuse   The diffuse material property.
 * @param {vec4}   specular  The specular material property.
 * @param {number} shininess The object's shininess property.
 */
function setMaterial(ambient, diffuse, specular, shininess) {
	// Combute the products given by the material.
	let ambientProduct  = mult(LIGHT_AMBIENT, ambient);
	let diffuseProduct  = mult(LIGHT_DIFFUSE, diffuse);
	let specularProduct = mult(LIGHT_SPECULAR, specular);

	// Write the new material properties into the vertex shader.
	gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
	gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));
	gl.uniform4fv(specularProductLoc, flatten(specularProduct));
	gl.uniform1f(shininessLoc, shininess);
}

/**
 * Compute the scale matrix described by the scale factors.
 *
 * @param {number} sx - Factor by which to scale the x-axis.
 * @param {number} sy - Factor by which to scale the y-axis.
 * @param {number} sz - Factor by which to scale the z-axis.
 */
function scale4(sx, sy, sz) {
	let matrix = mat4();
	matrix[0][0] = sx;
	matrix[1][1] = sy;
	matrix[2][2] = sz;

	return matrix;
}
