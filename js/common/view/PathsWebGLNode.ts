// Copyright 2022, University of Colorado Boulder

/**
 * WebGL Script that renders the planets' paths.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { ShaderProgram, WebGLNode, WebGLNodeOptions } from '../../../../scenery/js/imports.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import CommonModel from '../model/CommonModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import PathsPainter_shader from '../../../shaders/PathsPainter_shader.js';
import PathsPainter_vert from '../../../shaders/PathsPainter_vert.js';
import { ReadOnlyProperty } from '../../../../axon/js/ReadOnlyProperty.js';

type painterReturn = 0 | 1;

const DATA_TEXTURE_WIDTH = 32;
const DATA_TEXTURE_HEIGHT = 32;
const DATA_TEXTURE_SIZE = DATA_TEXTURE_WIDTH * DATA_TEXTURE_HEIGHT;

const scratchFloatArray = new Float32Array( 9 );
const scratchInverseMatrix = new Matrix3();
const scratchProjectionMatrix = new Matrix3();

type PathsWebGLNodeOptions = WebGLNodeOptions;

export default class PathsWebGLNode extends WebGLNode {
  model: CommonModel;
  modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2>;

  constructor( model: CommonModel, modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2>, providedOptions?: PathsWebGLNodeOptions ) {
    super( PathsPainter, providedOptions );
    this.model = model;
    this.modelViewTransformProperty = modelViewTransformProperty;

    stepTimer.addListener( () => this.invalidatePaint() );
  }

}

class PathsPainter {
  gl: WebGLRenderingContext;
  node: PathsWebGLNode;
  vertexBuffer: WebGLBuffer;
  shaderProgram: ShaderProgram;
  private readonly dataTexture: WebGLTexture;
  private readonly dataArray: Float32Array;

  constructor( gl: WebGLRenderingContext, node: PathsWebGLNode ) {
    this.gl = gl;
    this.node = node;

    // Use floating-point textures so we can specify the locations with better precision
    gl.getExtension( 'OES_texture_float' );

    // Simple example for custom shader
    const vertexShaderSource = PathsPainter_vert;

    // Simple demo for custom shader
    const fragmentShaderSource = PathsPainter_shader;

    this.shaderProgram = new ShaderProgram( gl, vertexShaderSource, fragmentShaderSource, {
      attributes: [ 'aPosition' ],
      uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix', 'uMatrixInverse', 'uData', 'uTextureSize' ]
    } );
    
    this.vertexBuffer = gl.createBuffer()!;

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [
      -1, -1,
      -1, +1,
      +1, -1,
      +1, +1
    ] ), gl.STATIC_DRAW );

    this.dataTexture = gl.createTexture()!;
    assert && assert( this.dataTexture !== null );
    gl.bindTexture( gl.TEXTURE_2D, this.dataTexture );

    this.dataArray = new Float32Array( DATA_TEXTURE_SIZE * 4 );
    this.updateDataTexture();
    //
    // set the filtering so we don't need mips and it's not filtered
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
  }

  private updateDataTexture(): void {
    const gl = this.gl;

    gl.bindTexture( gl.TEXTURE_2D, this.dataTexture );
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      DATA_TEXTURE_WIDTH,
      DATA_TEXTURE_HEIGHT,
      0,
      gl.RGBA,
      gl.FLOAT,
      this.dataArray
    );
  }

  paint( modelViewMatrix: Matrix3, projectionMatrix: Matrix3 ): painterReturn {
    const gl = this.gl;

    this.shaderProgram.use();

    const position0 = this.node.model.bodies[ 0 ].positionProperty.value;
    const position1 = this.node.model.bodies[ 1 ].positionProperty.value;
    this.dataArray[ 0 ] = position0.x;
    this.dataArray[ 1 ] = position0.y;
    // z here
    // alpha here
    this.dataArray[ 4 ] = position1.x;
    this.dataArray[ 5 ] = position1.y;
    // z here
    // alpha here

    this.updateDataTexture();

    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uModelViewMatrix, false, modelViewMatrix.copyToArray( scratchFloatArray ) );
    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uProjectionMatrix, false, projectionMatrix.copyToArray( scratchFloatArray ) );

    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, this.dataTexture );
    gl.uniform1i( this.shaderProgram.uniformLocations.uData, 0 );

    const matrixInverse = scratchInverseMatrix;
    const projectionMatrixInverse = scratchProjectionMatrix.set( projectionMatrix ).invert();
    matrixInverse.set( this.node.modelViewTransformProperty.value.getInverse() ).multiplyMatrix( modelViewMatrix.inverted().multiplyMatrix( projectionMatrixInverse ) );
    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uMatrixInverse, false, matrixInverse.copyToArray( scratchFloatArray ) );
    gl.uniform2f( this.shaderProgram.uniformLocations.uTextureSize, DATA_TEXTURE_WIDTH, DATA_TEXTURE_HEIGHT );

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
    gl.vertexAttribPointer( this.shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0 );

    // actually draw it
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    this.shaderProgram.unuse();

    return WebGLNode.PAINTED_SOMETHING;
  }

  dispose(): void {
    this.shaderProgram.dispose();
    this.gl.deleteBuffer( this.vertexBuffer );
    this.gl.deleteTexture( this.dataTexture );
  }
}

mySolarSystem.register( 'PathsWebGLNode', PathsWebGLNode );