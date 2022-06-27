precision mediump float;
varying vec2 vPosition;
uniform mat3 uMatrixInverse;
uniform sampler2D uData;
uniform vec2 uTextureSize;
uniform int uPathLength;
uniform int uMaxPathLength;

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

// Given a distance to the line, return a vec4 color.
vec4 distToValue( in float dist, in int closestIndex, in vec3 planetColor ) {
  // divider = 0 when beggining. closestIndex == 0
  // divider = 1 when ending. closestIndex == PathLength
  float divider = float( closestIndex ) / float( uPathLength + 1 );
  float value = smoothstep( 2.0 * divider, divider , dist );
  // return vec4( vec3( value ), 0.9 );
  return vec4( divider * planetColor, value * divider );
}

// For one body, calculate the path stroke in a specific modelPosition
vec4 getStroke( in vec2 modelPosition, in int bodyIndex, in vec3 planetColor ) {
  float dist = 1000.0;
  int closestIndex = uPathLength;

  for ( int vertexIndex = 0 ; vertexIndex < 1000 ; vertexIndex++ ) {
    if ( ( vertexIndex > uPathLength - 2 ) || ( vertexIndex > uMaxPathLength - 2 ) ) {
      return distToValue( dist, closestIndex, planetColor );
    }
    vec2 position0 = fetch( 4 + bodyIndex * uMaxPathLength + vertexIndex ).xy;
    vec2 position1 = fetch( 4 + bodyIndex * uMaxPathLength + vertexIndex + 1 ).xy;

    float newDistance = sdSegment( modelPosition, position0, position1 );
    if ( newDistance < dist ) {
      dist = newDistance;
      closestIndex = vertexIndex;
    }
  }
  return distToValue( dist, closestIndex, planetColor );
}

// Returns the color from the vertex shader
void main( void ) {
  if ( length( gl_FragColor ) == 0.0 ){
    vec2 modelPosition = globalToModel( vPosition );
    vec4 stroke = vec4( 0.0 );
    for ( int bodyIndex = 0 ; bodyIndex < 4 ; bodyIndex++ ) {
      vec4 newStroke = getStroke( modelPosition, bodyIndex, fetch( bodyIndex ).xyz );
      if ( length( newStroke ) > length( stroke ) ){ // If new stroke is stronger than previous
        stroke = newStroke;
      }
    }
    gl_FragColor = stroke;
  }
}