// Copyright 2023, University of Colorado Boulder

/**
 * Main model for My Solar System sim.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import CommonModel, { BodyInfo, CommonModelOptions } from '../../../../solar-system-common/js/model/CommonModel.js';
import NumericalEngine from '../../common/model/NumericalEngine.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CenterOfMass from './CenterOfMass.js';

export type MySolarSystemModelOptions = CommonModelOptions<NumericalEngine>;

export default class MySolarSystemModel extends CommonModel<NumericalEngine> {
  public readonly systemCenteredProperty;
  public readonly centerOfMass: CenterOfMass;

  public constructor( providedOptions: MySolarSystemModelOptions ) {
    super( providedOptions );

    const tandem = providedOptions.tandem;

    this.centerOfMass = new CenterOfMass( this.bodies );
    this.followCenterOfMass();

    this.systemCenteredProperty = new BooleanProperty( false, { tandem: tandem.createTandem( 'systemCenteredProperty' ) } );

    // Re-center the bodies and set Center of Mass speed to 0 when the systemCentered option is selected
    this.systemCenteredProperty.link( systemCentered => {
      const wasPlayingBefore = this.isPlayingProperty.value;
      if ( systemCentered ) {
        this.isPlayingProperty.value = false; // Pause the sim
        this.centerOfMass.update();
        const centerOfMassPosition = this.centerOfMass.positionProperty.value;
        const centerOfMassVelocity = this.centerOfMass.velocityProperty.value;
        this.bodies.forEach( body => {
          body.clearPath();
          body.positionProperty.set( body.positionProperty.value.minus( centerOfMassPosition ) );
          body.velocityProperty.set( body.velocityProperty.value.minus( centerOfMassVelocity ) );
        } );
        this.saveStartingBodyState();
      }
      if ( wasPlayingBefore ) {
        this.isPlayingProperty.value = true; // Resume the sim
      }
    } );
  }

  public followCenterOfMass(): void {
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

    // If position or velocity of Center of Mass is different from 0, then the system is not centered
    if ( this.centerOfMass.positionProperty.value.magnitude > 0.01 || this.centerOfMass.velocityProperty.value.magnitude > 0.01 ) {
      this.systemCenteredProperty.value = false;
    }
  }

  public override loadBodyStates( bodiesInfo: BodyInfo[] ): void {
    super.loadBodyStates( bodiesInfo );
  }

  public override reset(): void {
    super.reset();
    this.centerOfMass.visibleProperty.reset();

    this.loadBodyStates( [
      { active: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -5 ) },
      { active: true, mass: 10, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 100 ) }
    ] );
  }
}

mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );