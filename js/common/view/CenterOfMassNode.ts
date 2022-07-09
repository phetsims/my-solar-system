// Copyright 2022, University of Colorado Boulder
/**
 * Control the Center of Mass mark.
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
  private readonly centerOfMass: CenterOfMass;
  private readonly positionListener: ( position: Vector2 ) => void;
  private readonly visibilityListener: ( visible: boolean ) => void;

  constructor( centerOfMass: CenterOfMass, modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2> ) {
    super();
    this.centerOfMass = centerOfMass;

    this.addChild( new XNode( {
      fill: 'red',
      stroke: 'white',
      center: Vector2.ZERO
    } ) );

    this.positionListener = position => {
      this.translation = modelViewTransformProperty.value.modelToViewPosition( position );
    };
    this.centerOfMass.positionProperty.link( this.positionListener );

    this.visibilityListener = visible => {
      this.visible = visible;
    };
    this.centerOfMass.visibleProperty.link( this.visibilityListener );
  }
}

mySolarSystem.register( 'CenterOfMassNode', CenterOfMassNode );
export default CenterOfMassNode;