// Copyright 2022-2024, University of Colorado Boulder

/**
 * Logic that controls the gravitational interactions between bodies.
 *
 * The engine updates the position of the bodies on the run() function,
 * inside it uses a Position Extended Forest-Ruth Like algorithm (PEFRL) (Omelyan, Myrglod & Folk, 2001)
 *
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import Engine from '../../../../solar-system-common/js/model/Engine.js';
import { G } from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import mySolarSystem from '../../mySolarSystem.js';

// Used when we want to avoid modifying a Vector (position, velocity, acceleration),
// and want to avoid allocating a new Vector copy.
const scratchVector = new Vector2( 0, 0 );

// constants for PEFRL algorithm
const XI = 0.1786178958448091;
const LAMBDA = -0.2123418310626054;
const CHI = -0.06626458266981849;

export default class NumericalEngine extends Engine {

  public constructor( bodies: Body[] ) {
    super( bodies );
  }

  /**
   * In this update function, the local bodies array is updated, the system then checks for collisions and updates the gravityForces.
   */
  public override update( bodies: Body[] ): void {
    this.bodies = bodies;
    this.checkCollisions();
    this.updateForces();
  }

  /**
   * Compares the position of all the bodies to check if they are overlapping.
   * Then disable the smaller one.
   */
  public override checkCollisions(): void {

    // We need to rerun collision checks if we get one collision
    let hadCollision = true;
    while ( hadCollision ) {
      hadCollision = false;

      for ( let i = 0; i < this.bodies.length; i++ ) {
        const body1 = this.bodies[ i ];
        for ( let j = i + 1; j < this.bodies.length; j++ ) {
          const body2 = this.bodies[ j ];
          if ( body1.isOverlapping( body2 ) ) {
            const isBody1Larger = body1.massProperty.value > body2.massProperty.value;
            const largerBody = isBody1Larger ? body1 : body2;
            const smallerBody = isBody1Larger ? body2 : body1;

            // Add this body's momentum into the body it is colliding into.
            largerBody.velocityProperty.value = largerBody.velocityProperty.value.plus( smallerBody.velocityProperty.value.times( smallerBody.massProperty.value / largerBody.massProperty.value ) );

            smallerBody.collidedEmitter.emit();
            smallerBody.isActiveProperty.value = false;

            hadCollision = true;
          }
        }
      }
    }
  }

  public override reset(): void {
    this.updateForces();
  }

  /**
   * Updates the position of the bodies using the PEFRL algorithm.
   */
  public override run( dt: number, notifyPropertyListeners = true ): void {
    const iterationCount = 4000 / this.bodies.length; // 4000 is an arbitrary number of iterations that worked well
    const N = this.bodies.length;
    dt /= iterationCount;

    const masses = this.bodies.map( body => body.massProperty.value );
    const positions = this.bodies.map( body => body.positionProperty.value.copy() );
    const velocities = this.bodies.map( body => body.velocityProperty.value.copy() );
    const accelerations = this.bodies.map( body => body.accelerationProperty.value.copy() );
    const gravityForces = this.bodies.map( body => body.gravityForceProperty.value.copy() );

    for ( let k = 0; k < iterationCount; k++ ) {

      // Zeroing out gravityForces
      for ( let i = 0; i < N; i++ ) {
        gravityForces[ i ].setXY( 0, 0 );
      }

      // Iterate between all the bodies to add the gravityForces
      for ( let i = 0; i < N; i++ ) {
        const mass1 = masses[ i ];
        for ( let j = i + 1; j < N; j++ ) {
          const mass2 = masses[ j ];

          const direction = scratchVector.set( positions[ j ] ).subtract( positions[ i ] );
          const distance = direction.magnitude;
          assert && assert( distance >= 0, 'Negative distances not allowed!!' );
          const gravityForceMagnitude = G * mass1 * mass2 * ( Math.pow( distance, -3 ) );
          const gravityForce = direction.multiplyScalar( gravityForceMagnitude );

          gravityForces[ i ].add( gravityForce );
          gravityForces[ j ].subtract( gravityForce );
        }
      }

      // Compute accelerations
      for ( let i = 0; i < N; i++ ) {
        accelerations[ i ].set( gravityForces[ i ] ).multiplyScalar( 1 / masses[ i ] );
      }

      // Position Extended Forest-Ruth Like algorithm (PEFRL) (Omelyan, Myrglod & Folk, 2001)

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

      // Here, depending on notifyPropertyListeners, we either set Property values, or mutate their values.
      // This is done to avoid notifying the Property change on every iteration, which is expensive.
      // In SolarSystemCommonModel stepOnce, notifyPropertyListeners is true only on the last call to engine.run().
      if ( notifyPropertyListeners ) {
        body.positionProperty.value = positions[ i ];
        body.velocityProperty.value = velocities[ i ];
        body.accelerationProperty.value = accelerations[ i ];
        body.gravityForceProperty.value = gravityForces[ i ];
      }
      else {
        // mutate Vector2 values!
        body.positionProperty.value.set( positions[ i ] );
        body.velocityProperty.value.set( velocities[ i ] );
        body.accelerationProperty.value.set( accelerations[ i ] );
        body.gravityForceProperty.value.set( gravityForces[ i ] );
      }
    }
  }

  /**
   * Resets the gravityForces and accelerations of all the bodies to zero.
   * Then, it calculates the gravitational gravityForces between the bodies based on the Newtonian Law of Universal Gravitation.
   * The gravityForces and accelerations are then set on the bodies.
   */
  private updateForces(): void {
    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body = this.bodies[ i ];
      body.accelerationProperty.value = new Vector2( 0, 0 );
      body.gravityForceProperty.value = new Vector2( 0, 0 );
    }

    // Iterate between all the bodies to add the accelerations
    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body1 = this.bodies[ i ];
      const mass1 = body1.massProperty.value;
      for ( let j = i + 1; j < this.bodies.length; j++ ) {
        const body2 = this.bodies[ j ];
        const mass2 = body2.massProperty.value;
        assert && assert( mass2 > 0, 'mass2 should not be 0' );

        const gravityForce: Vector2 = this.getGravityForce( body1, body2 );
        body1.gravityForceProperty.value = body1.gravityForceProperty.value.plus( gravityForce );
        body2.gravityForceProperty.value = body2.gravityForceProperty.value.minus( gravityForce );
        body1.accelerationProperty.value = body1.gravityForceProperty.value.times( 1 / mass1 );
        body2.accelerationProperty.value = body2.gravityForceProperty.value.times( 1 / mass2 );
      }
    }
  }

  /**
   * Calculate the force on body1 because of body2
   */
  private getGravityForce( body1: Body, body2: Body ): Vector2 {
    const direction: Vector2 = body2.positionProperty.value.minus( body1.positionProperty.value );
    const distance = direction.magnitude;
    if ( distance === 0 ) {
      // Avoid breaking the sim when d=0. There are other safeguards that prevent this from happening, but this is a last resort.
      return new Vector2( 0, 0 );
    }
    assert && assert( distance > 0, 'Negative distances not allowed!!' );
    const gravityForceMagnitude = G * body1.massProperty.value * body2.massProperty.value * ( Math.pow( distance, -3 ) );
    return direction.times( gravityForceMagnitude );
  }
}

mySolarSystem.register( 'NumericalEngine', NumericalEngine );