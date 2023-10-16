// Copyright 2023, University of Colorado Boulder

/**
 * LabVisibleProperties extends from MySolarSystemVisibleProperties and contains visibleProperty instances for lab screen elements.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import MySolarSystemVisibleProperties from '../../common/view/MySolarSystemVisibleProperties.js';

export default class LabVisibleProperties extends MySolarSystemVisibleProperties {

  // Indicates if the data panel is going to show all the numerical values of mass, position and velocity
  public override readonly moreDataVisibleProperty: BooleanProperty;

  public constructor( tandem: Tandem ) {
    super( tandem );

    this.moreDataVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'moreDataVisibleProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.centerOfMassVisibleProperty.reset();
    this.moreDataVisibleProperty.reset();
  }
}

mySolarSystem.register( 'LabVisibleProperties', LabVisibleProperties );