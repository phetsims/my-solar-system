// Copyright 2021-2022, University of Colorado Boulder

/**
 * Model for a gravitational interacting Body
 *
 * @author Agustín Vallejo
 */

import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Emitter from '../../../../axon/js/Emitter.js';
import IEmitter from '../../../../axon/js/IEmitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import mySolarSystem from '../../mySolarSystem.js';
import { MAX_PATH_LENGTH } from '../view/PathsWebGLNode.js';

class Body {
  // Unitless body quantities.
  public readonly massProperty: Property<number>;
  public readonly positionProperty: Property<Vector2>;
  public readonly velocityProperty: Property<Vector2>;
  public readonly accelerationProperty: Property<Vector2>;
  public readonly forceProperty: Property<Vector2>;

  // Emitters for various events
  public readonly userModifiedPositionEmitter: IEmitter;
  public readonly userModifiedVelocityEmitter: IEmitter;

  // Array of points for drawing the path
  public readonly path: ObservableArray<Vector2>;
  public pathDistance: number;
  public pathLengthLimit: number;
  public pathDistanceLimit: number;
  public stepCounter: number;
  public wholeStepSize: number;

  // Previous values for velocity Verlet algorithm
  public previousAcceleration: Vector2;
  public previousPosition: Vector2;

  public constructor( mass: number, position: Vector2, velocity: Vector2 ) {
    // Physical properties of the body
    this.massProperty = new Property<number>( mass );
    this.positionProperty = new Property<Vector2>( position );
    this.velocityProperty = new Property<Vector2>( velocity );
    this.accelerationProperty = new Property<Vector2>( Vector2.ZERO );
    this.forceProperty = new Property<Vector2>( Vector2.ZERO );
    this.previousAcceleration = this.accelerationProperty.value; // Previous acceleration for velocity Verlet algorithm
    this.previousPosition = this.positionProperty.value; // Previous acceleration for velocity Verlet algorithm

    // Emitters for dragging the body and velocity vector
    this.userModifiedPositionEmitter = new Emitter();
    this.userModifiedVelocityEmitter = new Emitter();

    // Data for rendering the path as a WebGL object
    this.path = createObservableArray();
    // Adding first point twice for the WebGL Path
    this.addPathPoint();
    this.addPathPoint();
    //REVIEW: consider moving simple initialization to declarations
    this.pathDistance = 0;
    this.pathLengthLimit = MAX_PATH_LENGTH; // TODO: Is importing constants like this ok???
    this.pathDistanceLimit = 1000;
    this.stepCounter = 0; // Counting steps to only add points on multiples of wholeStepSize
    this.wholeStepSize = 10;
  }

  public reset(): void {
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
  public addPathPoint(): void {
    const pathPoint = this.positionProperty.get();
    this.path.push( pathPoint );

    // add the length to the tracked path length
    if ( this.path.length > 2 ) {
      const difference = this.path[ this.path.length - 1 ].minus( this.path[ this.path.length - 2 ] );
      const addedMagnitude = difference.magnitude;

      this.pathDistance += addedMagnitude;
    }

    // remove points from the path as the path gets too long
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
  public clearPath(): void {
    this.path.clear();
    this.pathDistance = 0;
  }
}

mySolarSystem.register( 'Body', Body );
export default Body;