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

type BodyNodeOptions = ShadedSphereNodeOptions;

export default class BodyNode extends ShadedSphereNode {
  body: Body;
  initialMass: number;
  positionListener: ( position:Vector2 ) => void;
  massListener: ( mass:number ) => void;

  constructor( body: Body, modelViewTransform: ModelViewTransform2, providedOptions?: BodyNodeOptions ) {
    const options = optionize<BodyNodeOptions, {}, ShadedSphereNodeOptions>()( {
      cursor: 'pointer'
    }, providedOptions );
    super( 1, options );
    this.body = body;
    this.initialMass = 200; //body.massProperty.value;
    this.setScaleMagnitude( this.massToScale( body.massProperty.value ) );
    this.positionListener = position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    };
    this.body.positionProperty.link( this.positionListener );

    let PointerDistanceFromCenter: Vector2 | null = null;

    const dragListener = new DragListener( {
      start: ( event: PressListenerEvent ) => {
        PointerDistanceFromCenter = modelViewTransform.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).minus( this.body.positionProperty.value );
      },
      drag: ( event: PressListenerEvent ) => {
        body.positionProperty.value = modelViewTransform.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).minus( PointerDistanceFromCenter! );
      }
    } );
    this.addInputListener( dragListener );

    this.massListener = mass => {
      this.setScaleMagnitude( this.massToScale( mass ) );
    };

    this.body.massProperty.link( this.massListener );
  }

  massToScale( mass: number ): number {
    return 20 * mass / this.initialMass + 5;
  }

  override dispose(): void {
    this.body.positionProperty.unlink( this.positionListener );
    this.body.massProperty.unlink( this.massListener );

    super.dispose();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );