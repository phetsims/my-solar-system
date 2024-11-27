// Copyright 2023, University of Colorado Boulder

/**
 * Logic for Center of Mass class.
 * It keeps track of the position of the Center of Mass of the system by
 * calculating the average position of all the bodies, weighted by their mass.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import solarSystemCommon from '../../../../solar-system-common/js/solarSystemCommon.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class CenterOfMass extends PhetioObject {

  public readonly positionProperty: Property<Vector2>;
  public readonly velocityProperty: Property<Vector2>;

  public constructor( public readonly bodies: ObservableArray<Body>, tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false,
      phetioFeatured: true
    } );

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      units: 'AU',
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.velocityProperty = new Vector2Property( Vector2.ZERO, {
      units: 'km/s',
      tandem: tandem.createTandem( 'velocityProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.update();
  }

  /**
   * Calculates the total mass and the position of the Center of Mass.
   */
  public update(): void {

    // Calculate total mass first.
    let totalMass = 0;
    totalMass = _.sum( this.bodies.map( body => body.massProperty.value ) );
    assert && assert( totalMass !== 0, 'Total mass should not go to 0' );

    // Calculate the weighted mean position and velocity.
    const tempPosition = new Vector2( 0, 0 );
    const tempVelocity = new Vector2( 0, 0 );
    this.bodies.forEach( body => {
      tempPosition.add( body.positionProperty.value.times( body.massProperty.value / totalMass ) );
      tempVelocity.add( body.velocityProperty.value.times( body.massProperty.value / totalMass ) );
    } );

    // Only update the properties if the values have changed.
    if ( !this.positionProperty.value.equals( tempPosition ) ) {
      this.positionProperty.value = tempPosition;
    }
    if ( !this.velocityProperty.value.equals( tempVelocity ) ) {
      this.velocityProperty.value = tempVelocity;
    }
  }
}

solarSystemCommon.register( 'CenterOfMass', CenterOfMass );