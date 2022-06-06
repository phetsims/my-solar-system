// Copyright 2020-2022, University of Colorado Boulder

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

const timeFormatter = new Map<TimeSpeed, number>( [
  [ TimeSpeed.FAST, 7 / 4 ],
  [ TimeSpeed.NORMAL, 1 ],
  [ TimeSpeed.SLOW, 1 / 4 ]
] );

type SelfOptions = {
engineFactory: ( bodies: ObservableArray<Body> ) => Engine;
isLab: boolean;
tandem: Tandem;
}

export type CommonModelOptions = SelfOptions;

abstract class CommonModel {
  bodies: ObservableArray<Body>;
  centerOfMass: CenterOfMass;
  engine: Engine;

  timeScale: number;
  timeRange: Range;
  timeProperty: Property<number>;
  isPlayingProperty: Property<boolean>;
  timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  pathVisibleProperty: Property<boolean>;
  gravityVisibleProperty: Property<boolean>;
  velocityVisibleProperty: Property<boolean>;
  gridVisibleProperty: Property<boolean>;
  measuringTapeVisibleProperty: Property<boolean>;

  zoomLevelProperty: RangedProperty;

  isLab: boolean;
  labModeProperty: EnumerationProperty<LabModes>;


  constructor( providedOptions: CommonModelOptions ) {
    this.bodies = createObservableArray();
    this.createBodies();
    this.centerOfMass = new CenterOfMass( this.bodies );
    this.engine = providedOptions.engineFactory( this.bodies );
    this.engine.reset();

    // Time settings
    // timeScale controls the velocity of time
    this.timeScale = 0.5;
    this.timeRange = new Range( 0, 1000 );
    this.timeProperty = new Property<number>( 0 );
    this.isPlayingProperty = new Property<boolean>( false, {
      tandem: providedOptions.tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: `This value is true if the play/pause button on this screen is in play mode. (It remains true even if the user switches screens. Use in combination with '${phet.joist.sim.screenProperty.tandem.phetioID}'.)`
    } );
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: providedOptions.tandem.createTandem( 'timeSpeedProperty' )
    } );

    this.pathVisibleProperty = new Property<boolean>( false );
    this.gravityVisibleProperty = new Property<boolean>( false );
    this.velocityVisibleProperty = new Property<boolean>( false );
    this.gridVisibleProperty = new Property<boolean>( false );
    this.measuringTapeVisibleProperty = new Property<boolean>( false );

    this.zoomLevelProperty = new NumberProperty( 1, {
      range: new Range( 0.5, 2 )
    } ).asRanged();

    this.isLab = providedOptions.isLab;
    this.labModeProperty = new EnumerationProperty( LabModes.SUN_PLANET );
  }

  abstract createBodies(): void

  restart(): void {
    this.isPlayingProperty.value = false;
    this.bodies.forEach( body => body.reset() );
    this.update();
    this.timeProperty.value = 0;
  }

  stepForward(): void {
    this.engine.run( 1 / 60 );
    this.timeProperty.value += timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale;
  }

  update(): void {
    this.engine.update( this.bodies );
    this.centerOfMass.updateCenterOfMassPosition();
  }
  
  reset(): void {
    this.restart();
  }
  
  step( dt: number ): void {
    const Ntimes = 400 / this.bodies.length;
    this.update();
    if ( this.isPlayingProperty.value ) {
      for ( let i = 0; i < Ntimes; i++ ) {
        this.engine.run( dt * timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale / Ntimes );
      }
      this.timeProperty.value += timeFormatter.get( this.timeSpeedProperty.value )! * this.timeScale;
      this.centerOfMass.updateCenterOfMassPosition();
    }
  }
}

mySolarSystem.register( 'CommonModel', CommonModel );
export default CommonModel;