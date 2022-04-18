// Copyright 2021-2022, University of Colorado Boulder

/**
 * PLACE DOCUMENTATION HERE ABOUT THE GENERAL TYPE
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import mySolarSystem from '../../mySolarSystem.js';

class Body {
  massProperty: NumberProperty;
  positionProperty: Vector2Property;
  velocityProperty: Vector2Property;
  accelerationProperty: Vector2Property;
  previousAcceleration: Vector2; // Previous acceleration for velocity Verlet algorithm
  previousPosition: Vector2; // Previous position for velocity Verlet algorithm
  // Not a property because it is only used for the Verlet in the Model

  constructor( mass: number, position: Vector2, velocity: Vector2 ) {
    this.massProperty = new NumberProperty( mass );
    this.positionProperty = new Vector2Property( position );
    this.velocityProperty = new Vector2Property( velocity );
    this.accelerationProperty = new Vector2Property( new Vector2( 0, 0 ) );
    this.previousAcceleration = this.accelerationProperty.value; // Previous acceleration for velocity Verlet algorithm
    this.previousPosition = this.positionProperty.value; // Previous acceleration for velocity Verlet algorithm
  }
}

mySolarSystem.register( 'Body', Body );
export default Body;