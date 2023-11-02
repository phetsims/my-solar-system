// Copyright 2023, University of Colorado Boulder

/**
 * Main model for My Solar System sim.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonModel, { SolarSystemCommonModelOptions } from '../../../../solar-system-common/js/model/SolarSystemCommonModel.js';
import NumericalEngine from '../../common/model/NumericalEngine.js';
import CenterOfMass from './CenterOfMass.js';
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
export type MySolarSystemModelOptions = SelfOptions & StrictOmit<ParentOptions, 'engineFactory' | 'zoomLevelRange' | 'engineTimeScale'>;

export default class MySolarSystemModel extends SolarSystemCommonModel<NumericalEngine> {

  // abstract in SolarSystemCommonModel
  public readonly zoomScaleProperty: TReadOnlyProperty<number>;

  // is CoM moving?
  public readonly followingCenterOfMassProperty: TReadOnlyProperty<boolean>;

  public readonly isLab: boolean;
  public readonly centerOfMass: CenterOfMass;

  public constructor( providedOptions: MySolarSystemModelOptions ) {

    const options = optionize<MySolarSystemModelOptions, SelfOptions, ParentOptions>()( {

      // SelfOptions
      isLab: false,

      // SolarSystemCommonModelOptions
      engineFactory: bodies => new NumericalEngine( bodies ),
      engineTimeScale: 0.05, // This value works well for NumericalEngine
      zoomLevelRange: new RangeWithValue( 1, 6, 4 )
    }, providedOptions );

    super( options );

    this.zoomScaleProperty = new DerivedProperty( [ this.zoomLevelProperty ], zoomLevel => {
      return Utils.linear( options.zoomLevelRange.min, options.zoomLevelRange.max, 25, 125, zoomLevel );
    } );

    this.isLab = options.isLab;

    this.centerOfMass = new CenterOfMass( this.activeBodies, options.tandem.createTandem( 'centerOfMass' ) );

    this.followingCenterOfMassProperty = new DerivedProperty(
      [ this.centerOfMass.positionProperty, this.centerOfMass.velocityProperty ],
      // we consider the 
      ( position, velocity ) => position.magnitude < 1 && velocity.magnitude < 0.01
    );
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

  // Calls the update method on the parent class and updates the position and velocity of the CoM
  public override update(): void {
    super.update();
    this.centerOfMass.update();
  }

  /**
   * Calls the restart method (revert system back to t=0) on the parent class, and based on the new position and velocity
   * of the CoM, updates the userHasInteractedProperty (If CoM is moving, it is implied the user has interacted with the sim)
   */
  public override restart(): void {
    super.restart();

    this.centerOfMass.update();
  }

  public override stepOnce( dt: number ): void {
    // Scaling dt according to the speeds of the sim
    dt *= this.timeSpeedMap.get( this.timeSpeedProperty.value )!;

    // Dividing dt into smaller values per step to avoid large jumps in the sim
    const desiredStepsPerSecond = 300;
    const numberOfSteps = Math.ceil( dt * desiredStepsPerSecond );
    dt /= numberOfSteps;

    // Scaling dt to the engine time
    dt *= this.engineTimeScale;

    for ( let i = 0; i < numberOfSteps; i++ ) {
      // Only notify Body Property listeners on the last step, as a performance optimization.
      const notifyPropertyListeners = ( i === numberOfSteps - 1 );
      this.engine.run( dt, notifyPropertyListeners );
      this.engine.checkCollisions();
      this.timeProperty.value += dt * this.modelToViewTime;
      if ( this.addingPathPoints ) {
        this.activeBodies.forEach( body => body.addPathPoint() );
      }
    }
  }
}

mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );