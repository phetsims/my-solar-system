// Copyright 2022, University of Colorado Boulder

/**
 * Everything that controls the gravitational interactions between bodies.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Body from './Body.js';

const scratchVector = new Vector2( 0, 0 );

class Engine {
  // Gravitational constant
  G;

  // Array of gravitational interacting bodies
  bodies: ObservableArray<Body>;
  totalMass: number;

  constructor( bodies: ObservableArray<Body> ) {
    this.G = 10000;
    this.bodies = bodies;
    this.totalMass = 0;
    this.bodies.forEach( body => {
      this.totalMass += body.massProperty.value;
    } );
  }

  update( bodies: ObservableArray<Body> ): void {
    // Reset the bodies array and recalculate total mass
    this.bodies = bodies;
    this.totalMass = 0;
    this.bodies.forEach( body => {
      this.totalMass += body.massProperty.value;
    } );
  }

  getCenterOfMassPosition(): Vector2 {
    const centerOfMassPosition = new Vector2( 0, 0 );
    this.bodies.forEach( body => {
      assert && assert( this.totalMass !== 0, 'Total mass should not go to 0' );
      centerOfMassPosition.add( body.positionProperty.value.times( body.massProperty.value / this.totalMass ) );
    } );
    return centerOfMassPosition;
  }

  restart(): void {
    this.resetAccelerations();
    this.applyForces();
  }

  reset(): void {
    this.restart();
  }

  run( dt: number ): void {
    this.resetAccelerations();
    this.applyForces();
    this.verlet( dt );
  }

  resetAccelerations(): void {
    this.bodies.forEach( body => {
      body.accelerationProperty.value = Vector2.ZERO;
      body.forceProperty.value = Vector2.ZERO;
    } );
  }

  applyForces(): void {
    // Iterate between all the bodies to add the accelerations
    for ( let i = 0; i < this.bodies.length; i++ ) {
      for ( let j = i + 1; j < this.bodies.length; j++ ) {
        const body1 = this.bodies[ i ];
        const body2 = this.bodies[ j ];
        const mass1 = body1.massProperty.value;
        const mass2 = body2.massProperty.value;
        const force: Vector2 = this.getForce( body1, body2 );
        body1.forceProperty.value = body1.forceProperty.value.plus( scratchVector.set( force ) );
        body2.forceProperty.value = body2.forceProperty.value.plus( scratchVector.set( force ) ).multiply( -1 );
        body1.accelerationProperty.value = body1.forceProperty.value.times( 1 / mass1 );
        body2.accelerationProperty.value = body2.forceProperty.value.times( 1 / mass2 );
      }
    }
  }

  /**
   * Calculate the force on body1 because of body2
   */
  getForce( body1: Body, body2: Body ): Vector2 {
    const direction: Vector2 = body2.positionProperty.value.minus( body1.positionProperty.value );
    const distance = direction.magnitude;
    const forceMagnitude = this.G * body1.massProperty.value * body2.massProperty.value * ( Math.pow( distance, -3 ) );
    const force: Vector2 = direction.times( forceMagnitude );
    return force;
  }

  /**
   * Modify the positionProperty and velocityProperty of all bodies based on the Verlet's algorithm
   * x(t+dt) = x(t) + v(t)dt + 0.5a(t)*dt^2
   * v(t+dt) = v(t) + 0.5*dt*(a(t+dt) + a(t))
   */
  verlet( dt: number ): void {
    this.bodies.forEach( body => {
      const velocity: Vector2 = body.velocityProperty.value;
      const acceleration: Vector2 = body.accelerationProperty.value;
      const previousAcceleration: Vector2 = body.previousAcceleration;
      body.positionProperty.value = body.positionProperty.value.plus( velocity.times( dt ) ).plus( acceleration.times( 0.5 * dt * dt ) );
      body.velocityProperty.value = body.velocityProperty.value.plus( acceleration.plus( previousAcceleration ).times( 0.5 * dt ) );
      body.previousAcceleration = body.accelerationProperty.value;
    } );

  }
}

mySolarSystem.register( 'Engine', Engine );
export default Engine;