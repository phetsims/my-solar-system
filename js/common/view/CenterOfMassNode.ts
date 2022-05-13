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


class CenterOfMassNode extends Node {
  readonly centerOfMass: CenterOfMass;
  readonly positionListener: ( position:Vector2 ) => void
  readonly visibilityListener: ( visible:boolean ) => void


  constructor( centerOfMass: CenterOfMass, modelViewTransform: ModelViewTransform2 ) {
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
    this.centerOfMass.positionProperty.link( this.positionListener );

    this.visibilityListener = visible => {
      this.visible = visible;
    };
    this.centerOfMass.visibleProperty.link( this.visibilityListener );
  }
}

mySolarSystem.register( 'CenterOfMassNode', CenterOfMassNode );
export default CenterOfMassNode;