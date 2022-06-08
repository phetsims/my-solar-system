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

// constants for Forrest Ruth Integration Scheme (FRIS)
const XI = 0.1786178958448091;
const LAMBDA = -0.2123418310626054;
const CHI = -0.06626458266981849;

class Engine {
  // Gravitational constant
  private readonly G: number;

  // Array of gravitational interacting bodies
  private bodies: ObservableArray<Body>;

  constructor( bodies: ObservableArray<Body> ) {
    this.G = 10000;
    this.bodies = bodies;
  }

  update( bodies: ObservableArray<Body> ): void {
    // Reset the bodies array and recalculate total mass
    this.bodies = bodies;
    this.updateForces();
  }

  reset(): void {
    this.updateForces();
  }

  run( dt: number ): void {
    this.updateForces();
    // this.verlet( dt );
    this.FRIS( dt );
  }

  updateForces(): void {
    this.resetAccelerations();
    this.applyForces();
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
        body2.forceProperty.value = body2.forceProperty.value.minus( scratchVector.set( force ) );
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
    assert && assert( distance > 0, 'Negative distances not allowed!!' );
    const forceMagnitude = this.G * body1.massProperty.value * body2.massProperty.value * ( Math.pow( distance, -3 ) );
    const force: Vector2 = direction.times( forceMagnitude );
    return force;
  }

  /**
   * Modify the positionProperty and velocityProperty of all bodies based on the Verlet's algorithm
   * x(t+dt) = x(t) + v(t)*dt + a(t)*0.5*dt*dt
   * v(t+dt) = v(t) + (a(t+dt) + a(t))*0.5*dt
   */
  verlet( dt: number ): void {
    this.bodies.forEach( body => {
      const velocity: Vector2 = body.velocityProperty.value;
      const acceleration: Vector2 = body.accelerationProperty.value;
      const previousAcceleration: Vector2 = body.previousAcceleration;
      body.positionProperty.value = body.positionProperty.value.plus( velocity.times( dt ) ).plus( previousAcceleration.times( 0.5 * dt * dt ) );
      body.velocityProperty.value = body.velocityProperty.value.plus( acceleration.plus( previousAcceleration ).times( 0.5 * dt ) );
      body.previousAcceleration = body.accelerationProperty.value;
    } );

  }

  updatePositions( dt: number ): void {
    this.bodies.forEach( body => {
      body.positionProperty.value = body.positionProperty.value.plus( body.velocityProperty.value.times( dt ) );
    } );
  }

  updateVelocities( dt: number ): void {
    this.bodies.forEach( body => {
      body.velocityProperty.value = body.velocityProperty.value.plus( body.accelerationProperty.value.times( dt ) );
    } );
  }
  
  FRIS( dt: number ): void {
    // Forrest Ruth Integration Scheme (FRIS)
    
    //-------------
    // Step One
    //--------------

    // update Positions
    this.updatePositions( XI * dt ); // net time: XI dt

    // update Velocities
    this.updateVelocities( ( 1 - 2 * LAMBDA ) * dt / 2 ); // net time: (1 - 2 * LAMBDA) * dt / 2

    //-------------
    // Step Two
    //--------------

    // update Positions
    this.updatePositions( CHI * dt ); // net time: (XI+CHI) dt

    // update Velocities
    this.updateVelocities( LAMBDA * dt ); // net time: dt / 2

    //-------------
    // Step Three
    //--------------

    // update Positions
    this.updatePositions( ( 1 - 2 * ( CHI + XI ) ) * dt ); // net time: (1-(XI+CHI)) dt

    // update Velocities
    this.updateVelocities( LAMBDA * dt ); // net time: (1/2 + LAMBDA) dt

    //-------------
    // Step Four
    //--------------

    // update Positions
    this.updatePositions( CHI * dt ); // net time: (1-(XI)) dt

    // update Velocities
    // no update in velocities // net time: (1/2 + LAMBDA) dt

    //-------------
    // Step Five: last step, these are the final positions and velocities i.e. r(t+dt) and v(t+dt)
    //--------------

    // IMPORTANT: we need to update the velocities first

    // update Velocities
    this.updateVelocities( ( 1 - 2 * LAMBDA ) * dt / 2 ); // net time:  dt;

    // update Positions
    this.updatePositions( XI * dt ); // net time:  dt

    //-------------
    // Update the new acceleration
    //-------------
    // this.updateAccelerations();

  }
}

mySolarSystem.register( 'Engine', Engine );
export default Engine;