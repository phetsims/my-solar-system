// Copyright 2021-2022, University of Colorado Boulder

/**
 * Model for a gravitational interacting Body
 *
 * @author Agustín Vallejo
 */

import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Emitter from '../../../../axon/js/Emitter.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import mySolarSystem from '../../mySolarSystem.js';
import { MAX_PATH_LENGTH } from '../view/PathsWebGLNode.js';


class Body {
  // Unitless body quantities.
  public readonly massProperty;
  public readonly radiusProperty;
  public readonly positionProperty;
  public readonly velocityProperty;
  public readonly accelerationProperty;
  public readonly forceProperty;

  // Collision handling
  public readonly isCollidedProperty = new Property<boolean>( false );

  // Emitters for various events
  //REVIEW: This first emitter isn't emitted or listened to! Can it be removed?
  public readonly userModifiedPositionEmitter: TEmitter;
  //REVIEW: This second emitter isn't listened to! Can it be removed?
  public readonly userModifiedVelocityEmitter: TEmitter;

  // Array of points for drawing the path
  //REVIEW: Naming this something like pathPoints would be more clear (hard to tell the type from the name, especially
  //REVIEW: when seeing `this.path = createObservableArray();` below)
  public readonly path: ObservableArray<Vector2>;

  public pathDistance: number;
  public pathLengthLimit: number;
  public pathDistanceLimit: number; // REVIEW: pathDistanceLimit seems like a constant (never changes). If so, it should be a constant.
  public stepCounter: number;
  public wholeStepSize: number;

  //REVIEW: Usually I recommend naming initial values something like `initialPosition` or `initialVelocity` since they
  //REVIEW: will be updated later
  public constructor( mass: number, position: Vector2, velocity: Vector2 ) {
    // Physical properties of the body
    //REVIEW: Lots of these type parameters can be inferred, I'd generally recommend not providing them
    this.massProperty = new Property<number>( mass );
    this.radiusProperty = new Property<number>( 1 );
    this.positionProperty = new Property<Vector2>( position );
    this.velocityProperty = new Property<Vector2>( velocity );
    this.accelerationProperty = new Property<Vector2>( Vector2.ZERO );
    this.forceProperty = new Property<Vector2>( Vector2.ZERO );

    this.massProperty.link( mass => {
      // Mass to radius function
      this.radiusProperty.set( 2 * Math.pow( mass, 1 / 3 ) + 5 );
    } );

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
    this.pathLengthLimit = MAX_PATH_LENGTH;
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
    this.isCollidedProperty.reset();
    this.clearPath();
  }

  /**
   * Add a point to the collection of points that follow the trajectory of a moving body.
   * This also removes points when the path gets too long.
   */
  public addPathPoint(): void {
    //REVIEW: prefer this.positionProperty.value;
    //REVIEW: Also, presumably it would be good to no-op this if the position is the same as the last path point?
    //REVIEW: How is that being handled? Could potentially cause bugginess in the path shader.
    const pathPoint = this.positionProperty.get();
    this.path.push( pathPoint );

    // add the length to the tracked path length
    if ( this.path.length > 2 ) {
      //REVIEW: the first parameter to minus is just... pathPoint, is that easier to specify?
      const difference = this.path[ this.path.length - 1 ].minus( this.path[ this.path.length - 2 ] );
      //REVIEW: why a local variable here?
      const addedMagnitude = difference.magnitude;

      this.pathDistance += addedMagnitude;
    }

    // remove points from the path as the path gets too long
    while ( this.pathDistance > this.pathDistanceLimit || this.path.length > this.pathLengthLimit ) {
      const loss = this.path[ 1 ].minus( this.path[ 0 ] );
      //REVIEW: Why a local variable here?
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