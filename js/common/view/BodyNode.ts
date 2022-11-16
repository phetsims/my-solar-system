// Copyright 2021-2022, University of Colorado Boulder

/**
 * Visible Body Node that draws a sphere with size dependent on the Body's mass.
 *
 * @author Agustín Vallejo
 */

import { Color, DragListener, Font, Node, Rectangle, TColor, Text } from '../../../../scenery/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ExplosionNode from './ExplosionNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = {
  draggable?: boolean;
  textPosition?: Vector2; // Position of text node relative to body node
  significantFigures?: number; // number of significant figures in the length measurement
  textColor?: TColor; // Color of the velocity value and unit
  textBackgroundColor?: TColor; // fill color of the text background
  textBackgroundXMargin?: number;
  textBackgroundYMargin?: number;
  textBackgroundCornerRadius?: number;
  textMaxWidth?: number;
  textFont?: Font; // font for the measurement text
};

export type BodyNodeOptions = SelfOptions & ShadedSphereNodeOptions;

export default class BodyNode extends ShadedSphereNode {
  public readonly body: Body;
  private readonly valueNode: Text; // node that contains the text
  private readonly valueBackgroundNode: Rectangle; // rectangle behind text
  private readonly valueContainer: Node; // parent that displays the text and its background
  private readonly bodyNodeDispose: () => void;

  public constructor( body: Body, modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>, providedOptions?: BodyNodeOptions ) {
    const options = optionize<BodyNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {
      draggable: true,

      mainColor: body.colorProperty,

      // Text Options
      textPosition: new Vector2( 0, 30 ), // position of the text relative to center of the base image in view units
      significantFigures: 1, // number of significant figures in the length measurement
      textColor: 'white', // {ColorDef} color of the length measurement and unit
      textBackgroundColor: new Color( 0, 0, 0, 0.5 ), // {ColorDef} fill color of the text background
      textBackgroundXMargin: 4,
      textBackgroundYMargin: 2,
      textBackgroundCornerRadius: 2,
      textMaxWidth: 200,
      textFont: new PhetFont( { size: 16 } ) // font for the measurement text

    }, providedOptions );

    options.cursor = options.draggable ? 'pointer' : 'default';

    super( 1, options );

    this.body = body;

    const positionMultilink = Multilink.multilink(
      [ body.positionProperty, body.radiusProperty, modelViewTransformProperty ],
      ( position, radius, modelViewTransform ) => {
        radius = modelViewTransform.modelToViewDeltaX( radius );
        this.setRadius( radius );
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

    let modelViewTransformListener: ( mvt: ModelViewTransform2 ) => void;
    if ( options.draggable ) {
      const dragListener = new DragListener( {
        positionProperty: body.positionProperty,
        canStartPress: () => !body.userControlledPositionProperty.value,
        start: () => {
          body.clearPath();
          body.userControlledPositionProperty.value = true;
        },
        end: () => {
          body.userControlledPositionProperty.value = false;
        }
      } );
      const modelViewTransformListener = ( transform: ModelViewTransform2 ) => {
        dragListener.transform = transform;
      };
      modelViewTransformProperty.link( modelViewTransformListener );
      this.addInputListener( dragListener );
    }

    const velocityValueProperty = new DerivedProperty( [ this.body.velocityProperty ], ( velocity: Vector2 ) => Utils.toFixed( velocity.magnitude, options.significantFigures ) );
    const readoutStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.velocityValueUnitsStringProperty, {
      value: velocityValueProperty,
      units: MySolarSystemStrings.units.kmsStringProperty
      } );

    this.valueNode = new Text( readoutStringProperty, {
      font: options.textFont,
      fill: options.textColor,
      maxWidth: options.textMaxWidth
    } );

    this.valueBackgroundNode = new Rectangle( 0, 0, 1, 1, {
      cornerRadius: options.textBackgroundCornerRadius,
      fill: options.textBackgroundColor
    } );

    // Resizes the value background and centers it on the value
    const updateValueBackgroundNode = () => {
      const valueBackgroundWidth = this.valueNode.width + ( 2 * options.textBackgroundXMargin );
      const valueBackgroundHeight = this.valueNode.height + ( 2 * options.textBackgroundYMargin );
      this.valueBackgroundNode.setRect( 0, 0, valueBackgroundWidth, valueBackgroundHeight );
      this.valueBackgroundNode.center = this.valueNode.center;
    };
    this.valueNode.boundsProperty.lazyLink( updateValueBackgroundNode );
    updateValueBackgroundNode();

    this.valueContainer = new Node( {
      children: [ this.valueBackgroundNode, this.valueNode ],
      visibleProperty: body.valueVisibleProperty,
      center: options.textPosition
    } );
    this.addChild( this.valueContainer );

    const bodyCollisionListener = () => {
      this.interruptSubtreeInput();
      ExplosionNode.explode( this );
    };

    this.body.collidedEmitter.addListener( bodyCollisionListener );

    this.bodyNodeDispose = () => {
      positionMultilink.dispose();
      this.body.collidedEmitter.removeListener( bodyCollisionListener );
      modelViewTransformListener && modelViewTransformProperty.unlink( modelViewTransformListener );
      readoutStringProperty.dispose();
      velocityValueProperty.dispose();
      this.valueNode.dispose();
    };

  }

  public override dispose(): void {
    this.bodyNodeDispose();
    super.dispose();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );