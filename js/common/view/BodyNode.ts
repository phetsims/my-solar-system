// Copyright 2021-2023, University of Colorado Boulder

/**
 * Visible Body Node that draws a sphere with size dependent on the Body's mass.
 *
 * @author Agustín Vallejo
 */

import { Color, DragListener, Node, Rectangle, RectangleOptions, Text, TextOptions } from '../../../../scenery/js/imports.js';
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
import CueingArrowsNode from './CueingArrowsNode.js';

type SelfOptions = {
  draggable?: boolean;

  mapPosition?: ( position: Vector2, radius: number ) => Vector2;

  valuesVisibleProperty?: TReadOnlyProperty<boolean>;

  //REVIEW: UPDATE: It looks like we'll want to pass in dragBoundsProperty, so maybe:
  //REVIEW: UPDATE: type SelfOptions = { draggable?: boolean, dragBoundsProperty?: TReadOnlyProperty<Bounds2> }

  rectangleOptions?: RectangleOptions;
  textOptions?: TextOptions;
};

export type BodyNodeOptions = SelfOptions & StrictOmit<ShadedSphereNodeOptions, 'cursor'>;

export default class BodyNode extends ShadedSphereNode {
  public readonly body: Body;

  private readonly disposeBodyNode: () => void;

  public constructor( body: Body, modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>, providedOptions?: BodyNodeOptions ) {
    const options = optionize<BodyNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {
      draggable: true,

      mainColor: body.colorProperty,

      mapPosition: _.identity,

      valuesVisibleProperty: new BooleanProperty( false ),

      rectangleOptions: {
        cornerRadius: 2,
        fill: new Color( 0, 0, 0, 0.5 )
      },

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
        1
      )
    );
    const readoutStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.velocityValueUnitsStringProperty, {
      value: velocityValueProperty,
      units: MySolarSystemStrings.units.kmsStringProperty
    } );

    const valueNode = new Text( readoutStringProperty, options.textOptions );

    const valueBackgroundNode = new Rectangle( options.rectangleOptions );

    // Resizes the value background and centers it on the value
    valueNode.boundsProperty.link( bounds => {
      valueBackgroundNode.rectBounds = bounds.dilated( 4 );
    } );

    // Value Container
    this.addChild( new Node( {
      children: [ valueBackgroundNode, valueNode ],
      visibleProperty: options.valuesVisibleProperty,
      center: new Vector2( 0, 30 )
    } ) );

    const bodyCollisionListener = () => {
      this.interruptSubtreeInput();
      ExplosionNode.explode( this );
    };

    this.body.collidedEmitter.addListener( bodyCollisionListener );

    const cueingArrowsNode = new CueingArrowsNode( {
      fill: options.mainColor,
      left: this.radius + 15,
      visibleProperty: CueingArrowsNode.createVisibleProperty( new BooleanProperty( options.draggable ), this.body.movedProperty )
    } );

    this.addChild( cueingArrowsNode );

    this.disposeBodyNode = () => {
      positionMultilink.dispose();
      radiusMultilink.dispose();
      this.body.collidedEmitter.removeListener( bodyCollisionListener );
      readoutStringProperty.dispose();
      velocityValueProperty.dispose();
      valueNode.dispose();
      cueingArrowsNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposeBodyNode();
    super.dispose();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );