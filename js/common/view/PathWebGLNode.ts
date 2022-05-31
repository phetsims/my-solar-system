// Copyright 2022, University of Colorado Boulder

/**
 * WebGL Script that renders the planets' paths.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { ShaderProgram, WebGLNode } from '../../../../scenery/js/imports.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import CommonModel from '../model/CommonModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import stepTimer from '../../../../axon/js/stepTimer.js';

type painterReturn = 0 | 1;

const scratchFloatArray = new Float32Array( 9 );
const scratchInverseMatrix = new Matrix3();
const scratchProjectionMatrix = new Matrix3();


export default class PathsWebGLNode extends WebGLNode {
  model: CommonModel;
  modelViewTransform: ModelViewTransform2;

  constructor( model: CommonModel, modelViewTransform: ModelViewTransform2 ) {
    super( PathsPainter );
    this.model = model;
    this.modelViewTransform = modelViewTransform;

    stepTimer.addListener( () => this.invalidatePaint() );
  }

}

class PathsPainter {
  gl: WebGLRenderingContext;
  node: PathsWebGLNode;
  vertexBuffer: WebGLBuffer;
  shaderProgram: ShaderProgram;

  constructor( gl: WebGLRenderingContext, node: PathsWebGLNode ) {
    this.gl = gl;
    this.node = node;


    // Simple example for custom shader
    const vertexShaderSource = [
      'attribute vec3 aPosition;', // vertex attribute
      'varying vec2 vPosition;',
      'void main() {',
      '  vPosition = aPosition.xy;',
      '  gl_Position = vec4( aPosition, 1 );',
      '}'
    ].join( '\n' );

    // Simple demo for custom shader
    const fragmentShaderSource = [
      'precision mediump float;',
      'varying vec2 vPosition;',
      'uniform vec2 uBody1Position;',
      'uniform mat3 uMatrixInverse;',

      // Returns the color from the vertex shader
      'void main( void ) {',
      '  vec2 modelPosition = (uMatrixInverse * vec3( vPosition, 1.0 )).xy;',
      '  gl_FragColor = vec4( vec3( smoothstep( 50.0, 10.0, distance(modelPosition, uBody1Position) ) ), 0.5 );',
      '}'
    ].join( '\n' );

    this.shaderProgram = new ShaderProgram( gl, vertexShaderSource, fragmentShaderSource, {
      attributes: [ 'aPosition' ],
      uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix', 'uBody1Position', 'uMatrixInverse' ]
    } );
    
    this.vertexBuffer = gl.createBuffer()!;

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [
      -1, -1,
      -1, +1,
      +1, -1,
      +1, +1
    ] ), gl.STATIC_DRAW );
  }

  paint( modelViewMatrix: Matrix3, projectionMatrix: Matrix3 ): painterReturn {
    const gl = this.gl;

    this.shaderProgram.use();

    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uModelViewMatrix, false, modelViewMatrix.copyToArray( scratchFloatArray ) );
    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uProjectionMatrix, false, projectionMatrix.copyToArray( scratchFloatArray ) );


    const matrixInverse = scratchInverseMatrix;
    const projectionMatrixInverse = scratchProjectionMatrix.set( projectionMatrix ).invert();
    matrixInverse.set( this.node.modelViewTransform.getInverse() ).multiplyMatrix( modelViewMatrix.inverted().multiplyMatrix( projectionMatrixInverse ) );
    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uMatrixInverse, false, matrixInverse.copyToArray( scratchFloatArray ) );


    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
    gl.vertexAttribPointer( this.shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0 );

    const bodyPosition = this.node.model.bodies[ 1 ].positionProperty.value;
    gl.uniform2f( this.shaderProgram.uniformLocations.uBody1Position, bodyPosition.x, bodyPosition.y );

    // actually draw it
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    this.shaderProgram.unuse();

    return WebGLNode.PAINTED_SOMETHING;
  }

  dispose(): void {
    this.shaderProgram.dispose();
    this.gl.deleteBuffer( this.vertexBuffer );
  }
}

mySolarSystem.register( 'PathsWebGLNode', PathsWebGLNode );