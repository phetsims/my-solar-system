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
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = {
  isLab?: boolean; // whether the model is for the 'Lab' screen
  numberOfActiveBodiesPropertyPhetioReadOnly?: boolean; // phetioReadOnly value for numberOfActiveBodiesProperty
};
type ParentOptions = SolarSystemCommonModelOptions;
export type MySolarSystemModelOptions = SelfOptions & StrictOmit<ParentOptions, 'zoomLevelRange' | 'engineTimeScale'>;

export default class MySolarSystemModel extends SolarSystemCommonModel {

  // The set of Body instances in this.bodies that are active (body.isActive === true)
  public readonly activeBodies: ObservableArray<Body>;

  // The number of Bodies that are 'active', and thus visible on the screen.
  public readonly numberOfActiveBodiesProperty: NumberProperty;

  // This is abstract in the base class, so make it concrete here.
  public readonly engine: NumericalEngine;

  // abstract in SolarSystemCommonModel
  public readonly zoomScaleProperty: TReadOnlyProperty<number>;

  public readonly centerOfMass: CenterOfMass;

  // is centerOfMass moving?
  public readonly followingCenterOfMassProperty: TReadOnlyProperty<boolean>;

  // whether the model is for the 'Lab' screen
  public readonly isLab: boolean;

  // Determines if we are showing paths and will therefore need to add points to each body's path.
  // This does not need to be stateful because it will be set correctly when pathVisibleProperty is set.
  public addingPathPoints = false;

  // Indicates whether any Body has gone off-screen or has collided an exploded.
  // This controls the visibility of the 'Return Bodies' button in the view.
  public readonly bodiesAreReturnableProperty: TReadOnlyProperty<boolean>;

  // Indicates whether any Body has collided with another Body.
  public readonly isAnyBodyCollidedProperty: Property<boolean>;

