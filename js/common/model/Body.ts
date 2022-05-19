// Copyright 2021-2022, University of Colorado Boulder

/**
 * Model for a gravitational interacting Body
 *
 * @author Agustín Vallejo
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import mySolarSystem from '../../mySolarSystem.js';

class Body {
  // Unitless body quantities.
  readonly massProperty: Property<number>;
  readonly positionProperty: Property<Vector2>;
  readonly velocityProperty: Property<Vector2>;
  readonly accelerationProperty: Property<Vector2>;
  readonly forceProperty: Property<Vector2>;
  readonly userModifiedPositionEmitter: Emitter;
  readonly userModifiedVelocityEmitter: Emitter;


  // Previous values for velocity Verlet algorithm
  previousAcceleration: Vector2;
  previousPosition: Vector2;

  constructor( mass: number, position: Vector2, velocity: Vector2 ) {
    this.massProperty = new Property<number>( mass );
    this.positionProperty = new Property<Vector2>( position );
    this.velocityProperty = new Property<Vector2>( velocity );
    this.accelerationProperty = new Property<Vector2>( Vector2.ZERO );
    this.forceProperty = new Property<Vector2>( Vector2.ZERO );
    this.previousAcceleration = this.accelerationProperty.value; // Previous acceleration for velocity Verlet algorithm
    this.previousPosition = this.positionProperty.value; // Previous acceleration for velocity Verlet algorithm

    this.userModifiedPositionEmitter = new Emitter();
    this.userModifiedVelocityEmitter = new Emitter();
  }

  reset(): void {
    this.massProperty.reset();
    this.positionProperty.reset();
    this.velocityProperty.reset();
    this.accelerationProperty.reset();
    this.forceProperty.reset();
    this.previousAcceleration = this.accelerationProperty.value; // Previous acceleration for velocity Verlet algorithm
    this.previousPosition = this.positionProperty.value;
  }
}

mySolarSystem.register( 'Body', Body );
export default Body;