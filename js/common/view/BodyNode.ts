// Copyright 2021-2022, University of Colorado Boulder

/**
 * Visible Body Node that draws a sphere with size dependent on the Body's mass.
 *
 * @author Agustín Vallejo
 */

import { DragListener, Node, PressListenerEvent } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class BodyNode extends Node {
  body: Body;
  initialMass: number;
  sphereNode: ShadedSphereNode;
  positionListener: ( position:Vector2 ) => void;
  massListener: ( mass:number ) => void;

  constructor( body: Body, modelViewTransform: ModelViewTransform2 ) {
    super();
    this.body = body;
    this.initialMass = 200; //body.massProperty.value;
    this.sphereNode = new ShadedSphereNode( 1, { mainColor: 'yellow', cursor: 'pointer' } );
    this.sphereNode.setScaleMagnitude( this.massToScale( body.massProperty.value ) );
    this.addChild( this.sphereNode );

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
    this.sphereNode.addInputListener( dragListener );

    this.massListener = mass => {
      this.sphereNode.setScaleMagnitude( this.massToScale( mass ) );
    };

    this.body.massProperty.link( this.massListener );
  }

  massToScale( mass: number ): number {
    return 200 * mass / this.initialMass + 5;
  }

  override dispose(): void {
    this.body.positionProperty.unlink( this.positionListener );
    this.body.massProperty.unlink( this.massListener );

    super.dispose();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );
export default BodyNode;