// Copyright 2023, University of Colorado Boulder

/**
 * Main model for My Solar System sim.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonModel, { CommonModelOptions } from '../../../../solar-system-common/js/model/SolarSystemCommonModel.js';
import NumericalEngine from '../../common/model/NumericalEngine.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CenterOfMass from './CenterOfMass.js';

export type MySolarSystemModelOptions = CommonModelOptions<NumericalEngine>;

export default class MySolarSystemModel extends SolarSystemCommonModel<NumericalEngine> {
  public readonly systemCenteredProperty;
  public readonly centerOfMass: CenterOfMass;

  public constructor( providedOptions: MySolarSystemModelOptions ) {
    super( providedOptions );

    const tandem = providedOptions.tandem;

    this.systemCenteredProperty = new BooleanProperty( true, { tandem: tandem.createTandem( 'systemCenteredProperty' ) } );

    this.centerOfMass = new CenterOfMass( this.bodies );

    // Re-center the bodies and set Center of Mass speed to 0 when the systemCentered option is selected
    this.systemCenteredProperty.lazyLink( systemCentered => {
      if ( systemCentered ) {
        this.followAndCenterCenterOfMass();
      }
    } );

    this.userInteractingEmitter.addListener( () => {
      this.systemCenteredProperty.value = false;
    } );
  }

  // Calculates the position and velocity of the CoM and corrects the bodies position and velocities accordingly
  // After this, the CoM will be standing still and in the center of the sim.
  public followAndCenterCenterOfMass(): void {
    const wasPlayingBefore = this.isPlayingProperty.value;
    this.isPlayingProperty.value = false; // Pause the sim
    this.centerOfMass.update();
    const centerOfMassPosition = this.centerOfMass.positionProperty.value;
    const centerOfMassVelocity = this.centerOfMass.velocityProperty.value;
    this.bodies.forEach( body => {
      body.clearPath();
      body.positionProperty.set( body.positionProperty.value.minus( centerOfMassPosition ) );
      body.velocityProperty.set( body.velocityProperty.value.minus( centerOfMassVelocity ) );
    } );
    if ( wasPlayingBefore ) {
      this.isPlayingProperty.value = true; // Resume the sim
    }
  }

  public followCenterOfMass(): void {
    this.centerOfMass.update();

    // Make the center of mass fixed, but not necessarily centered
    const centerOfMassVelocity = this.centerOfMass.velocityProperty.value;
    this.bodies.forEach( body => {
      body.velocityProperty.set( body.velocityProperty.value.minus( centerOfMassVelocity ) );
    } );

    // Update Center of Mass to avoid system's initial movement
    this.centerOfMass.update();
  }

  public override update(): void {
    super.update();
    this.centerOfMass.update();
  }

  public override reset(): void {
    super.reset();
    this.centerOfMass.visibleProperty.reset();
  }
}

mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );