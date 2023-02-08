// Copyright 2021-2023, University of Colorado Boulder

/**
 * Visible Body Node that draws a sphere with size dependent on the Body's mass.
 *
 * @author Agustín Vallejo
 */

import { Color, DragListener, Node, Rectangle, TColor, Text, TextOptions } from '../../../../scenery/js/imports.js';
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
import { Shape } from '../../../../kite/js/imports.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {
  draggable?: boolean;

  mapPosition?: ( position: Vector2, radius: number ) => Vector2;

  valuesVisibleProperty?: TReadOnlyProperty<boolean>;

  //REVIEW: There seems to be a lot here that is copying a bad pattern in MeasuringTapeNode. I don't recommend these
  //REVIEW: patterns, since nested options objects would be preferred, e.g. { textOptions: TextOptions, backgroundOptions: RectangleOptions }
  //REVIEW: THAT SAID, we aren't actually using any of these options (they are ALWAYS the default).
  //REVIEW: So they shouldn't be options here. They can just be inlined. OR could use the options pattern above and
  //REVIEW: specify the defaults in the options (if you really want the future extensibility). I'd strongly recommend
  //REVIEW: Just minimizing the code here, and inlining the defaults.
  //REVIEW: `draggable` seems like the ONLY needed option here. I imagine something like
  //REVIEW: type SelfOptions = { draggable?: boolean }
  //REVIEW: UPDATE: It looks like we'll want to pass in dragBoundsProperty, so maybe:
  //REVIEW: UPDATE: type SelfOptions = { draggable?: boolean, dragBoundsProperty?: TReadOnlyProperty<Bounds2> }

  //REVIEW: textPosition is never used, so it should be removed.
  textPosition?: Vector2; // position of the text relative to center of the base image in view units

  //REVIEW: significantFigures doesn't ever seem to be used except with the default. Get rid of the option if it's not used?
  significantFigures?: number; // number of significant figures in the length measurement

  //REVIEW: textBackgroundColor doesn't ever seem to be used except with the default. Get rid of the option if it's not used?
  textBackgroundColor?: TColor; // fill color of the text background

  //REVIEW: textBackgroundXMargin/textBackgroundYMargin/textBackgroundCornerRadius doesn't ever seem to be used except with the default. Get rid of the option if it's not used?
  textBackgroundXMargin?: number;
  textBackgroundYMargin?: number;
  textBackgroundCornerRadius?: number;

  textOptions?: TextOptions;
};

export type BodyNodeOptions = SelfOptions & StrictOmit<ShadedSphereNodeOptions, 'cursor'>;

export default class BodyNode extends ShadedSphereNode {
  public readonly body: Body;

  //REVIEW: I don't see use of valueNode outside the constructor. Make it a local variable instead, we don't need a field
  private readonly valueNode: Text; // node that contains the text

  //REVIEW: valueBackgroundNode also not used outside the constructor. Make it a local variable instead, we don't need a field
  private readonly valueBackgroundNode: Rectangle; // rectangle behind text

  private readonly bodyNodeDispose: () => void;

  public constructor( body: Body, modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>, providedOptions?: BodyNodeOptions ) {
    const options = optionize<BodyNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {
      draggable: true,

      mainColor: body.colorProperty,

      mapPosition: _.identity,

      valuesVisibleProperty: new BooleanProperty( false ),

      textPosition: new Vector2( 0, 30 ),
      significantFigures: 1,

      textBackgroundColor: new Color( 0, 0, 0, 0.5 ),

      textBackgroundXMargin: 4,
      textBackgroundYMargin: 2,
      textBackgroundCornerRadius: 2,

      textOptions: {
        fill: 'white', // Not a colorProperty because it is not dynamic
        maxWidth: 200,
        font: new PhetFont( 16 )
      }

    }, providedOptions );

    options.cursor = options.draggable ? 'pointer' : 'default';

    super( 1, options );

    this.body = body;

    const radiusMultilink = Multilink.multilink(
      [ body.radiusProperty, modelViewTransformProperty ],
      ( radius, modelViewTransform ) => {
        this.radius = modelViewTransform.modelToViewDeltaX( radius );
        // Expand mouse/touch areas to 10 units past
        const area = Shape.circle( 0, 0, this.radius + 10 );
        this.mouseArea = area;
        this.touchArea = area;
      } );

    const positionMultilink = Multilink.multilink(
      [ body.positionProperty, modelViewTransformProperty ],
      ( position, modelViewTransform ) => {
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

    if ( options.draggable ) {
      this.addInputListener( new DragListener( {
        positionProperty: body.positionProperty,
        canStartPress: () => !body.userControlledPositionProperty.value,
        mapPosition: point => {
          return options.mapPosition( point, this.radius );
        },
        transform: modelViewTransformProperty,
        start: () => {
          body.clearPath();
          body.userControlledPositionProperty.value = true;
        },
        end: () => {
          body.userControlledPositionProperty.value = false;
        }
      } ) );
    }

    const velocityValueProperty = new DerivedProperty(
      [ this.body.velocityProperty ],
      ( velocity: Vector2 ) => Utils.toFixed(
        velocity.magnitude * MySolarSystemConstants.VELOCITY_MULTIPLIER,
        options.significantFigures
      )
    );
    const readoutStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.velocityValueUnitsStringProperty, {
      value: velocityValueProperty,
      units: MySolarSystemStrings.units.kmsStringProperty
    } );

    this.valueNode = new Text( readoutStringProperty, options.textOptions );

    this.valueBackgroundNode = new Rectangle( {
      cornerRadius: options.textBackgroundCornerRadius,
      fill: options.textBackgroundColor
    } );

    // Resizes the value background and centers it on the value
    this.valueNode.boundsProperty.link( bounds => {
      this.valueBackgroundNode.rectBounds = bounds.dilated( options.textBackgroundXMargin );
    } );

    // Value Container
    this.addChild( new Node( {
      children: [ this.valueBackgroundNode, this.valueNode ],
      visibleProperty: options.valuesVisibleProperty,
      center: new Vector2( 0, 30 )
    } ) );

    const bodyCollisionListener = () => {
      this.interruptSubtreeInput();
      ExplosionNode.explode( this );
    };

    this.body.collidedEmitter.addListener( bodyCollisionListener );

    this.bodyNodeDispose = () => {
      positionMultilink.dispose();
      radiusMultilink.dispose();
      this.body.collidedEmitter.removeListener( bodyCollisionListener );
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