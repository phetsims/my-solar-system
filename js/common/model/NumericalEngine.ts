// Copyright 2022, University of Colorado Boulder

/**
 * Logic that controls the gravitational interactions between bodies.
 *
 * The engine updates the position of the bodies on the run() function,
 * inside it uses a Forrest-Ruth algorithm to calculate the position of the bodies.
 *
 * There's also a function to use the Verlet algorithm, but it's deprecated.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Body from './Body.js';
import Engine from './Engine.js';

const scratchVector = new Vector2( 0, 0 );

// constants for Forrest Ruth Integration Scheme (FRIS)
const XI = 0.1786178958448091;
const LAMBDA = -0.2123418310626054;
const CHI = -0.06626458266981849;

export default class NumericalEngine extends Engine {
  // Gravitational constant
  private readonly G = 10000;

  public constructor( bodies: ObservableArray<Body> ) {
    super( bodies );
  }

  public override update( bodies: ObservableArray<Body> ): void {
    // Reset the bodies array and recalculate total mass
    this.bodies = bodies;
    this.checkCollisions();
    this.updateForces();
  }

  private checkCollisions(): void {
    for ( let i = 0; i < this.bodies.length; i++ ) {
      for ( let j = i + 1; j < this.bodies.length; j++ ) {
        const body1 = this.bodies[ i ];
        const body2 = this.bodies[ j ];
        const distance = body1.positionProperty.value.distance( body2.positionProperty.value );
        if ( distance < body1.radiusProperty.value + body2.radiusProperty.value ) {
          if ( body1.massProperty.value > body2.massProperty.value ) {
            this.bodies[ j ].reset();
            this.bodies.splice( j, 1 );
          }
          else {
            this.bodies[ i ].reset();
            this.bodies.splice( i, 1 );
          }
        }
      }
    }
  }

  public override reset(): void {
    this.updateForces();
  }

  public override run( dt: number ): void {
    const iterationCount = 400 / this.bodies.length;
    const N = this.bodies.length;
    dt /= iterationCount;

    //REVIEW: If performance is a problem or concern, we could avoid the array creation AND arrow functions
    //REVIEW: (which can significantly slow down inner-loop code). If we're doing a LOT of iterations, and this is
    //REVIEW: outside the inner-loop code, then it seems fine.
    const masses = this.bodies.map( body => body.massProperty.value );
    const positions = this.bodies.map( body => body.positionProperty.value.copy() );
    const velocities = this.bodies.map( body => body.velocityProperty.value.copy() );
    const accelerations = this.bodies.map( body => body.accelerationProperty.value.copy() );
    const forces = this.bodies.map( body => body.forceProperty.value.copy() );

    for ( let k = 0; k < iterationCount; k++ ) {
      // Zeroing out forces
      for ( let i = 0; i < N; i++ ) {
        forces[ i ].setXY( 0, 0 );
      }

      // Iterate between all the bodies to add the forces and check collisions
      for ( let i = 0; i < N; i++ ) {
        const mass1 = masses[ i ];
        for ( let j = i + 1; j < N; j++ ) {
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
    }
  }

  private updateForces(): void {
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
  private getForce( body1: Body, body2: Body ): Vector2 {
    const direction: Vector2 = body2.positionProperty.value.minus( body1.positionProperty.value );
    const distance = direction.magnitude;
    assert && assert( distance > 0, 'Negative distances not allowed!!' );
    const forceMagnitude = this.G * body1.massProperty.value * body2.massProperty.value * ( Math.pow( distance, -3 ) );
    return direction.times( forceMagnitude );
  }
}

mySolarSystem.register( 'NumericalEngine', NumericalEngine );