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
  //REVIEW: This visibleProperty doesn't look like it's reset properly (I realized the positionProperty is updated
  //REVIEW: on a reset() by the update() method in the model). Presumably add a reset method here, OR reset it from
  //REVIEW: the main model.
  public readonly visibleProperty: Property<boolean>;
  private readonly bodies: ObservableArray<Body>;
  private totalMass: number;

  public constructor( bodies: ObservableArray<Body> ) {
    this.bodies = bodies;
    this.totalMass = 0;
    this.positionProperty = new Property<Vector2>( Vector2.ZERO );
    this.visibleProperty = new Property<boolean>( false );
    this.updateCenterOfMassPosition();
  }

  /**
   * Calculates the total mass and the position of the Center of Mass.
   */
  public updateCenterOfMassPosition(): void {
    const centerOfMassPosition = new Vector2( 0, 0 );
    this.totalMass = 0;
    //REVIEW: Why two loops that are updating different things? Just have one loop update both?
    this.bodies.forEach( body => { this.totalMass += body.massProperty.value; } );
    this.bodies.forEach( body => {
      assert && assert( this.totalMass !== 0, 'Total mass should not go to 0' );
      centerOfMassPosition.add( body.positionProperty.value.times( body.massProperty.value / this.totalMass ) );
    } );
    this.positionProperty.value = centerOfMassPosition;
  }
}

mySolarSystem.register( 'CenterOfMass', CenterOfMass );