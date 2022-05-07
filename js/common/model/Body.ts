// Copyright 2021-2022, University of Colorado Boulder

/**
 * Model for a gravitational interacting Body
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import mySolarSystem from '../../mySolarSystem.js';

class Body {
  //REVIEW: Fields which are not reassigned should be marked `readonly` according to our TypeScript conventions.
  //REVIEW: That includes every field currently in this file.

  // Unitless body quantities.
  massProperty: Property<number>;
  positionProperty: Property<Vector2>;
  velocityProperty: Property<Vector2>;
  accelerationProperty: Property<Vector2>;

  // Previous values for velocity Verlet algorithm
  previousAcceleration: Vector2;
  previousPosition: Vector2;

  constructor( mass: number, position: Vector2, velocity: Vector2 ) {
    this.massProperty = new Property<number>( mass );
    this.positionProperty = new Property<Vector2>( position );
    this.velocityProperty = new Property<Vector2>( velocity );
    this.accelerationProperty = new Property<Vector2>( Vector2.ZERO );
    this.previousAcceleration = this.accelerationProperty.value; // Previous acceleration for velocity Verlet algorithm
    this.previousPosition = this.positionProperty.value; // Previous acceleration for velocity Verlet algorithm
  }
}

mySolarSystem.register( 'Body', Body );
export default Body;