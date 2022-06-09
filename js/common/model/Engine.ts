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
    const iterationCount = 400 / this.bodies.length;
    const N = this.bodies.length;
    dt /= iterationCount;

    const masses = this.bodies.map( body => body.massProperty.value );
    const positions = this.bodies.map( body => body.positionProperty.value.copy() );
    const velocities = this.bodies.map( body => body.velocityProperty.value.copy() );
    const accelerations = this.bodies.map( body => body.accelerationProperty.value.copy() );
    const forces = this.bodies.map( body => body.forceProperty.value.copy() );
    const previousAccelerations = this.bodies.map( body => body.previousAcceleration );

    for ( let k = 0; k < iterationCount; k++ ) {
      // Zeroing out forces
      for ( let i = 0; i < N; i++ ) {
        forces[ i ].setXY( 0, 0 );
      }

      // Iterate between all the bodies to add the forces
      for ( let i = 0; i < N; i++ ) {
        const mass1 = masses[ i ];
        for ( let j = i + 1; j < this.bodies.length; j++ ) {
          const mass2 = masses[ j ];

          const direction = scratchVector.set( positions[ j ] ).subtract( positions[ i ] );
          const distance = direction.magnitude;
          assert && assert( distance > 0, 'Negative distances not allowed!!' );
          const forceMagnitude = this.G * mass1 * mass2 * ( Math.pow( distance, -3 ) );
          const force = direction.multiplyScalar( forceMagnitude );

          forces[ i ].add( force );
          forces[ j ].subtract( force );
        }
      }

      // Compute accelerations
      for ( let i = 0; i < N; i++ ) {
        accelerations[ i ].set( forces[ i ] ).multiplyScalar( 1 / masses[ i ] );
      }

      // Forrest Ruth Integration Scheme (FRIS)

      for ( let i = 0; i < N; i++ ) {

        //-------------
        // Step One
        //--------------

         // net time: XI dt
        positions[ i ].add( scratchVector.set( velocities[ i ] ).multiplyScalar( XI * dt ) );

        // net time: (1 - 2 * LAMBDA) * dt / 2
        velocities[ i ].add( scratchVector.set( accelerations[ i ] ).multiplyScalar( ( 1 - 2 * LAMBDA ) * dt / 2 ) );

        //-------------
        // Step Two
        //--------------

        // net time: (XI+CHI) dt
        positions[ i ].add( scratchVector.set( velocities[ i ] ).multiplyScalar( CHI * dt ) );

        // net time: dt / 2
        velocities[ i ].add( scratchVector.set( accelerations[ i ] ).multiplyScalar( LAMBDA * dt ) );

        //-------------
        // Step Three
        //--------------

        // net time: (1-(XI+CHI)) dt
        positions[ i ].add( scratchVector.set( velocities[ i ] ).multiplyScalar( ( 1 - 2 * ( CHI + XI ) ) * dt ) );

        // net time: (1/2 + LAMBDA) dt
        velocities[ i ].add( scratchVector.set( accelerations[ i ] ).multiplyScalar( LAMBDA * dt ) );

        //-------------
        // Step Four
        //--------------

        // net time: (1-(XI)) dt
        positions[ i ].add( scratchVector.set( velocities[ i ] ).multiplyScalar( CHI * dt ) );

        // no update in velocities // net time: (1/2 + LAMBDA) dt

        //-------------
        // Step Five: last step, these are the final positions and velocities i.e. r(t+dt) and v(t+dt)
        //--------------

        // IMPORTANT: we need to update the velocities first

        // net time:  dt;
        velocities[ i ].add( scratchVector.set( accelerations[ i ] ).multiplyScalar( ( 1 - 2 * LAMBDA ) * dt / 2 ) );

        // net time:  dt
        positions[ i ].add( scratchVector.set( velocities[ i ] ).multiplyScalar( XI * dt ) );
      }
    }

    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body = this.bodies[ i ];
      body.positionProperty.value = positions[ i ];
      body.velocityProperty.value = velocities[ i ];
      body.accelerationProperty.value = accelerations[ i ];
      body.forceProperty.value = forces[ i ];
      body.previousAcceleration = previousAccelerations[ i ];
    }
  }

  updateForces(): void {
    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body = this.bodies[ i ];
      body.accelerationProperty.value = Vector2.ZERO;
      body.forceProperty.value = Vector2.ZERO;
    }

    // Iterate between all the bodies to add the accelerations
    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body1 = this.bodies[ i ];
      const mass1 = body1.massProperty.value;
      for ( let j = i + 1; j < this.bodies.length; j++ ) {
        const body2 = this.bodies[ j ];
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
  }
}

mySolarSystem.register( 'Engine', Engine );
export default Engine;