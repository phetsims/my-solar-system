// Copyright 2021-2022, University of Colorado Boulder

/**
 * Model for a gravitational interacting Body
 *
 * @author Agustín Vallejo
 */

import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
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

  // Emitters for various events
  readonly userModifiedPositionEmitter: Emitter;
  readonly userModifiedVelocityEmitter: Emitter;

  // Array of points for drawing the path
  readonly path: ObservableArray<Vector2>;
  pathDistance: number;
  pathLengthLimit: number;
  pathDistanceLimit: number;

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

    this.path = createObservableArray();
    this.pathDistance = 0;
    this.pathLengthLimit = 50;
    this.pathDistanceLimit = 50;
  }

  reset(): void {
    this.massProperty.reset();
    this.positionProperty.reset();
    this.velocityProperty.reset();
    this.accelerationProperty.reset();
    this.forceProperty.reset();
    this.clearPath();
    this.previousAcceleration = this.accelerationProperty.value; // Previous acceleration for velocity Verlet algorithm
    this.previousPosition = this.positionProperty.value;
  }

  /**
   * Add a point to the collection of points that follow the trajectory of a moving body.
   * This also removes points when the path gets too long.
   */
   addPathPoint(): void {
    const pathPoint = this.positionProperty.get();
    this.path.push( pathPoint );

    // add the length to the tracked path length
    if ( this.path.length > 2 ) {
      const difference = this.path[ this.path.length - 1 ].minus( this.path[ this.path.length - 2 ] );
      const addedMagnitude = difference.magnitude;

      this.pathDistance += addedMagnitude;
    }

    // remove points from the path as the path gets too long
    // if the path grows more than ~6000 points, start removing points
    while ( this.pathDistance > this.pathDistanceLimit || this.path.length > this.pathLengthLimit ) {
      const loss = this.path[ 1 ].minus( this.path[ 0 ] );
      const lossMagnitude = loss.magnitude;

      this.path.shift();

      this.pathDistance -= lossMagnitude;
    }
  }

    /**
     * Clear the whole path of points tracking the body's trajectory.
     */
    clearPath(): void {
    this.path.clear();
    this.pathDistance = 0;
    }
}

mySolarSystem.register( 'Body', Body );
export default Body;