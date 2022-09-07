// Copyright 2022, University of Colorado Boulder
/**
 * Control the Center of Mass mark.
 *
 * Persistent for the life of the simulation.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import CenterOfMass from '../model/CenterOfMass.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';

class CenterOfMassNode extends Node {
  //REVIEW: Generally prefer TReadOnlyProperty instead of ReadOnlyProperty where possible for interfaces
  public constructor( centerOfMass: CenterOfMass, modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2> ) {
    super( {
      children: [
        new XNode( {
          fill: 'red',
          stroke: 'white',
          center: Vector2.ZERO
        } )
      ],
      visibleProperty: centerOfMass.visibleProperty
    } );

    centerOfMass.positionProperty.link( position => {
      this.translation = modelViewTransformProperty.value.modelToViewPosition( position );
    } );
  }
}

mySolarSystem.register( 'CenterOfMassNode', CenterOfMassNode );
export default CenterOfMassNode;