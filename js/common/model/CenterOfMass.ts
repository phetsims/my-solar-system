// Copyright 2022, University of Colorado Boulder

/**
 * Logic for Center of Mass class
 * 
 * @author Agustín Vallejo
 */

import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from './Body.js';

export default class CenterOfMass {
  public readonly positionProperty: Property<Vector2>;
  public readonly velocityProperty: Property<Vector2>;
  public readonly visibleProperty: Property<boolean>;
  private readonly bodies: ObservableArray<Body>;

  public constructor( bodies: ObservableArray<Body> ) {
    this.bodies = bodies;
    this.positionProperty = new Property<Vector2>( Vector2.ZERO );
    this.velocityProperty = new Property<Vector2>( Vector2.ZERO );
    this.visibleProperty = new Property<boolean>( false );
    this.updateCenterOfMassPosition();
  }

  /**
   * Calculates the total mass and the position of the Center of Mass.
   */
  public updateCenterOfMassPosition(): void {
    const tempPosition = new Vector2( 0, 0 );
    const tempVelocity = new Vector2( 0, 0 );
    let totalMass = 0;

    // Total Mass must be calculated before calculating the weighted mean position and velocity
    this.bodies.forEach( body => { totalMass += body.massProperty.value; } );

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