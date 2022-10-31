// Copyright 2022, University of Colorado Boulder

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
import NumberProperty, { RangedProperty } from '../../../../axon/js/NumberProperty.js';
import LabModes from './LabModes.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BodySoundManager from '../view/BodySoundManager.js';
import MySolarSystemColors from '../MySolarSystemColors.js';

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
  public readonly bodies: ObservableArray<Body>;
  public readonly centerOfMass: CenterOfMass;
  public readonly systemCenteredProperty;
  public readonly bodySoundManager: BodySoundManager;

  public numberOfActiveBodiesProperty: NumberProperty;
  public engine: EngineType;

  // Time control parameters
  public timeScale; // Changeable because Kepler's Laws screen uses a different speed
  public readonly timeRange;
  public readonly timeProperty;
  public readonly isPlayingProperty;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  public readonly pathVisibleProperty;
  public readonly gravityVisibleProperty;
  public readonly velocityVisibleProperty;
  public readonly gridVisibleProperty;
  public readonly measuringTapeVisibleProperty;
  public readonly valuesVisibleProperty;
  public readonly moreDataProperty;
  public readonly realUnitsProperty;

  public readonly zoomLevelProperty: RangedProperty;
  public readonly zoomProperty: ReadOnlyProperty<number>;

  public readonly isLab: boolean;
  public readonly labModeProperty: EnumerationProperty<LabModes>;

  public readonly availableBodies: Body[];
  private readonly defaultModeInfo: BodyInfo[];


  public constructor( providedOptions: CommonModelOptions<EngineType> ) {
    this.bodies = createObservableArray();

    this.bodySoundManager = new BodySoundManager( this, { tandem: providedOptions.tandem.createTandem( 'bodySoundManager' ) } );

    this.availableBodies = [
      new Body( 1, new Vector2( -100, 100 ), new Vector2( -50, -50 ), MySolarSystemColors.firstBodyColorProperty ),
      new Body( 1, new Vector2( 100, 100 ), new Vector2( -50, 50 ), MySolarSystemColors.secondBodyColorProperty ),
      new Body( 1, new Vector2( 100, -100 ), new Vector2( 50, 50 ), MySolarSystemColors.thirdBodyColorProperty ),
      new Body( 1, new Vector2( -100, -100 ), new Vector2( 50, -50 ), MySolarSystemColors.fourthBodyColorProperty )
    ];

    this.availableBodies.forEach( body => {
      body.isCollidedProperty.link( isCollided => {
        if ( isCollided ) {
          this.bodySoundManager.playBodyRemovedSound( this.numberOfActiveBodiesProperty.value - 2 );
        }
      } );
    } );

    // Define the default mode the bodies will show up in
    this.defaultModeInfo = [
      { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -5 ) },
      { mass: 10, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 100 ) }
    ];

    //REVIEW: createBodies is only... called once in the constructor? AND it's done in the supertype (common model)
    //REVIEW: so it doesn't require any of the subtypes to access class properties?
    //REVIEW: Can we just switch to passing in the bodies in the constructor (as an array) and remove this method?
    //REVIEW: Then we can also get rid of the "clear" each createBodies has.
    this.createBodies( this.defaultModeInfo );
    this.numberOfActiveBodiesProperty = new NumberProperty( this.bodies.length );
    this.centerOfMass = new CenterOfMass( this.bodies );
    this.engine = providedOptions.engineFactory( this.bodies );
    this.engine.reset();


    // Time settings
    // timeScale controls the velocity of time
    this.timeScale = 1.0;
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

    this.valuesVisibleProperty.link( visible => {
      this.availableBodies.forEach( body => {
        body.valueVisibleProperty.value = visible; // Doesn't need disposal because will always exist
      } );
    } );

    // Re-center the bodies and set Center of Mass speed to 0 when the systemCentered option is selected
    this.systemCenteredProperty.link( systemCentered => {
      if ( systemCentered ) {
        // this.isPlayingProperty.value = false; // Pause the sim
        this.bodies.forEach( body => {
          body.clearPath();
          body.positionProperty.set( body.positionProperty.value.minus( this.centerOfMass.positionProperty.value ) );
          body.velocityProperty.set( body.velocityProperty.value.minus( this.centerOfMass.velocityProperty.value ) );
        } );
      }
    } );

    this.zoomLevelProperty = new NumberProperty( 3, {
      range: new Range( 0, 7 ),
      tandem: providedOptions.tandem.createTandem( 'zoomLevelProperty' ),
      numberType: 'Integer'
    } ).asRanged();
    this.zoomProperty = new DerivedProperty( [ this.zoomLevelProperty ], zoomLevel => {
      return Utils.linear( 0, 7, 0.5, 1.5, zoomLevel );
    } );

    this.isLab = providedOptions.isLab;
    this.labModeProperty = new EnumerationProperty( LabModes.SUN_PLANET, {
      tandem: providedOptions.isLab ? providedOptions.tandem.createTandem( 'labModeProperty' ) : Tandem.OPT_OUT
    } );
    this.labModeProperty.link( mode => {
      this.clearPaths();
    } );

    this.pathVisibleProperty.link( visible => {
      this.clearPaths();
    } );
  }

  public createBodies( bodiesInfo: BodyInfo[] ): void {
    this.bodies.clear();
    bodiesInfo.forEach( ( body, i ) => {
      this.availableBodies[ i ].massProperty.setInitialValue( body.mass );
      this.availableBodies[ i ].positionProperty.setInitialValue( body.position );
      this.availableBodies[ i ].velocityProperty.setInitialValue( body.velocity );

      this.bodies.push( this.availableBodies[ i ] );
    } );

    this.bodies.forEach( body => body.reset() );
  }

  public reset(): void {
    this.restart();
    this.timeSpeedProperty.reset();
    this.zoomLevelProperty.reset();
    this.pathVisibleProperty.reset();
    this.gravityVisibleProperty.reset();
    this.velocityVisibleProperty.reset();
    this.gridVisibleProperty.reset();
    this.measuringTapeVisibleProperty.reset();
    this.valuesVisibleProperty.reset();
    this.moreDataProperty.reset();
    this.labModeProperty.reset();
    this.centerOfMass.visibleProperty.reset();
  }

  // Restart is for when the time controls are brought back to 0
  public restart(): void {
    this.isPlayingProperty.value = false; // Pause the sim
    this.timeProperty.value = 0; // Reset the time
    this.createBodies( this.defaultModeInfo ); // Reset the bodies
    this.update();
  }

  public stepOnce( dt: number ): void {
    this.engine.run( dt * timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale );
    this.timeProperty.value += dt * timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale;
    if ( this.pathVisibleProperty ) {
      this.bodies.forEach( body => body.addPathPoint() );
    }
  }

  /**
   * Updating for when the bodies are changed
   */
  public update(): void {
    this.engine.update( this.bodies );
    this.centerOfMass.updateCenterOfMassPosition();

    // If position or velocity of Center of Mass is different than 0, then the system is not centered
    if ( this.centerOfMass.positionProperty.value.magnitude > 0.01 || this.centerOfMass.velocityProperty.value.magnitude > 0.01 ) {
      this.systemCenteredProperty.value = false;
    }

    this.numberOfActiveBodiesProperty.value = this.bodies.length;
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