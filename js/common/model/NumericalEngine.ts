// Copyright 2022-2023, University of Colorado Boulder

/**
 * Logic that controls the gravitational interactions between bodies.
 *
 * The engine updates the position of the bodies on the run() function,
 * inside it uses a Position Extended Forest-Ruth Like algorithm (PEFRL) (Omelyan, Myrglod & Folk, 2001)
 *
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import Engine from '../../../../solar-system-common/js/model/Engine.js';

const scratchVector = new Vector2( 0, 0 );

// constants for PEFRL algorithm
const XI = 0.1786178958448091;
const LAMBDA = -0.2123418310626054;
const CHI = -0.06626458266981849;

// Gravitational constant
const G = 10000;

export default class NumericalEngine extends Engine {

  public constructor( bodies: ObservableArray<Body> ) {
    super( bodies );
  }

  public override update( bodies: ObservableArray<Body> ): void {

    // Reset the bodies array and recalculate total mass
    this.bodies = bodies;
    this.checkCollisions();
    this.updateForces();
  }

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

  public override run( dt: number, updateProperties = true ): void {
    const iterationCount = 400 / this.bodies.length;
    const N = this.bodies.length;
    dt /= iterationCount;

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
          assert && assert( distance >= 0, 'Negative distances not allowed!!' );
          const forceMagnitude = G * mass1 * mass2 * ( Math.pow( distance, -3 ) );
          const force = direction.multiplyScalar( forceMagnitude );

          forces[ i ].add( force );
          forces[ j ].subtract( force );
        }
      }

      // Compute accelerations
      for ( let i = 0; i < N; i++ ) {
        accelerations[ i ].set( forces[ i ] ).multiplyScalar( 1 / masses[ i ] );
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

      if ( updateProperties ) {
        body.positionProperty.value = positions[ i ];
        body.velocityProperty.value = velocities[ i ];
        body.accelerationProperty.value = accelerations[ i ];
        body.forceProperty.value = forces[ i ];
      }
      else {
        body.positionProperty.value.set( positions[ i ] );
        body.velocityProperty.value.set( velocities[ i ] );
        body.accelerationProperty.value.set( accelerations[ i ] );
        body.forceProperty.value.set( forces[ i ] );
      }
    }
  }

  private updateForces(): void {
    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body = this.bodies[ i ];
      body.accelerationProperty.value = new Vector2( 0, 0 );
      body.forceProperty.value = new Vector2( 0, 0 );
    }

    // Iterate between all the bodies to add the accelerations
    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body1 = this.bodies[ i ];
      const mass1 = body1.massProperty.value;
      for ( let j = i + 1; j < this.bodies.length; j++ ) {
        const body2 = this.bodies[ j ];
        const mass2 = body2.massProperty.value;
        assert && assert( mass2 > 0, 'mass2 should not be 0' );
        const force: Vector2 = this.getForce( body1, body2 );

        // REVIEW: Can this scratchVector be removed?
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
    const forceMagnitude = G * body1.massProperty.value * body2.massProperty.value * ( Math.pow( distance, -3 ) );
    return direction.times( forceMagnitude );
  }
}

mySolarSystem.register( 'NumericalEngine', NumericalEngine );