// Copyright 2021-2022, University of Colorado Boulder

/**
 * Model for a gravitational interacting Body
 *
 * @author Agustín Vallejo
 */

import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import mySolarSystem from '../../mySolarSystem.js';
import { MAX_PATH_LENGTH } from '../view/PathsWebGLNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Color } from '../../../../scenery/js/imports.js';


class Body {
  // Unitless body quantities.
  public readonly massProperty;
  public readonly radiusProperty;
  public readonly positionProperty;
  public readonly velocityProperty;
  public readonly accelerationProperty;
  public readonly forceProperty;

  // Collision handling
  public readonly isCollidedProperty = new BooleanProperty( false );
  public readonly valueVisibleProperty = new BooleanProperty( false );

  // Array of points for drawing the path
  public readonly pathPoints: ObservableArray<Vector2>;

  public readonly colorProperty: TReadOnlyProperty<Color>;

  // Path constants
  public pathDistance = 0;
  public pathLengthLimit = MAX_PATH_LENGTH;
  public pathDistanceLimit = 1000; // REVIEW: pathDistanceLimit seems like a constant (never changes). If so, it should be a constant.
  public stepCounter = 0; // Counting steps to only add points on multiples of wholeStepSize
  public wholeStepSize = 10;

  public constructor( initialMass: number, initialPosition: Vector2, initialVelocity: Vector2, color: TReadOnlyProperty<Color> ) {
    // Physical properties of the body
    this.massProperty = new NumberProperty( initialMass );
    this.radiusProperty = new NumberProperty( 1 );
    this.positionProperty = new Vector2Property( initialPosition );
    this.velocityProperty = new Vector2Property( initialVelocity );
    this.accelerationProperty = new Vector2Property( Vector2.ZERO );
    this.forceProperty = new Vector2Property( Vector2.ZERO );
    this.colorProperty = color;

    this.massProperty.link( mass => {
      // Mass to radius function
      this.radiusProperty.set( Math.pow( mass, 1 / 3 ) + 5 );
    } );

    // Data for rendering the path as a WebGL object
    this.pathPoints = createObservableArray();
    // Adding first point twice for the WebGL Path
    this.addPathPoint();
    this.addPathPoint();
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
    const pathPoint = this.positionProperty.value;

    // Only add or remove points if the body is effectively moving
    if ( pathPoint !== this.pathPoints[ this.pathPoints.length - 1 ] ) {
      this.pathPoints.push( pathPoint );

      // Add the length to the tracked path length
      if ( this.pathPoints.length > 2 ) {
        this.pathDistance += pathPoint.minus( this.pathPoints[ this.pathPoints.length - 2 ] ).magnitude;
      }
      // Remove points from the path as the path gets too long
      while ( this.pathDistance > this.pathDistanceLimit || this.pathPoints.length > this.pathLengthLimit ) {
        this.pathDistance -= this.pathPoints[ 1 ].minus( this.pathPoints[ 0 ] ).magnitude;
        this.pathPoints.shift();
      }

    }
  }

  /**
   * Clear the whole path of points tracking the body's trajectory.
   */
  public clearPath(): void {
    this.pathPoints.clear();
    this.pathDistance = 0;
  }
}

mySolarSystem.register( 'Body', Body );
export default Body;