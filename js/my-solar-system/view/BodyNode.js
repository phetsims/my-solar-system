// Copyright 2021, University of Colorado Boulder

/**
 * PLACE DOCUMENTATION HERE ABOUT THE GENERAL TYPE
 *
 * @author PUT YOUR NAME HERE
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import mySolarSystem from '../../mySolarSystem.js';

class BodyNode extends Node {
  /**
   * @param {Body} body
   */
  constructor( body ) {
    super();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );
export default BodyNode;