  public constructor( providedOptions: MySolarSystemModelOptions ) {

    const options = optionize<MySolarSystemModelOptions, SelfOptions, ParentOptions>()( {

      // SelfOptions
      isLab: false,
      numberOfActiveBodiesPropertyPhetioReadOnly: true,

      // SolarSystemCommonModelOptions
      engineTimeScale: 0.05, // This value works well for NumericalEngine
      zoomLevelRange: new RangeWithValue( 1, 6, 4 )
    }, providedOptions );

    super( options );

    this.activeBodies = createObservableArray( {
      tandem: options.tandem.createTandem( 'activeBodies' ),
      phetioType: createObservableArray.ObservableArrayIO( Body.BodyIO ),
      phetioReadOnly: true,
      phetioDocumentation: 'The set of bodies that part of the selected orbital system, and are thus visible on the screen.'
    } );

    // We want to synchronize bodies and activeBodies, so that activeBodies is effectively bodies.filter( isActive )
    // Order matters, AND we don't want to remove items unnecessarily, so some additional logic is required.
    Multilink.multilinkAny( this.bodies.map( body => body.isActiveProperty ), () => {
      const idealBodies = this.bodies.filter( body => body.isActiveProperty.value );

      // Remove all inactive bodies
      this.activeBodies.filter( body => !body.isActiveProperty.value ).forEach( body => {
        this.activeBodies.remove( body );
        body.reset();
      } );

      // Add in active bodies (in order)
      for ( let i = 0; i < idealBodies.length; i++ ) {
        if ( this.activeBodies[ i ] !== idealBodies[ i ] ) {
          this.activeBodies.splice( i, 0, idealBodies[ i ] );
        }
      }
    } );

    this.numberOfActiveBodiesProperty = new NumberProperty( this.activeBodies.length, {
      numberType: 'Integer',
      range: new Range( 1, this.bodies.length ),
      tandem: options.tandem.createTandem( 'numberOfActiveBodiesProperty' ),
      phetioReadOnly: options.numberOfActiveBodiesPropertyPhetioReadOnly,
      phetioFeatured: !options.numberOfActiveBodiesPropertyPhetioReadOnly, // featured if it's not readonly
      phetioDocumentation: 'The number of bodies that are present in the orbital system shown on the screen'
    } );

    this.engine = new NumericalEngine( this.activeBodies );
    this.engine.reset();

    this.isAnyBodyCollidedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isAnyBodyCollidedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'True if any of the bodies have collided.'
    } );

    this.bodiesAreReturnableProperty = DerivedProperty.or( [ ...this.bodies.map( body => body.isOffscreenProperty ), this.isAnyBodyCollidedProperty ] );

    this.bodies.forEach( body => {
      body.collidedEmitter.addListener( () => {
        this.isAnyBodyCollidedProperty.value = true;
      } );

      Multilink.lazyMultilink(
        [ body.userIsControllingPositionProperty, body.userIsControllingVelocityProperty, body.userIsControllingMassProperty ],
        ( userIsControllingPosition: boolean, userIsControllingVelocity: boolean, userIsControllingMass: boolean ) => {
          // It's OK to keep playing when the user is changing mass.
          if ( userIsControllingPosition || userIsControllingVelocity ) {
            this.isPlayingProperty.value = false;
          }

          if ( userIsControllingPosition || userIsControllingVelocity || userIsControllingMass ) {
            // The user has started changing one or more of the body Properties.
            this.userInteractingEmitter.emit();
          }
          else if ( !this.bodiesAreReturnableProperty.value ) {
            // The user has finished changing one or more of the body Properties, and the 'Return Bodies' button
            // is not visible.
            this.saveStartingBodyInfo();
          }
        } );
    } );

    this.timeProperty.lazyLink( time => {
      if ( time === 0 ) {
        this.clearPaths();
      }
    } );

    this.zoomScaleProperty = new DerivedProperty( [ this.zoomLevelProperty ], zoomLevel => {
      return Utils.linear( options.zoomLevelRange.min, options.zoomLevelRange.max, 25, 125, zoomLevel );
    } );

    this.isLab = options.isLab;

    this.centerOfMass = new CenterOfMass( this.activeBodies, options.tandem.createTandem( 'centerOfMass' ) );

    // The center of mass is being followed if it's position is less than 1 AU from the origin, or its speed is slower than 0.01 km/s.
    this.followingCenterOfMassProperty = new DerivedProperty(
      [ this.centerOfMass.positionProperty, this.centerOfMass.velocityProperty ],
      ( position, velocity ) => position.magnitude < 1 && velocity.magnitude < 0.01
    );

    // Since followingCenterOfMassProperty was a bit of a chronic problem, this debugging output was added
    // for https://github.com/phetsims/my-solar-system/issues/274.  It prints the values of the dependencies
    // listed above.
    phet.log && this.followingCenterOfMassProperty.link( followingCenterOfMass => {
      phet.log && phet.log( `followingCenterOfMass=${followingCenterOfMass} ` +
                            `position.magnitude=${this.centerOfMass.positionProperty.value.magnitude} ` +
                            `velocity.magnitude=${this.centerOfMass.velocityProperty.value.magnitude}` );
    } );
  }

  /**
   * Adds the next available body to the system and checks that is doesn't collide with any other bodies.
   */
  public addNextBody(): void {
    const newBody = this.bodies.find( body => !body.isActiveProperty.value );
    if ( newBody ) {
      newBody.reset();
      newBody.preventCollision( this.activeBodies );
      newBody.isActiveProperty.value = true;
    }
    this.saveStartingBodyInfo();
    this.isAnyBodyCollidedProperty.reset();
  }

  public removeLastBody(): void {
    const lastBody = this.activeBodies[ this.activeBodies.length - 1 ];
    lastBody.isActiveProperty.value = false;
    this.saveStartingBodyInfo();
    this.isAnyBodyCollidedProperty.reset();
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
    this.engine.update( this.activeBodies );
    this.numberOfActiveBodiesProperty.value = this.activeBodies.length;
    this.centerOfMass.update();
  }

  /**
   * Calls the restart method (revert system back to t=0) on the parent class, and based on the new position and velocity
   * of the CoM, updates the userHasInteractedProperty (If CoM is moving, it is implied the user has interacted with the sim)
   */
  public override restart(): void {
    super.restart();
    this.isAnyBodyCollidedProperty.reset();
    this.centerOfMass.update();
    this.hasPlayedProperty.value = false;
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

  public clearPaths(): void {
    this.activeBodies.forEach( body => body.clearPath() );
  }
}

mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );