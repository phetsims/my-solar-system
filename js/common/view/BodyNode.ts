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
import { Shape } from '../../../../kite/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';

type SelfOptions = {
  draggable?: boolean;

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
  textPosition?: Vector2; // Position of text node relative to body node

  //REVIEW: significantFigures doesn't ever seem to be used except with the default. Get rid of the option if it's not used?
  significantFigures?: number; // number of significant figures in the length measurement

  //REVIEW: textColor doesn't ever seem to be used except with the default. Get rid of the option if it's not used?
  textColor?: TColor; // Color of the velocity value and unit

  //REVIEW: textBackgroundColor doesn't ever seem to be used except with the default. Get rid of the option if it's not used?
  textBackgroundColor?: TColor; // fill color of the text background

  //REVIEW: textBackgroundXMargin/textBackgroundYMargin/textBackgroundCornerRadius doesn't ever seem to be used except with the default. Get rid of the option if it's not used?
  textBackgroundXMargin?: number;
  textBackgroundYMargin?: number;
  textBackgroundCornerRadius?: number;

  //REVIEW: textMaxWidth doesn't ever seem to be used except with the default. Get rid of the option if it's not used?
  textMaxWidth?: number;

  //REVIEW: I don't see where this is ever used. Get rid of the option if it's not used?
  textFont?: Font; // font for the measurement text

  //REVIEW: textFont, textColor and textFont are just passed through to the Text node. In those cases, it's generally
  //REVIEW: preferred to use textOptions in SelfOptions, and then put the defaults in your options call.
};

export type BodyNodeOptions = SelfOptions & ShadedSphereNodeOptions;

export default class BodyNode extends ShadedSphereNode {
  //REVIEW: I actually can't find a usage of this outside of BodyNode. It also doesn't look like it's used outside the
  //REVIEW: constructor here, so this doesn't need to be a field.
  //REVIEW: However, I could imagine this being useful in the future, so for this one I'm completely fine leaving this
  //REVIEW: as a field.
  public readonly body: Body;

  //REVIEW: I don't see use of valueNode outside the constructor. Make it a local variable instead, we don't need a field
  private readonly valueNode: Text; // node that contains the text

  //REVIEW: valueBackgroundNode also not used outside the constructor. Make it a local variable instead, we don't need a field
  private readonly valueBackgroundNode: Rectangle; // rectangle behind text

  //REVIEW: valueContainer also not used outside the constructor. Make it a local variable instead, we don't need a field
  private readonly valueContainer: Node; // parent that displays the text and its background
  private readonly bodyNodeDispose: () => void;

  //REVIEW: This ideally shouldn't be something we're exposing to be modified by other sources. Instead the one case where
  //REVIEW: it's used, please just pass in a dragBoundsProperty in constructor options. Then it won't require all of the
  //REVIEW: mutation logic, and we won't create a Property here that we don't modify. IF this type of pattern is ever
  //REVIEW: needed in the future, we should also document that we're exposing this TO be modified by external sources.
  public readonly dragBoundsProperty = new Property( Bounds2.EVERYTHING );

  //REVIEW: radiusProperty also not used outside the constructor. Make it a local variable instead, we don't need a field
  private readonly radiusProperty = new NumberProperty( 0 );

  public constructor( body: Body, modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>, providedOptions?: BodyNodeOptions ) {
    const options = optionize<BodyNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {
      draggable: true,

      mainColor: body.colorProperty,

      // Text Options
      //REVIEW: This documentation would be better in general in the SelfOptions. It shouldn't talk about the field
      //REVIEW: does in the optionize.
      textPosition: new Vector2( 0, 30 ), // position of the text relative to center of the base image in view units
      significantFigures: 1, // number of significant figures in the length measurement

      //REVIEW: This documentation would be better in general in the SelfOptions. And ColorDef is not accurate, that
      //REVIEW: would be a TColor. In addition, TColor isn't the best option, for flexibility of setting fills/strokes,
      //REVIEW: just set it to TPaint to allow full flexibility.
      textColor: 'white', // {ColorDef} color of the length measurement and unit

      //REVIEW: Same doc notes as above
      textBackgroundColor: new Color( 0, 0, 0, 0.5 ), // {ColorDef} fill color of the text background

      textBackgroundXMargin: 4,
      textBackgroundYMargin: 2,
      textBackgroundCornerRadius: 2,
      textMaxWidth: 200,

      //REVIEW: I don't see where this is ever used. Get rid of the option if it's not used? OR use textOptions
      textFont: new PhetFont( { size: 16 } ) // font for the measurement text

    }, providedOptions );

    //REVIEW: StrictOmit<ShadedSphereNodeOptions, 'cursor'> since we're overriding it
    options.cursor = options.draggable ? 'pointer' : 'default';

    super( 1, options );

    this.body = body;

    const positionMultilink = Multilink.multilink(
      [ body.positionProperty, body.radiusProperty, modelViewTransformProperty ],
      ( position, radius, modelViewTransform ) => {
        //REVIEW: many times I'll actually create a new variable so it's a bit clearer, e.g.
        //REVIEW: const viewRadius = modelViewTransform.modelToViewDeltaX( radius );
        radius = modelViewTransform.modelToViewDeltaX( radius );

        //REVIEW: Wait, why do we have a radiusProperty of our own? Just use the radiusProperty of the body.
        this.radiusProperty.value = radius;

        this.radius = radius;

        // Expand mouse/touch areas to 10 units past
        const area = Shape.circle( 0, 0, radius + 10 );
        this.mouseArea = area;
        this.touchArea = area;

        //REVIEW: It seems like we're handling radius AND position in this multilink. Usually it would make sense to
        //REVIEW: make those independent, so we don't compute EVERYTHING when only one thing changes.
        //REVIEW: So, a slight preference for a separate multilink for this piece.
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

    //REVIEW: Don't use a radiusProperty on this instance. Just use the radiusProperty on the body.
    const erodedDragBoundsProperty = new DerivedProperty( [ this.dragBoundsProperty, this.radiusProperty ], ( dragBounds, radius ) => {
      return dragBounds.eroded( radius );
    } );

    let modelViewTransformListener: ( mvt: ModelViewTransform2 ) => void;
    if ( options.draggable ) {
      const dragListener = new DragListener( {
        positionProperty: body.positionProperty,
        canStartPress: () => !body.userControlledPositionProperty.value,
        dragBoundsProperty: erodedDragBoundsProperty,
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

    const velocityValueProperty = new DerivedProperty(
      [ this.body.velocityProperty ],
      ( velocity: Vector2 ) => Utils.toFixed(
        velocity.magnitude * MySolarSystemConstants.VELOCITY_MULTIPLIER,
        options.significantFigures
      ) );
    const readoutStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.velocityValueUnitsStringProperty, {
      value: velocityValueProperty,
      units: MySolarSystemStrings.units.kmsStringProperty
      } );

    //REVIEW: consolidate options into textOptions. WAIT: I don't see when any are not using the defaults.
    //REVIEW: Just inline the defaults!
    this.valueNode = new Text( readoutStringProperty, {
      font: options.textFont,
      fill: options.textColor,
      maxWidth: options.textMaxWidth
    } );

    //REVIEW: consolidate options into backgroundOptions. WAIT: I don't see when any are not using the defaults.
    //REVIEW: Just inline the defaults!
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
      //REVIEW: missing dispose() of erodedDragBoundsProperty, we'll want that when it's listening to external things
      //REVIEW: like the radiusProperty of the body.

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