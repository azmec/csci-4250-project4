const CHEST_VERTICES = [
    vec4( 0, 0, 2, 1), // A
    vec4( 0, 2, 2, 1), // B
    vec4(-1, 3, 2, 1), // C
    vec4(-3, 3, 2, 1), // D
    vec4(-4, 2, 2, 1), // E
    vec4(-4, 0, 2, 1), // F
    vec4( 0, 0, 0, 1), // G
    vec4( 0, 2, 0, 1), // H
    vec4(-1, 3, 0, 1), // I
    vec4(-3, 3, 0, 1), // J
    vec4(-4, 2, 0, 1), // K
    vec4(-4, 0, 0, 1), // L

];

function generateChestVertices() {
	let chestVertices = [];

	/*
	 * Build out the walls.
	 */
	chestVertices = chestVertices.concat(chestQuad(E, F, A, B));
	chestVertices = chestVertices.concat(chestQuad(K, L, F, E));
	chestVertices = chestVertices.concat(chestQuad(H, G, L, K));
	chestVertices = chestVertices.concat(chestQuad(B, A, G, H));

	/*
	 * The "floor" of the chest.
	 */
	chestVertices = chestVertices.concat(chestQuad(A, F, L, G));


	/*
	 * Build out the "top" walls.
	 */
	chestVertices = chestVertices.concat(chestQuad(C, B, H, I));
	chestVertices = chestVertices.concat(chestQuad(D, E, B, C));
	chestVertices = chestVertices.concat(chestQuad(J, K, E, D));
	chestVertices = chestVertices.concat(chestQuad(I, H, K, J));

	/*
	 * The "ceiling" of the chest.
	 */
	chestVertices = chestVertices.concat(chestQuad(D, C, I, J));


	return chestVertices;
}

function chestQuad(a, b, c, d) {
	let quadVertices = [];

	quadVertices.push(CHEST_VERTICES[a]); 
	quadVertices.push(CHEST_VERTICES[b]); 
	quadVertices.push(CHEST_VERTICES[c]); 

	quadVertices.push(CHEST_VERTICES[a]);  
	quadVertices.push(CHEST_VERTICES[c]); 
	quadVertices.push(CHEST_VERTICES[d]); 

	return quadVertices;
}
