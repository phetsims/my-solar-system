// Copyright 2021-2022, University of Colorado Boulder

/**
 * Draws a vector for a Body, such as a force vector or velocity vector.
 *
 * @author Agustín Vallejo
 */

import { Color, Node } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Multilink from '../../../../axon/js/Multilink.js';

class VectorNode extends Node {
  readonly body: Body
  readonly transformProperty: Property<ModelViewTransform2>
  readonly vectorProperty: Property<Vector2>
  protected readonly vectorNodeScale: number;
  private readonly propertyListener: ( visible: boolean ) => void;
  readonly multilink: Multilink<any[]>;

  constructor(
    body: Body,
    transformProperty: Property<ModelViewTransform2>,
    visibleProperty: Property<boolean>,
    vectorProperty: Property<Vector2>,
    scale: number,
    fill: Color
     ) {
    super();

    this.body = body;
    this.transformProperty = transformProperty;
    this.vectorProperty = vectorProperty;
    this.vectorNodeScale = scale;

    const arrowNode = new ArrowNode( 0, 0, 0, 0, {
      headHeight: 15,
      headWidth: 15,
      tailWidth: 5,
      fill: fill,
      stroke: fill,
      pickable: false,
      boundsMethod: 'none',
      isHeadDynamic: true,
      scaleTailToo: true
    } );

    
    this.propertyListener = visible => {
      this.visible = visible;
      if ( visible ) {
        const tail = this.getTail();
        const tip = this.getTip( tail );
        arrowNode.setTailAndTip( tail.x, tail.y, tip.x, tip.y );
      }
    };
    this.multilink = new Multilink<any[]>( [ visibleProperty, vectorProperty, body.positionProperty, transformProperty ], this.propertyListener );


    this.addChild( arrowNode );
  }

  private getTail(): Vector2 {
    return this.transformProperty.get().modelToViewPosition( this.body.positionProperty.get() );
  }

  protected getTip( tail: Vector2 = this.getTail() ): Vector2 {
    const force = this.transformProperty.get().modelToViewDelta( this.vectorProperty.get().times( this.vectorNodeScale ) );
    return new Vector2( force.x + tail.x, force.y + tail.y );
  }

  override dispose(): void {
    this.multilink.dispose();
    super.dispose();
  }
}

mySolarSystem.register( 'VectorNode', VectorNode );
export default VectorNode;