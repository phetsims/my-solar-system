// Copyright 2021, University of Colorado Boulder

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

    this.addChild( new Circle( 50, { fill: 'red' } ) );
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );
export default BodyNode;