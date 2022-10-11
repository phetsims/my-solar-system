// Copyright 2022, University of Colorado Boulder

/**
 * WebGL Script that renders the planets' paths.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { ShaderProgram, WebGLNode, WebGLNodeOptions, WebGLNodePainter, WebGLNodePainterResult } from '../../../../scenery/js/imports.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import CommonModel from '../model/CommonModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import PathsPainter_shader from '../../../shaders/PathsPainter_shader.js';
import PathsPainter_vert from '../../../shaders/PathsPainter_vert.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Body from '../model/Body.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import MySolarSystemColors from '../MySolarSystemColors.js';

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

export type PathsWebGLNodeOptions = WebGLNodeOptions;

export default class PathsWebGLNode extends WebGLNode {
  public readonly model: CommonModel;
  public readonly modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2>;

  public constructor( model: CommonModel, modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2>, providedOptions?: PathsWebGLNodeOptions ) {
    super( PathsPainter, providedOptions );
    this.model = model;
    this.modelViewTransformProperty = modelViewTransformProperty;

    stepTimer.addListener( () => this.invalidatePaint() );
  }

}

class PathsPainter implements WebGLNodePainter {
  private readonly gl: WebGLRenderingContext;
  private readonly node: PathsWebGLNode;
  private readonly vertexBuffer: WebGLBuffer;
  private readonly shaderProgram: ShaderProgram;
  private readonly dataTexture: WebGLTexture;
  private readonly dataArray: Float32Array;
  private readonly bodies: ObservableArray<Body>;

  // A 16-length array that contains all 4 body colors (doesn't change once it's initialized)
  private readonly colorsFloatArray: Float32Array;

  public constructor( gl: WebGLRenderingContext, node: PathsWebGLNode ) {
    this.gl = gl;
    this.node = node;

    this.bodies = node.model.bodies;

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
        'uColorMatrix',
        'uBackgroundColor'
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

  public paint( modelViewMatrix: Matrix3, projectionMatrix: Matrix3 ): WebGLNodePainterResult {
    const gl = this.gl;

    this.shaderProgram.use();

    // TODO: add assertions to make sure these are equal
    const numPointsAll = [ 0, 0, 0, 0 ];

    const numBodies = this.node.model.bodies.length;
    for ( let bodyIndex = 0; bodyIndex < numBodies; bodyIndex++ ) {
      const body = this.node.model.bodies.get( bodyIndex )!;

      const numPoints = body.pathPoints.length;
      numPointsAll[ bodyIndex ] = numPoints;
      for ( let pointIndex = 0; pointIndex < numPoints; pointIndex++ ) {
        const point = body.pathPoints.get( pointIndex );
        if ( point ) {
          const index = ELEMENTS_PER_VECTOR * ( bodyIndex * MAX_PATH_LENGTH + pointIndex );

          this.dataArray[ index ] = point.x;
          this.dataArray[ index + 1 ] = point.y;
        }
      }

      const color = body.colorProperty.value;
      this.colorsFloatArray[ 4 * bodyIndex ] = color.getRed() / 255;
      this.colorsFloatArray[ 4 * bodyIndex + 1 ] = color.getGreen() / 255;
      this.colorsFloatArray[ 4 * bodyIndex + 2 ] = color.getBlue() / 255;
    }

    this.updateDataTexture();

    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uModelViewMatrix, false, modelViewMatrix.copyToArray( scratchFloatArray ) );
    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uProjectionMatrix, false, projectionMatrix.copyToArray( scratchFloatArray ) );

    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, this.dataTexture );
    gl.uniform1i( this.shaderProgram.uniformLocations.uData, 0 );

    gl.uniformMatrix4fv( this.shaderProgram.uniformLocations.uColorMatrix, false, this.colorsFloatArray );

    const backgroundColor = MySolarSystemColors.backgroundProperty.value;
    gl.uniform4f(
      this.shaderProgram.uniformLocations.uBackgroundColor,
      backgroundColor.getRed() / 255,
      backgroundColor.getGreen() / 255,
      backgroundColor.getBlue() / 255,
      backgroundColor.getAlpha()
    );

    const matrixInverse = scratchInverseMatrix;
    const projectionMatrixInverse = scratchProjectionMatrix.set( projectionMatrix ).invert();
    matrixInverse.set( this.node.modelViewTransformProperty.value.getInverse() ).multiplyMatrix( modelViewMatrix.inverted().multiplyMatrix( projectionMatrixInverse ) );
    gl.uniformMatrix3fv( this.shaderProgram.uniformLocations.uMatrixInverse, false, matrixInverse.copyToArray( scratchFloatArray ) );
    gl.uniform2f( this.shaderProgram.uniformLocations.uTextureSize, DATA_TEXTURE_WIDTH, DATA_TEXTURE_HEIGHT );
    gl.uniform4iv( this.shaderProgram.uniformLocations.uPathLength, numPointsAll );
    gl.uniform1i( this.shaderProgram.uniformLocations.uMaxPathLength, MAX_PATH_LENGTH );
    gl.uniform1i( this.shaderProgram.uniformLocations.uActiveBodies, this.node.model.bodies.length );

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
    gl.vertexAttribPointer( this.shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0 );

    // actually draw it
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    this.shaderProgram.unuse();

    return WebGLNode.PAINTED_SOMETHING;
  }

  public dispose(): void {
    this.shaderProgram.dispose();
    this.gl.deleteBuffer( this.vertexBuffer );
    this.gl.deleteTexture( this.dataTexture );
  }
}

mySolarSystem.register( 'PathsWebGLNode', PathsWebGLNode );