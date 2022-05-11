// Copyright 2020-2022, University of Colorado Boulder
/**
 * Control the Center of Mass mark.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import { Node } from '../../../../scenery/js/imports.js';


class CenterOfMassNode extends Node {
  readonly centerOfMass: Property<Vector2>;
  readonly positionListener: ( position:Vector2 ) => void


  constructor( centerOfMass: Property<Vector2>, modelViewTransform: ModelViewTransform2 ) {
    super();
    this.centerOfMass = centerOfMass;

    this.addChild( new XNode( {
      fill: 'red',
      stroke: 'white',
      center: Vector2.ZERO
    } ) );

    this.positionListener = position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    };
    this.centerOfMass.link( this.positionListener );
  }
}

mySolarSystem.register( 'CenterOfMassNode', CenterOfMassNode );
export default CenterOfMassNode;