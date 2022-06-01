precision mediump float;
varying vec2 vPosition;
uniform vec2 uBody1Position;
uniform mat3 uMatrixInverse;

// Returns the color from the vertex shader
void main( void ) {
  vec2 modelPosition = (uMatrixInverse * vec3( vPosition, 1.0 )).xy;
  float dist = smoothstep( 50.0, 10.0, distance(modelPosition, uBody1Position) );
  gl_FragColor = vec4( vec3( dist ), 0.5 );
}