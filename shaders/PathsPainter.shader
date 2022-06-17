precision mediump float;
varying vec2 vPosition;
uniform mat3 uMatrixInverse;
uniform sampler2D uData;
uniform vec2 uTextureSize;
uniform int uPathLength;

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

vec4 distToValue( in float dist, in int closestIndex ) {
  // divider: 0 when beggining closestIndex == 0
  // 1 when ending. closestIndex == PathLength
  float divider = float( closestIndex ) / float( uPathLength + 1 );
  float value = smoothstep( 4.0 * divider, divider , dist );
  // return vec4( vec3( value ), 0.9 );
  return vec4( vec3( value ), value * divider * divider );
}

vec4 getStroke( in vec2 modelPosition ) {
  float dist = 1000.0;
  float value = 0.0;
  int closestIndex = uPathLength;

  for ( int i = 0 ; i < 1000 ; i++ ) {
    if ( i == ( uPathLength - 1 ) ) {
      return distToValue( dist, closestIndex );
    }
    vec2 position0 = fetch( i ).xy;
    vec2 position1 = fetch( i + 1 ).xy;

    float newDistance = sdSegment( modelPosition, position0, position1 );
    if ( newDistance < dist ) {
      dist = newDistance;
      closestIndex = i;
    }
  }
  return distToValue( dist, closestIndex );
}

// Returns the color from the vertex shader
void main( void ) {
  vec2 modelPosition = globalToModel( vPosition );
  vec4 stroke = getStroke( modelPosition );
  gl_FragColor = stroke;
}