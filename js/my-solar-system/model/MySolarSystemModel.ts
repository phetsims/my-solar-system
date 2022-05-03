// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../../common/model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';

const timeFormatter = new Map<TimeSpeed, number>( [
  [ TimeSpeed.FAST, 7 / 4 ],
  [ TimeSpeed.NORMAL, 1 ],
  [ TimeSpeed.SLOW, 1 / 4 ]
] );

const scratchVector = new Vector2( 0, 0 );

class MySolarSystemModel {
  G: number;
  Nbodies: number;
  bodies: ObservableArray<Body>;
  isPlayingProperty: BooleanProperty;
  timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  pathVisibleProperty: BooleanProperty;
  gridVisibleProperty: BooleanProperty;
  centerOfMassVisibleProperty: BooleanProperty;
  gravityVisibleProperty: BooleanProperty;
  velocityVisibleProperty: BooleanProperty;


  constructor( tandem: Tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    this.G = 1000;
    this.bodies = createObservableArray();
    this.Nbodies = 50;

    this.repopulateBodies();

    this.isPlayingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: `This value is true if the play/pause button on this screen is in play mode. (It remains true even if the user switches screens. Use in combination with '${phet.joist.sim.screenProperty.tandem.phetioID}'.)`
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: tandem.createTandem( 'timeSpeedProperty' )
    } );

    this.pathVisibleProperty = new BooleanProperty( false );
    this.gridVisibleProperty = new BooleanProperty( false );
    this.centerOfMassVisibleProperty = new BooleanProperty( false );
    this.gravityVisibleProperty = new BooleanProperty( false );
    this.velocityVisibleProperty = new BooleanProperty( false );
  }

  repopulateBodies(): void {
    this.bodies.clear();
    for ( let i = 0; i < this.Nbodies; i++ ) {
      // Populate the bodies array with random spheres
      this.bodies.push( new Body(
        10 + 30 * dotRandom.nextDouble(), // Assign a random initial Mass to the bodies
        new Vector2( 500 * dotRandom.nextDouble(), 500 * dotRandom.nextDouble() ), // Create the bodies in random positions for now
        new Vector2( 10 * ( 0.5 - dotRandom.nextDouble() ), 10 * ( 0.5 - dotRandom.nextDouble() ) ) // Assign them random velocities
      ) );
    }
  }

  restart(): void {
    this.repopulateBodies();
  }

  stepForward(): void {
    this.run( 1 / 30 );
  }

  /**
   * Resets the model.
   */
  reset(): void {
    //TODO
  }

  step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      this.run( dt );
    }
  }

  run( dt: number ): void {
    this.resetAccelerations();
    this.applyForces();
    this.verlet( dt * timeFormatter.get( this.timeSpeedProperty.value )! );
  }

  resetAccelerations(): void {
    for ( let i = 0; i < this.Nbodies; i++ ) {
      this.bodies[ i ].accelerationProperty.value = Vector2.ZERO;
    }
  }

  applyForces(): void {
    // Iterate between all the bodies to add the accelerations
    for ( let i = 0; i < this.Nbodies; i++ ) {
      for ( let j = i + 1; j < this.Nbodies; j++ ) {
        // J: Is it okay to variables for body1 and body2??
        const body1 = this.bodies[ i ];
        const body2 = this.bodies[ j ];
        const mass1: number = body1.massProperty.value;
        const mass2: number = body2.massProperty.value;
        const force: Vector2 = this.getForce( body1, body2 );
        body1.accelerationProperty.value = body1.accelerationProperty.value.plus( scratchVector.set( force ).multiply( 1 / mass1 ) );
        body2.accelerationProperty.value = body2.accelerationProperty.value.plus( scratchVector.set( force ).multiply( -1 / mass2 ) );
      }
    }
  }

  /**
   * Calculate the force on body1 because of body2
   */
  getForce( body1: Body, body2: Body ): Vector2 {
    const direction: Vector2 = body2.positionProperty.value.minus( body1.positionProperty.value );
    const distance: number = direction.magnitude;
    const forceMagnitude: number = this.G * body1.massProperty.value * body2.massProperty.value * ( Math.pow( distance, -3 ) );
    const force: Vector2 = direction.times( forceMagnitude );
    return force;
  }

  /**
   * Modify the positionProperty and velocityProperty of all bodies based on the Verlet's algorithm
        x(t+dt) = x(t) + v(t)dt + 0.5a(t)*dt^2
        v(t+dt) = v(t) + 0.5*dt*(a(t+dt) + a(t))
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

mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );
export default MySolarSystemModel;