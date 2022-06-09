// Copyright 2014-2022, University of Colorado Boulder

/**
 * Used to show the draggable velocity vectors.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */


import mySolarSystem from '../../mySolarSystem.js';
import Property, { ReadOnlyProperty } from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, DragListener, Path, PressListenerEvent, Text } from '../../../../scenery/js/imports.js';
import VectorNode from './VectorNode.js';
import Body from '../model/Body.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class DraggableVectorNode extends VectorNode {

  constructor(
    body: Body,
    transformProperty: ReadOnlyProperty<ModelViewTransform2>,
    visibleProperty: Property<boolean>,
    vectorProperty: Property<Vector2>,
    scale: number,
    labelText: string,
    providedOptions?: object ) {

    super(
      body,
      transformProperty,
      visibleProperty,
      vectorProperty,
      scale,
      providedOptions
      );

    // a circle with text (a character) in the center, to help indicate what it represents
    // ("v" for velocity in this sim)
    const ellipse = Shape.ellipse( 0, 0, 18, 18, 0 );
    const grabArea = new Path( ellipse, {
      lineWidth: 3,
      stroke: Color.lightGray,
      cursor: 'pointer'
    } );

    const text = new Text( labelText, {
      font: new PhetFont( 22 ),
      fontWeight: 'bold',
      fill: Color.gray,
      maxWidth: 25
    } );
    this.tipProperty.link( tip => {
      text.center = tip;
      grabArea.center = tip;
    } );

    this.addChild( grabArea );
    this.addChild( text );

    // The velocity vector is rooted on the object, so we manage all of its drags by deltas.
    let previousPoint: Vector2 | null = null;
    let previousValue: Vector2 | null = null;

    // Add the drag handler
    const dragListener = new DragListener( {
      start: ( event: PressListenerEvent ) => {
        previousPoint = transformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).timesScalar( 1 / scale );
        previousValue = body.velocityProperty.get();
      },
      drag: ( event: PressListenerEvent ) => {

        const currentPoint = transformProperty.value.viewToModelPosition( this.globalToParentPoint( event.pointer.point ) ).timesScalar( 1 / scale );
        if ( previousPoint ) {
          const delta = currentPoint.minus( previousPoint );

          const proposedVelocity = previousValue!.plus( delta );
          const viewVector = transformProperty.value.modelToViewDelta( proposedVelocity.times( scale ) );
          if ( viewVector.magnitude < 10 ) {
            proposedVelocity.setXY( 0, 0 );
          }
          body.velocityProperty.value = proposedVelocity;
          body.userModifiedVelocityEmitter.emit();
        }
      },
      end: () => {}
      // tandem: tandem.createTandem( 'dragListener' )
    } );
    grabArea.addInputListener( dragListener );

    // // move behind the geometry created by the superclass
    grabArea.moveToBack();
    text.moveToBack();

    // // For PhET-iO, when the node does not support input, don't show the drag circle
    // this.inputEnabledProperty.link( ( inputEnabled: boolean ) => {
    //   grabArea.visible = inputEnabled;
    //   text.visible = inputEnabled;
    // } );
  }
}

mySolarSystem.register( 'DraggableVectorNode', DraggableVectorNode );