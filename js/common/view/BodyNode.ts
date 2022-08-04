// Copyright 2021-2022, University of Colorado Boulder

/**
 * Visible Body Node that draws a sphere with size dependent on the Body's mass.
 *
 * @author Agustín Vallejo
 */

import { DragListener, PressListenerEvent } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';

type SelfOptions = {
  draggable?: boolean;
};
type BodyNodeOptions = SelfOptions & ShadedSphereNodeOptions;

export default class BodyNode extends ShadedSphereNode {
  public readonly body: Body;
  public readonly initialMass: number;
  private readonly positionMultilink: UnknownMultilink;
  public readonly draggable: boolean;

  public constructor( body: Body, modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2>, providedOptions?: BodyNodeOptions ) {
    const options = optionize<BodyNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {
      cursor: 'pointer',
      draggable: true
    }, providedOptions );

    super( 1, options );

    this.body = body;
    this.initialMass = 200; //body.massProperty.value;

    this.positionMultilink = Multilink.multilink(
      [ body.positionProperty, body.massProperty, modelViewTransformProperty ],
      ( position, mass, modelViewTransform ) => {
        this.setScaleMagnitude( this.massToScale( mass, modelViewTransform.modelToViewDeltaX( 1 ) ) );
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

    let PointerDistanceFromCenter: Vector2 | null = null;

    this.draggable = options.draggable;
    if ( this.draggable ) {
      const dragListener = new DragListener( {
        start: ( event: PressListenerEvent ) => {
          PointerDistanceFromCenter = modelViewTransformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).minus( this.body.positionProperty.value );
        },
        drag: ( event: PressListenerEvent ) => {
          body.positionProperty.value = modelViewTransformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).minus( PointerDistanceFromCenter! );
          body.clearPath();
        }
      } );
      this.addInputListener( dragListener );
    }
  }

  private massToScale( mass: number, scale: number ): number {
    return scale * ( 30 * mass / this.initialMass + 20 );
  }

  public override dispose(): void {
    this.positionMultilink.dispose();
    super.dispose();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );