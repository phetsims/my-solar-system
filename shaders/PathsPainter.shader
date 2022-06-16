precision mediump float;
varying vec2 vPosition;
uniform mat3 uMatrixInverse;
uniform sampler2D uData;
uniform vec2 uTextureSize;

// Signed distance to a line segment
float sdSegment( in vec2 p, in vec2 a, in vec2 b ) {
  vec2 pa = p-a, ba = b-a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h );
}

// Given an index into our "vec3 data array", returns the vec3
vec4 fetch( in int index ) {
  vec2 coordinates = vec2( mod( float( index ), uTextureSize.x ), floor( float( index ) / uTextureSize.x ) );
  return texture2D( uData, ( coordinates + 0.5 ) / uTextureSize );
}

vec2 globalToModel( in vec2 modelPoint ) {
  return ( uMatrixInverse * vec3( modelPoint, 1.0 ) ).xy;
}

// Returns the color from the vertex shader
void main( void ) {
  vec2 position0 = fetch( 0 ).xy;
  vec2 position1 = fetch( 1 ).xy;

  vec2 modelPosition = globalToModel( vPosition );

//  float dist = smoothstep( 50.0, 10.0, distance(modelPosition, vec2( 0, 0 )) );
//  float dist = smoothstep( 50.0, 10.0, distance(modelPosition, position0) );
  float dist = smoothstep( 4.0, 2.0, sdSegment( modelPosition, position0, position1 ) );
  gl_FragColor = vec4( vec3( dist ), 0.5 );
}