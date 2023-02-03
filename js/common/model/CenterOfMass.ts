// Copyright 2022-2023, University of Colorado Boulder

/**
 * Logic for Center of Mass class.
 * It keeps track of the position of the Center of Mass of the system by
 * calculating the average position of all the bodies, weighted by their mass.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from './Body.js';

export default class CenterOfMass {
  public readonly positionProperty = new Vector2Property( Vector2.ZERO );
  public readonly velocityProperty = new Vector2Property( Vector2.ZERO );
  public readonly visibleProperty = new BooleanProperty( false );

  public constructor( public readonly bodies: ObservableArray<Body> ) {
    this.update();
  }

  /**
   * Calculates the total mass and the position of the Center of Mass.
   */
  public update(): void {
    const tempPosition = new Vector2( 0, 0 );
    const tempVelocity = new Vector2( 0, 0 );
    let totalMass = 0;

    //REVIEW: Is performance a concern for this? If not don't change, but the .forEach with closures can slow things
    //REVIEW: down. If performance is a concern, consider using a for loop instead.

    // Total Mass must be calculated before calculating the weighted mean position and velocity
    totalMass = _.sum( this.bodies.map( body => body.massProperty.value ) );

    this.bodies.forEach( body => {
      assert && assert( totalMass !== 0, 'Total mass should not go to 0' );
      tempPosition.add( body.positionProperty.value.times( body.massProperty.value / totalMass ) );
      tempVelocity.add( body.velocityProperty.value.times( body.massProperty.value / totalMass ) );
    } );
    this.positionProperty.value = tempPosition;
    this.velocityProperty.value = tempVelocity;
  }
}

mySolarSystem.register( 'CenterOfMass', CenterOfMass );