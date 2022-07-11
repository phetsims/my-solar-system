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
import Property from '../../../../axon/js/Property.js';
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

const timeFormatter = new Map<TimeSpeed, number>( [
  [ TimeSpeed.FAST, 7 / 4 ],
  [ TimeSpeed.NORMAL, 1 ],
  [ TimeSpeed.SLOW, 1 / 4 ]
] );

type SelfOptions = {
  engineFactory: ( bodies: ObservableArray<Body> ) => Engine;
  isLab: boolean;
  tandem: Tandem;
};

export type CommonModelOptions = SelfOptions;

abstract class CommonModel {
  public readonly bodies: ObservableArray<Body>;
  public readonly centerOfMass: CenterOfMass;
  private readonly engine: Engine;

  public readonly timeScale: number;
  public readonly timeRange: Range;
  public readonly timeProperty: Property<number>;
  public readonly isPlayingProperty: Property<boolean>;
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  public readonly pathVisibleProperty: Property<boolean>;
  public readonly gravityVisibleProperty: Property<boolean>;
  public readonly velocityVisibleProperty: Property<boolean>;
  public readonly gridVisibleProperty: Property<boolean>;
  public readonly measuringTapeVisibleProperty: Property<boolean>;
  public readonly valuesVisibleProperty: Property<boolean>;
  public readonly moreDataProperty: Property<boolean>;

  public readonly zoomLevelProperty: RangedProperty;
  public readonly zoomProperty: ReadOnlyProperty<number>;

  public readonly isLab: boolean;
  public readonly labModeProperty: EnumerationProperty<LabModes>;


  public constructor( providedOptions: CommonModelOptions ) {
    this.bodies = createObservableArray();
    this.createBodies();
    this.centerOfMass = new CenterOfMass( this.bodies );
    this.engine = providedOptions.engineFactory( this.bodies );
    this.engine.reset();

    // Time settings
    // timeScale controls the velocity of time
    this.timeScale = 0.2;
    this.timeRange = new Range( 0, 1000 );
    this.timeProperty = new Property<number>( 0 );
    this.isPlayingProperty = new Property<boolean>( false, {
      tandem: providedOptions.tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: `This value is true if the play/pause button on this screen is in play mode. (It remains true even if the user switches screens. Use in combination with '${phet.joist.sim.screenProperty.tandem.phetioID}'.)`
    } );
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: providedOptions.tandem.createTandem( 'timeSpeedProperty' )
    } );

    // Visibility properties for checkboxes
    this.pathVisibleProperty = new Property<boolean>( false );
    this.gravityVisibleProperty = new Property<boolean>( false );
    this.velocityVisibleProperty = new Property<boolean>( false );
    this.gridVisibleProperty = new Property<boolean>( false );
    this.measuringTapeVisibleProperty = new Property<boolean>( false );
    this.valuesVisibleProperty = new Property<boolean>( false );
    this.moreDataProperty = new Property<boolean>( false );

    this.zoomLevelProperty = new NumberProperty( 4, {
      range: new Range( 0, 7 )
    } ).asRanged();
    this.zoomProperty = new DerivedProperty( [ this.zoomLevelProperty ], zoomLevel => {
      return Utils.linear( 0, 7, 0.5, 1.5, zoomLevel );
    } );

    this.isLab = providedOptions.isLab;
    this.labModeProperty = new EnumerationProperty( LabModes.SUN_PLANET );
    this.labModeProperty.link( mode => {
      this.clearPaths();
    } );
  }

  /**
   * Abstract method for body creation, every screen model will decide how to implement
   */
  public abstract createBodies(): void;

  public restart(): void {
    this.isPlayingProperty.value = false;
    this.bodies.forEach( body => body.reset() );
    this.update();
    this.timeProperty.value = 0;
  }

  public stepForward(): void {
    this.engine.run( 1 / 60 );
    this.timeProperty.value += timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale;
  }

  /**
   * Updating for when the bodies are changed
   */
  public update(): void {
    this.engine.update( this.bodies );
    this.centerOfMass.updateCenterOfMassPosition();
  }

  public reset(): void {
    this.restart();
  }

  public step( dt: number ): void {
    this.update();
    if ( this.isPlayingProperty.value ) {
      this.engine.run( dt * timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale );
      this.timeProperty.value += timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale;
      this.centerOfMass.updateCenterOfMassPosition();
    }
    if ( this.pathVisibleProperty ) {
      this.bodies.forEach( body => body.addPathPoint );
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