precision mediump float;
varying vec2 vPosition;
uniform mat3 uMatrixInverse;
uniform sampler2D uData;
uniform vec2 uTextureSize;
uniform int uPathLength;
uniform int uMaxPathLength;
uniform mat4 uColorMatrix;

// NOTE: This is best hardcoded as a constant (we could replace in JS if needed)
const int maxPathLength = 32 * 32 / 4;

vec2 globalToModel( in vec2 modelPoint ) {
  return ( uMatrixInverse * vec3( modelPoint, 1.0 ) ).xy;
}

// Given an index into our "vec3 data array", returns the vec3
vec4 fetch( in int index ) {
  vec2 coordinates = vec2( mod( float( index ), uTextureSize.x ), floor( float( index ) / uTextureSize.x ) );
  return texture2D( uData, ( coordinates + 0.5 ) / uTextureSize );
}

// Signed distance to a line segment
float sdSegment( in vec2 p, in vec2 a, in vec2 b ) {
  vec2 pa = p-a, ba = b-a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h );
}

// For one body, calculate the path stroke in a specific modelPosition
vec4 getStroke( in vec2 modelPosition, in int bodyIndex, in vec3 planetColor ) {

  float radius = 3.0;
  float minDistance = 100000.0;

  vec2 lastPosition = vec2( 0.0 );

  float inversePathLength = 1.0 / float( uPathLength + 1 );

  for ( int vertexIndex = 0; vertexIndex < maxPathLength; vertexIndex++ ) {
    if ( vertexIndex >= uPathLength ) {
      break;
    }
    vec2 position = fetch( bodyIndex * uMaxPathLength + vertexIndex ).xy;

    if ( vertexIndex > 0 ) {
      float dist = sdSegment( modelPosition, lastPosition, position );

      minDistance = min( minDistance, dist + ( 1.0 - float( vertexIndex ) * inversePathLength ) * radius );
    }

    lastPosition = position;
  }
  return vec4( planetColor * smoothstep( radius, radius - 2.0, minDistance ), 0.0 );
}

// Returns the color from the vertex shader
void main( void ) {
  vec2 modelPosition = globalToModel( vPosition );
  vec4 stroke = vec4( 0.0, 0.0, 0.0, 1.0 );

  for ( int bodyIndex = 0 ; bodyIndex < 4 ; bodyIndex++ ) {
    stroke += getStroke( modelPosition, bodyIndex, uColorMatrix[ bodyIndex ].xyz );
  }
  gl_FragColor = stroke;
}