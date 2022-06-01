/* eslint-disable */
export default "precision mediump float;\nvarying vec2 vPosition;\nuniform vec2 uBody1Position;\nuniform mat3 uMatrixInverse;\n\n// Returns the color from the vertex shader\nvoid main( void ) {\n  vec2 modelPosition = (uMatrixInverse * vec3( vPosition, 1.0 )).xy;\n  float dist = smoothstep( 50.0, 10.0, distance(modelPosition, uBody1Position) );\n  gl_FragColor = vec4( vec3( dist ), 0.5 );\n}"