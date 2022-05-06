// Copyright 2021-2022, University of Colorado Boulder

/**
 * Model for a gravitational interacting Body
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import mySolarSystem from '../../mySolarSystem.js';

class Body {
  //REVIEW: Fields which are not reassigned should be marked `readonly` according to our TypeScript conventions.
  //REVIEW: That includes every field currently in this file.

  //REVIEW: Generally we don't want to expose a large amount of the API, so our code guidelines state that we should
  //REVIEW: type things slightly differently here in the fields. So while the concrete type of massProperty will be
  //REVIEW: NumberProperty, we would type it as `Property<number>` because clients (it's public) should only use that
  //REVIEW: restricted API. Similarly `Property<Vector2>`

  //REVIEW: Usually documenting that these are somewhat unitless (or what units they would have in the general case
  //REVIEW: would be helpful)
  massProperty: NumberProperty;
  positionProperty: Vector2Property;
  velocityProperty: Vector2Property;
  accelerationProperty: Vector2Property;
  //REVIEW: Usually we put these comments on a line in front of the field declaration, with an empty line before that
  //REVIEW: (unless it applies to multiple lines)
  previousAcceleration: Vector2; // Previous acceleration for velocity Verlet algorithm
  previousPosition: Vector2; // Previous position for velocity Verlet algorithm
  // Not a property because it is only used for the Verlet in the Model

  constructor( mass: number, position: Vector2, velocity: Vector2 ) {
    this.massProperty = new NumberProperty( mass );
    this.positionProperty = new Vector2Property( position );
    this.velocityProperty = new Vector2Property( velocity );
    this.accelerationProperty = new Vector2Property( new Vector2( 0, 0 ) ); //REVIEW: Can usually use Vector2.ZERO
    this.previousAcceleration = this.accelerationProperty.value; // Previous acceleration for velocity Verlet algorithm
    this.previousPosition = this.positionProperty.value; // Previous acceleration for velocity Verlet algorithm
  }
}

mySolarSystem.register( 'Body', Body );
export default Body;