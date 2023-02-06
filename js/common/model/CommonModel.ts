// Copyright 2022-2023, University of Colorado Boulder

/**
 * Main model for My Solar System.
 * In charge of keeping track of the position and states of the bodies,
 * their center of mass, and the time.
 *
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from './Body.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Engine from './Engine.js';
import CenterOfMass from './CenterOfMass.js';
import Range from '../../../../dot/js/Range.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BodySoundManager from '../view/BodySoundManager.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import Emitter from '../../../../axon/js/Emitter.js';
import LabMode from './LabMode.js';

const timeFormatter = new Map<TimeSpeed, number>( [
  [ TimeSpeed.FAST, 7 / 4 ],
  [ TimeSpeed.NORMAL, 1 ],
  [ TimeSpeed.SLOW, 1 / 4 ]
] );

type SelfOptions<EngineType extends Engine> = {
  engineFactory: ( bodies: ObservableArray<Body> ) => EngineType;
  isLab: boolean;
  tandem: Tandem;
};

export type BodyInfo = {
  mass: number;
  position: Vector2;
  velocity: Vector2;
};

export type CommonModelOptions<EngineType extends Engine> = SelfOptions<EngineType>;

abstract class CommonModel<EngineType extends Engine = Engine> {

  // Bodies will consist of all bodies from availableBodies that have isActiveProperty.value === true, and will be in
  // order.
  public readonly bodies: ObservableArray<Body> = createObservableArray();
  public readonly availableBodies = [
    new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -5 ), MySolarSystemColors.firstBodyColorProperty ),
    new Body( 10, new Vector2( 200, 0 ), new Vector2( 0, 100 ), MySolarSystemColors.secondBodyColorProperty ),
    new Body( 0.1, new Vector2( 100, 0 ), new Vector2( 0, 150 ), MySolarSystemColors.thirdBodyColorProperty ),
    new Body( 0.1, new Vector2( -100, -100 ), new Vector2( 120, 0 ), MySolarSystemColors.fourthBodyColorProperty )
  ];

  public readonly centerOfMass: CenterOfMass;
  public readonly systemCenteredProperty;
  public readonly bodySoundManager: BodySoundManager;

  public numberOfActiveBodiesProperty: NumberProperty;
  public engine: EngineType;

  public readonly userInteractingEmitter = new Emitter();

  // Time control parameters
  //REVIEW: Please document types, or inline! It's hard to read the code when it's like this, I have to guess types,
  //REVIEW: or have the IDE look up things.
  public timeScale; // Changeable because Kepler's Laws screen uses a different speed
  public timeMultiplier;
  //REVIEW: Why timeScale and timeMultiplier? They seem to be doing very similar things, and I'm not convinced we need two things yet
  //AMSWER: One is for internal use (for the model steps) and the other one is for the UI (for the time speed)
  public readonly timeRange;
  public readonly timeProperty;
  public readonly isPlayingProperty;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  //REVIEW: Please document types, or inline! It's hard to read the code when it's like this, I have to guess types,
  //REVIEW: or have the IDE look up things.
  public readonly pathVisibleProperty;
  public readonly gravityVisibleProperty;
  public readonly velocityVisibleProperty;
  public readonly gridVisibleProperty;
  public readonly measuringTapeVisibleProperty;
  public readonly valuesVisibleProperty;
  public readonly moreDataProperty;
  public readonly realUnitsProperty;

  public readonly zoomLevelProperty: NumberProperty;
  public readonly zoomProperty: ReadOnlyProperty<number>;
  public readonly isLab: boolean;
  public readonly labModeProperty: EnumerationProperty<LabMode>;

  // Define the mode bodies will go to when restarted. Is updated when the user changes a body.
  private previousModeInfo = [
    { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -5 ) },
    { mass: 10, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 100 ) }
  ];
  protected defaultModeInfo: BodyInfo[]; //REVIEW: protected, but not used in subclasses?

  public constructor( providedOptions: CommonModelOptions<EngineType> ) {
    //REVIEW: We're pulling providedOptions.tandem out a lot. Perhaps `const tandem = providedOptions.tandem` would make things more readable?

    this.bodySoundManager = new BodySoundManager( this );

    this.isLab = providedOptions.isLab;
    this.labModeProperty = new EnumerationProperty( LabMode.SUN_PLANET, {
      tandem: providedOptions.tandem.createTandem( 'labModeProperty' )
    } );

    // Define the default mode the bodies will show up in
    this.defaultModeInfo = this.availableBodies.map( body => body.info );

    // We want to synchronize availableBodies and bodies, so that bodies is effectively availableBodies.filter( isActive )
    // Order matters, AND we don't want to remove items unnecessarily, so some additional logic is required.
    Multilink.multilinkAny( this.availableBodies.map( body => body.isActiveProperty ), () => {
      const idealBodies = this.availableBodies.filter( body => body.isActiveProperty.value );

      // Remove all inactive bodies
      this.bodies.filter( body => !body.isActiveProperty.value ).forEach( body => this.bodies.remove( body ) );

      // Add in active bodies (in order)
      for ( let i = 0; i < idealBodies.length; i++ ) {
        if ( this.bodies[ i ] !== idealBodies[ i ] ) {
          this.bodies.splice( i, 0, idealBodies[ i ] );
        }
      }
    } );

    this.availableBodies.forEach( body => {
      body.collidedEmitter.addListener( () => {
        this.bodySoundManager.playBodyRemovedSound( 2 );
      } );

      Multilink.lazyMultilink(
        [ body.userControlledPositionProperty, body.userControlledVelocityProperty, body.userControlledMassProperty ],
        ( userControlledPosition: boolean, userControlledVelocity: boolean, userControlledMass: boolean ) => {
          if ( userControlledPosition || userControlledVelocity ) {
            this.isPlayingProperty.value = false;
          }
          this.updatePreviousModeInfo();
          this.userInteractingEmitter.emit();
        }
      );
    } );

    this.centerOfMass = new CenterOfMass( this.bodies );
    this.setInitialBodyStates( this.previousModeInfo );
    this.followCenterOfMass();
    this.numberOfActiveBodiesProperty = new NumberProperty( this.bodies.length );
    this.engine = providedOptions.engineFactory( this.bodies );
    this.engine.reset();


    // Time settings
    // timeScale controls the velocity of time
    this.timeScale = 1.0; //REVIEW: I would definitely use the options pattern here, instead of relying on mutation. Have keplers pass in a different timeScale, and set the default in the options
    this.timeMultiplier = MySolarSystemConstants.TIME_MULTIPLIER; //REVIEW: same here
    //REVIEW: timeRange seems fully static. Can we move it to its usage in the view instead of putting it here?
    this.timeRange = new Range( 0, 1000 );
    this.timeProperty = new NumberProperty( 0 );
    this.isPlayingProperty = new BooleanProperty( false );
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL );

    // Visibility properties for checkboxes
    this.pathVisibleProperty = new BooleanProperty( false, { tandem: providedOptions.tandem.createTandem( 'pathVisibleProperty' ) } );
    this.gravityVisibleProperty = new BooleanProperty( false, { tandem: providedOptions.tandem.createTandem( 'gravityVisibleProperty' ) } );
    this.velocityVisibleProperty = new BooleanProperty( false, { tandem: providedOptions.tandem.createTandem( 'velocityVisibleProperty' ) } );
    this.gridVisibleProperty = new BooleanProperty( false, { tandem: providedOptions.tandem.createTandem( 'gridVisibleProperty' ) } );
    this.measuringTapeVisibleProperty = new BooleanProperty( false, { tandem: providedOptions.tandem.createTandem( 'measuringTapeVisibleProperty' ) } );
    this.valuesVisibleProperty = new BooleanProperty( false, { tandem: providedOptions.tandem.createTandem( 'valuesVisibleProperty' ) } );
    this.moreDataProperty = new BooleanProperty( false, { tandem: providedOptions.tandem.createTandem( 'moreDataProperty' ) } );
    this.systemCenteredProperty = new BooleanProperty( false, { tandem: providedOptions.tandem.createTandem( 'systemCenteredProperty' ) } );
    this.realUnitsProperty = new BooleanProperty( false, { tandem: providedOptions.tandem.createTandem( 'realUnitsProperty' ) } );

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
        this.updatePreviousModeInfo();
      }
      if ( wasPlayingBefore ) {
        this.isPlayingProperty.value = true; // Resume the sim
      }
    } );

    this.zoomLevelProperty = new NumberProperty( 2, {
      range: new Range( 0, 4 ),
      tandem: providedOptions.tandem.createTandem( 'zoomLevelProperty' ),
      numberType: 'Integer'
    } );
    this.zoomProperty = new DerivedProperty( [ this.zoomLevelProperty ], zoomLevel => {
      return Utils.linear( 0, 4, 0.5, 1.25, zoomLevel );
    } );

    this.pathVisibleProperty.link( visible => {
      this.clearPaths();
    } );
  }

  public updatePreviousModeInfo(): void {
    this.previousModeInfo = this.bodies.map( body => body.info );
  }

  /**
   * Sets the available bodies initial states according to bodiesInfo
   */
  public setInitialBodyStates( bodiesInfo: BodyInfo[] ): void {
    for ( let i = 0; i < 4; i++ ) {
      const isActive = i < bodiesInfo.length;
      this.availableBodies[ i ].isActiveProperty.value = isActive;

      const body = isActive ? bodiesInfo[ i ] : this.defaultModeInfo[ i ];

      // Setting initial values and then resetting the body to make sure the body is in the correct state
      this.availableBodies[ i ].massProperty.setInitialValue( body.mass );
      this.availableBodies[ i ].positionProperty.setInitialValue( body.position );
      this.availableBodies[ i ].velocityProperty.setInitialValue( body.velocity );
      this.availableBodies[ i ].reset();
      this.availableBodies[ i ].preventCollision( this.bodies );
    }

    // Update Center of Mass
    this.centerOfMass.update();

    this.updatePreviousModeInfo();
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

  public removeLastBody(): void {
    const numberOfActiveBodies = this.bodies.length - 1;
    const lastBody = this.bodies[ numberOfActiveBodies ];
    lastBody.isActiveProperty.value = false;
    this.updatePreviousModeInfo();
  }

  /**
   * Adds the next available body to the system and checks that is doesn't collide with any other bodies.
   */
  public addBody(): void {
    const newBody = this.availableBodies.find( body => !body.isActiveProperty.value );
    if ( newBody ) {
      newBody.reset();
      newBody.preventCollision( this.bodies );
      newBody.isActiveProperty.value = true;
    }
    this.updatePreviousModeInfo();
  }

  public reset(): void {
    this.isPlayingProperty.value = false; // Pause the sim
    this.timeSpeedProperty.reset();
    this.zoomLevelProperty.reset();
    this.pathVisibleProperty.reset();
    this.gravityVisibleProperty.reset();
    this.velocityVisibleProperty.reset();
    this.gridVisibleProperty.reset();
    this.measuringTapeVisibleProperty.reset();
    this.valuesVisibleProperty.reset();
    this.moreDataProperty.reset();
    this.centerOfMass.visibleProperty.reset();
    this.realUnitsProperty.reset();

    this.restart();
  }

  // Restart is for when the time controls are brought back to 0
  // Bodies move to their last modified position
  public restart(): void {
    this.isPlayingProperty.value = false; // Pause the sim
    this.timeProperty.reset(); // Reset the time
    this.setInitialBodyStates( this.previousModeInfo ); // Reset the bodies
    this.update();
  }

  /**
   * Updating for when the bodies are changed
   */
  public update(): void {
    this.engine.update( this.bodies );
    this.centerOfMass.update();

    // If position or velocity of Center of Mass is different than 0, then the system is not centered
    if ( this.centerOfMass.positionProperty.value.magnitude > 0.01 || this.centerOfMass.velocityProperty.value.magnitude > 0.01 ) {
      this.systemCenteredProperty.value = false;
    }

    this.numberOfActiveBodiesProperty.value = this.bodies.length;
  }

  public stepOnce( dt: number ): void {
    let adjustedDT = dt * timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale;
    const count = Math.ceil( adjustedDT / 0.02 );
    adjustedDT /= count;

    for ( let i = 0; i < count; i++ ) {
      this.engine.run( adjustedDT );
      this.engine.checkCollisions();
      this.timeProperty.value += adjustedDT * this.timeMultiplier;
      if ( this.pathVisibleProperty ) {
        this.bodies.forEach( body => body.addPathPoint() );
      }
    }
  }

  public step( dt: number ): void {
    this.update();

    if ( this.isPlayingProperty.value ) {
      this.bodySoundManager.playSounds();
      this.stepOnce( dt );
    }
    else {
      this.bodySoundManager.stop();
    }
  }

  public clearPaths(): void {
    this.bodies.forEach( body => {
      body.clearPath();
    } );
  }
}

mySolarSystem.register( 'CommonModel', CommonModel );
export default CommonModel;