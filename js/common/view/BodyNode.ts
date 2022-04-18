// Copyright 2021-2022, University of Colorado Boulder

/**
 * PLACE DOCUMENTATION HERE ABOUT THE GENERAL TYPE
 *
 * @author Agustín Vallejo
 */

import { Circle, Node } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';

class BodyNode extends Node {
  
  constructor( body: Body ) {
    super();

    this.addChild( new Circle( body.massProperty.value / 5, { fill: 'white' } ) ); // Create white circles with R=mass

    body.positionProperty.link( position => {
      this.translation = position;
    } );
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );
export default BodyNode;