// Copyright 2023-2024, University of Colorado Boulder

/**
 * MySolarSystemVisibleProperties contains visibleProperty instances for things in the view. These Properties are controlled
 * by checkboxes and toggle buttons.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import SolarSystemCommonVisibleProperties from '../../../../solar-system-common/js/view/SolarSystemCommonVisibleProperties.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';

export default class MySolarSystemVisibleProperties extends SolarSystemCommonVisibleProperties {

  // Indicates if the center of mass is visible.
  public readonly centerOfMassVisibleProperty: BooleanProperty;

  // Controls if the data panel shows all the numeric properties of the body
  public readonly moreDataVisibleProperty: BooleanProperty;

  // Whether to include more digits in the numeric properties section
  public readonly moreDigitsProperty: BooleanProperty;

  public constructor( isLab: boolean, tandem: Tandem ) {
    super( tandem );

    this.centerOfMassVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'centerOfMassVisibleProperty' ),
      phetioFeatured: true
    } );

    this.moreDataVisibleProperty = new BooleanProperty( false, {
      tandem: isLab ? tandem.createTandem( 'moreDataVisibleProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    this.moreDigitsProperty = new BooleanProperty( false, {
      tandem: isLab ? tandem.createTandem( 'moreDigitsProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );
  }

  public override reset(): void {
    super.reset();
    this.centerOfMassVisibleProperty.reset();
    this.moreDataVisibleProperty.reset();
  }
}

mySolarSystem.register( 'MySolarSystemVisibleProperties', MySolarSystemVisibleProperties );