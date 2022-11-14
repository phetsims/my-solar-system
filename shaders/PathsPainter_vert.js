/* eslint-disable */
export default "attribute vec3 aPosition; // vertex attribute\nvarying vec2 vPosition;\nvoid main() {\n  vPosition = aPosition.xy;\n  gl_Position = vec4( aPosition, 1 );\n}"