// Copyright 2023, University of Colorado Boulder

/**
 * Main model for My Solar System sim.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonModel, { SolarSystemCommonModelOptions } from '../../../../solar-system-common/js/model/SolarSystemCommonModel.js';
import NumericalEngine from '../../common/model/NumericalEngine.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CenterOfMass from './CenterOfMass.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {
  isLab?: boolean; // whether the model is for the 'Lab' screen
};
type ParentOptions = SolarSystemCommonModelOptions<NumericalEngine>;
export type MySolarSystemModelOptions = SelfOptions & StrictOmit<ParentOptions, 'engineFactory' | 'zoomLevelRange'>;

export default class MySolarSystemModel extends SolarSystemCommonModel<NumericalEngine> {

  // abstract in SolarSystemCommonModel
  public readonly zoomScaleProperty: TReadOnlyProperty<number>;

  public readonly isLab: boolean;
  public readonly centerOfMass: CenterOfMass;

  //TODO https://github.com/phetsims/my-solar-system/issues/213 document
  //TODO https://github.com/phetsims/my-solar-system/issues/228 is systemCenteredProperty necessary? Should it be an Emitter?
  public readonly systemCenteredProperty: Property<boolean>;

  public constructor( providedOptions: MySolarSystemModelOptions ) {

    const options = optionize<MySolarSystemModelOptions, SelfOptions, ParentOptions>()( {

      // SelfOptions
      isLab: false,

      // SolarSystemCommonModelOptions
      engineFactory: bodies => new NumericalEngine( bodies ),
      zoomLevelRange: new RangeWithValue( 1, 6, 4 )
    }, providedOptions );

    super( options );

    this.zoomScaleProperty = new DerivedProperty( [ this.zoomLevelProperty ], zoomLevel => {
      return Utils.linear( options.zoomLevelRange.min, options.zoomLevelRange.max, 0.25, 1.25, zoomLevel );
    } );

    this.isLab = options.isLab;

    this.centerOfMass = new CenterOfMass( this.activeBodies, options.tandem.createTandem( 'centerOfMass' ) );

    this.systemCenteredProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'systemCenteredProperty' ),
      phetioReadOnly: true
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
    this.activeBodies.forEach( body => {
      body.clearPath();
      body.positionProperty.value = body.positionProperty.value.minus( centerOfMassPosition );
      body.velocityProperty.value = body.velocityProperty.value.minus( centerOfMassVelocity );
    } );
    if ( wasPlayingBefore ) {
      this.isPlayingProperty.value = true; // Resume the sim
    }
  }

  public followCenterOfMass(): void {
    this.centerOfMass.update();

    // Make the center of mass fixed, but not necessarily centered
    const centerOfMassVelocity = this.centerOfMass.velocityProperty.value;
    this.activeBodies.forEach( body => {
      body.velocityProperty.value = body.velocityProperty.value.minus( centerOfMassVelocity );
    } );

    // Update Center of Mass to avoid system's initial movement
    this.centerOfMass.update();
  }

  //TODO https://github.com/phetsims/my-solar-system/issues/213 document
  public override update(): void {
    super.update();
    this.centerOfMass.update();
  }

  //TODO https://github.com/phetsims/my-solar-system/issues/213 document
  public override restart(): void {
    super.restart();

    this.centerOfMass.update();
    this.userControlledProperty.value = this.centerOfMass.velocityProperty.value.magnitude > 0;
    this.systemCenteredProperty.value = this.userControlledProperty.value;
  }

  public override reset(): void {
    super.reset();
    this.userControlledProperty.reset();
  }
}

mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );