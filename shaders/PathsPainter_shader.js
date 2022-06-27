/* eslint-disable */
export default "precision mediump float;\nvarying vec2 vPosition;\nuniform mat3 uMatrixInverse;\nuniform sampler2D uData;\nuniform vec2 uTextureSize;\nuniform int uPathLength;\nuniform int uMaxPathLength;\nuniform mat4 uColorMatrix;\n\nvec2 globalToModel( in vec2 modelPoint ) {\n  return ( uMatrixInverse * vec3( modelPoint, 1.0 ) ).xy;\n}\n\n// Given an index into our \"vec3 data array\", returns the vec3\nvec4 fetch( in int index ) {\n  vec2 coordinates = vec2( mod( float( index ), uTextureSize.x ), floor( float( index ) / uTextureSize.x ) );\n  return texture2D( uData, ( coordinates + 0.5 ) / uTextureSize );\n}\n\n// Signed distance to a line segment\nfloat sdSegment( in vec2 p, in vec2 a, in vec2 b ) {\n  vec2 pa = p-a, ba = b-a;\n  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );\n  return length( pa - ba*h );\n}\n\n// Given a distance to the line, return a vec4 color.\nvec4 distToValue( in float dist, in int closestIndex, in vec3 planetColor ) {\n  // divider = 0 when beggining. closestIndex == 0\n  // divider = 1 when ending. closestIndex == PathLength\n  float divider = float( closestIndex ) / float( uPathLength + 1 );\n  float value = smoothstep( 2.0 * divider, divider, dist );\n  // return vec4( vec3( value ), 0.9 );\n  return vec4( divider * planetColor, value * divider );\n}\n\n// For one body, calculate the path stroke in a specific modelPosition\nvec4 getStroke( in vec2 modelPosition, in int bodyIndex, in vec3 planetColor ) {\n  float dist = 1000.0;\n  int closestIndex = uPathLength;\n\n  for ( int vertexIndex = 0 ; vertexIndex < 1000 ; vertexIndex++ ) {\n    if ( ( vertexIndex > uPathLength - 2 ) || ( vertexIndex > uMaxPathLength - 2 ) ) {\n      return distToValue( dist, closestIndex, planetColor );\n    }\n    vec2 position0 = fetch( bodyIndex * uMaxPathLength + vertexIndex ).xy;\n    vec2 position1 = fetch( bodyIndex * uMaxPathLength + vertexIndex + 1 ).xy;\n\n    float newDistance = sdSegment( modelPosition, position0, position1 );\n    if ( newDistance < dist ) {\n      dist = newDistance;\n      closestIndex = vertexIndex;\n    }\n  }\n  return distToValue( dist, closestIndex, planetColor );\n}\n\n// Returns the color from the vertex shader\nvoid main( void ) {\n  vec2 modelPosition = globalToModel( vPosition );\n  vec4 stroke = vec4( 0.0 );\n\n  for ( int bodyIndex = 0 ; bodyIndex < 4 ; bodyIndex++ ) {\n    vec4 newStroke = getStroke( modelPosition, bodyIndex, uColorMatrix[ bodyIndex ].xyz );\n    if ( newStroke.a > stroke.a ) { // If new stroke is stronger than previous\n      stroke += newStroke;\n    }\n  }\n  gl_FragColor = stroke;\n}"