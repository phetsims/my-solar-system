attribute vec3 aPosition; // vertex attribute
varying vec2 vPosition;
void main() {
  vPosition = aPosition.xy;
  gl_Position = vec4( aPosition, 1 );
}