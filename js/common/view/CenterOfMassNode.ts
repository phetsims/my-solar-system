// Copyright 2023-2024, University of Colorado Boulder

/**
 * CenterOfMassNode draws the center of mass as a red 'X'.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import CenterOfMass from '../model/CenterOfMass.js';

export default class CenterOfMassNode extends Node {
  public constructor( centerOfMass: CenterOfMass,
                      visibleProperty: TReadOnlyProperty<boolean>,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      tandem: Tandem ) {
    super( {
      isDisposable: false,
      children: [
        new XNode( {
          fill: 'red',
          stroke: SolarSystemCommonColors.foregroundProperty,
          center: Vector2.ZERO
        } )
      ],
      visibleProperty: visibleProperty,
      tandem: tandem,
      phetioFeatured: true
    } );

    Multilink.multilink( [ centerOfMass.positionProperty, modelViewTransformProperty ],
      ( position, modelViewTransform ) => {
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

    this.addLinkedElement( centerOfMass );
  }
}

mySolarSystem.register( 'CenterOfMassNode', CenterOfMassNode );