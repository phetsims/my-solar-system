// Copyright 2021, University of Colorado Boulder

/**
 * PLACE DOCUMENTATION HERE ABOUT THE GENERAL TYPE
 *
 * @author PUT YOUR NAME HERE
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import mySolarSystem from '../../mySolarSystem.js';


class Body {
  constructor() {
    this.positionProperty = new Vector2Property(Vector2.ZERO);

  }
}

mySolarSystem.register( 'Body', Body );
export default Body;