// Copyright 2022, University of Colorado Boulder

/**
 * Draws a vector for a Body, such as a force vector or velocity vector.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import optionize from '../../../../phet-core/js/optionize.js';

class VectorNode extends ArrowNode {
  private readonly multilink: Multilink<any[]>;

  constructor(
    body: Body,
    transformProperty: Property<ModelViewTransform2>,
    visibleProperty: Property<boolean>,
    vectorProperty: Property<Vector2>,
    scale: number,
    providedOptions?: ArrowNodeOptions
     ) {

    super( 0, 0, 0, 0, optionize<ArrowNodeOptions, {}, ArrowNodeOptions>()( {
      headHeight: 15,
      headWidth: 15,
      tailWidth: 5,
      stroke: '#404040',
      pickable: false,
      boundsMethod: 'none',
      isHeadDynamic: true,
      scaleTailToo: true
    }, providedOptions ) );

    this.multilink = new Multilink( [ visibleProperty, vectorProperty, body.positionProperty, transformProperty ],
      ( visible: boolean, vector: Vector2, bodyPosition: Vector2, transform: ModelViewTransform2 ) => {

      this.visible = visible;

      if ( visible ) {
        const tail = transform.modelToViewPosition( bodyPosition );
        const force = transform.modelToViewDelta( vector.times( scale ) );
        const tip = force.plus( tail );

        this.setTailAndTip( tail.x, tail.y, tip.x, tip.y );
      }
    } );
  }

  override dispose(): void {
    this.multilink.dispose();

    super.dispose();
  }
}

mySolarSystem.register( 'VectorNode', VectorNode );
export default VectorNode;