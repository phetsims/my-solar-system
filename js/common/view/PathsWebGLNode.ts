// Copyright 2022, University of Colorado Boulder

/**
 * WebGL Script that renders the planets' paths.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { Color, ShaderProgram, WebGLNode, WebGLNodeOptions } from '../../../../scenery/js/imports.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import CommonModel from '../model/CommonModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import PathsPainter_shader from '../../../shaders/PathsPainter_shader.js';
import PathsPainter_vert from '../../../shaders/PathsPainter_vert.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import MySolarSystemColors from '../MySolarSystemColors.js';

type painterReturn = 0 | 1;

const NUM_BODIES = 4;
const ELEMENTS_PER_VECTOR = 4;
const DATA_TEXTURE_WIDTH = 32;
const DATA_TEXTURE_HEIGHT = 32;

// Number of vectors in our data texture
const DATA_TEXTURE_SIZE = DATA_TEXTURE_WIDTH * DATA_TEXTURE_HEIGHT;

// Number of vectors allocated per body in our data texture
export const MAX_PATH_LENGTH = DATA_TEXTURE_SIZE / NUM_BODIES;

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

  // A 16-length array that contains all 4 body colors (doesn't change once it's initialized)
  private readonly colorsFloatArray: Float32Array;

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
      uniforms: [
        'uModelViewMatrix',
        'uProjectionMatrix',
        'uMatrixInverse',
        'uData',
        'uTextureSize',
        'uPathLength',
        'uMaxPathLength',
        'uColors',
        'uActiveBodies',
        'uColorMatrix'
      ]
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

    this.dataArray = new Float32Array( DATA_TEXTURE_SIZE * ELEMENTS_PER_VECTOR );

    this.colorsFloatArray = new Float32Array( 16 );
    MySolarSystemColors.bodiesPalette.forEach( ( colorName, colorIndex ) => {
      const color = new Color( colorName );
      this.colorsFloatArray[ 4 * colorIndex ] = color.getRed() / 255;
      this.colorsFloatArray[ 4 * colorIndex + 1 ] = color.getGreen() / 255;
      this.colorsFloatArray[ 4 * colorIndex + 2 ] = color.getBlue() / 255;
    } );

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

    // TODO: add assertions to make sure these are equal
    const numPoints = this.node.model.bodies.get( 0 )!.path.length;

    const numBodies = this.node.model.bodies.length;
    for ( let bodyIndex = 0; bodyIndex < numBodies; bodyIndex++ ) {
      const body = this.node.model.bodies.get( bodyIndex )!;
      for ( let pointIndex = 0; pointIndex < numPoints; pointIndex++ ) {
        const point = body.path.get( pointIndex );
        if ( point ) {
          const index = ELEMENTS_PER_VECTOR * ( bodyIndex * MAX_PATH_LENGTH + pointIndex );

          this.dataArray[ index ] = point.x;
          this.dataArray[ index + 1 ] = point.y;
        }
      }
    }

    this.updateDataTexture();

    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uModelViewMatrix, false, modelViewMatrix.copyToArray( scratchFloatArray ) );
    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uProjectionMatrix, false, projectionMatrix.copyToArray( scratchFloatArray ) );

    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, this.dataTexture );
    gl.uniform1i( this.shaderProgram.uniformLocations.uData, 0 );

    gl.uniformMatrix4fv( this.shaderProgram.uniformLocations.uColorMatrix, false, this.colorsFloatArray );

    const matrixInverse = scratchInverseMatrix;
    const projectionMatrixInverse = scratchProjectionMatrix.set( projectionMatrix ).invert();
    matrixInverse.set( this.node.modelViewTransformProperty.value.getInverse() ).multiplyMatrix( modelViewMatrix.inverted().multiplyMatrix( projectionMatrixInverse ) );
    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uMatrixInverse, false, matrixInverse.copyToArray( scratchFloatArray ) );
    gl.uniform2f( this.shaderProgram.uniformLocations.uTextureSize, DATA_TEXTURE_WIDTH, DATA_TEXTURE_HEIGHT );
    gl.uniform1i( this.shaderProgram.uniformLocations.uPathLength, numPoints );
    gl.uniform1i( this.shaderProgram.uniformLocations.uMaxPathLength, MAX_PATH_LENGTH );
    gl.uniform1i( this.shaderProgram.uniformLocations.uActiveBodies, this.node.model.bodies.length );

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