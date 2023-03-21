// Copyright 2023, University of Colorado Boulder
/**
 * Control the Center of Mass mark.
 *
 * Persistent for the life of the simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import CenterOfMass from '../model/CenterOfMass.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';

export default class CenterOfMassNode extends Node {
  public constructor( centerOfMass: CenterOfMass, modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2> ) {
    super( {
      children: [
        new XNode( {
          fill: 'red',
          stroke: SolarSystemCommonColors.foregroundProperty,
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