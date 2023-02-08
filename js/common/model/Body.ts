// Copyright 2021-2023, University of Colorado Boulder

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
import TinyEmitter from '../../../../axon/js/TinyEmitter.js';
import Property from '../../../../axon/js/Property.js';
import MySolarSystemQueryParameters from '../MySolarSystemQueryParameters.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { BodyInfo } from './CommonModel.js';


class Body {
  // Unitless body quantities (physical properties)
  public readonly massProperty: Property<number>;
  public readonly radiusProperty: TReadOnlyProperty<number>;
  public readonly positionProperty: Property<Vector2>;
  public readonly velocityProperty: Property<Vector2>;
  public readonly accelerationProperty: Property<Vector2>;
  public readonly forceProperty: Property<Vector2>;

  // Collision handling
  public readonly collidedEmitter = new TinyEmitter();

  // Not resettable, common model will handle. Determines if the body is currently on-screen
  public readonly isActiveProperty = new BooleanProperty( false );

  // User modified properties
  public readonly userControlledPositionProperty = new BooleanProperty( false );
  public readonly userControlledVelocityProperty = new BooleanProperty( false );
  public readonly userControlledMassProperty = new BooleanProperty( false );
  public readonly movedProperty = new BooleanProperty( false );

  // Array of points for drawing the path
  public readonly pathPoints: ObservableArray<Vector2>;

  public readonly colorProperty: TReadOnlyProperty<Color>;

  private pathDistance = 0;

  public constructor( initialMass: number, initialPosition: Vector2, initialVelocity: Vector2, colorProperty: TReadOnlyProperty<Color> ) {
    this.massProperty = new NumberProperty( initialMass );
    this.radiusProperty = new NumberProperty( 1 );
    this.positionProperty = new Vector2Property( initialPosition );
    this.velocityProperty = new Vector2Property( initialVelocity );
    this.accelerationProperty = new Vector2Property( Vector2.ZERO );
    this.forceProperty = new Vector2Property( Vector2.ZERO );
    this.colorProperty = colorProperty;

    this.radiusProperty = new DerivedProperty( [ this.massProperty ], mass => Body.massToRadius( mass ) );

    // Data for rendering the path as a WebGL object
    this.pathPoints = createObservableArray();

    this.positionProperty.lazyLink( () => {
      this.movedProperty.value = true;
    } );
  }

  public reset(): void {
    this.massProperty.reset();
    this.positionProperty.reset();
    this.velocityProperty.reset();
    this.accelerationProperty.reset();
    this.forceProperty.reset();
    this.movedProperty.reset();
    this.clearPath();
  }

  /**
   * Add a point to the collection of points that follow the trajectory of a moving body.
   * This also removes points when the path gets too long.
   */
  public addPathPoint(): void {
    const pathPoint = this.positionProperty.value;

    // Only add or remove points if the body is effectively moving
    //REVIEW: Are we always guaranteed pathPoints? It seems easier to have a conditional here if there IS another pathPoint
    //REVIEW: ACTUALLY, that should be added, AND we should probably not be doing an instance equality check.
    //REVIEW: new Vector2( 0, 0 ) !== new Vector2( 0, 0 ) is true, so this guard does not do much at all to help us
    //REVIEW: use .equals() instead.
    if ( pathPoint !== this.pathPoints[ this.pathPoints.length - 1 ] ) {
      this.pathPoints.push( pathPoint );

      // Add the length to the tracked path length
      //REVIEW: Shouldn't this be >= 2? Does this omit the distance of the first two points?
      if ( this.pathPoints.length > 2 ) {
        this.pathDistance += pathPoint.distance( this.pathPoints[ this.pathPoints.length - 2 ] );
      }

      // Remove points from the path as the path gets too long
      while ( this.pathDistance > 2000 || this.pathPoints.length > MAX_PATH_LENGTH * ( MySolarSystemQueryParameters.pathRenderer === 'canvas' ? 10 : 1 ) ) {
        this.pathDistance -= this.pathPoints[ 1 ].distance( this.pathPoints[ 0 ] );
        this.pathPoints.shift();
      }

    }
  }

  public get info(): BodyInfo {
    return {
      mass: this.massProperty.value,
      position: this.positionProperty.value,
      velocity: this.velocityProperty.value,
      active: this.isActiveProperty.value
    };
  }

  public isOverlapping( otherBody: Body ): boolean {
    const distance = this.positionProperty.value.distance( otherBody.positionProperty.value );
    const radiusSum = this.radiusProperty.value + otherBody.radiusProperty.value;
    return distance < radiusSum;
  }

  public preventCollision( bodies: Body[] ): void {
    bodies.forEach( body => {
      if ( body !== this && this.isOverlapping( body ) ) {
        // If it's going to collide, arbitrarily move it 100 pixels up
        this.positionProperty.value = this.positionProperty.value.plus( new Vector2( 0, 100 ) );
        this.preventCollision( bodies );
      }
    } );
  }

  /**
   * Clear the whole path of points tracking the body's trajectory.
   */
  public clearPath(): void {
    this.pathPoints.clear();
    this.pathDistance = 0;
  }

  public static massToRadius( mass: number ): number {
    return mass > 0.1 ? 2.3 * Math.pow( mass, 1 / 3 ) + 1.7 : 3;
  }
}

mySolarSystem.register( 'Body', Body );
export default Body;