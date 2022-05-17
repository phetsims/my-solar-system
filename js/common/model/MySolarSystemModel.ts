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
 
 const timeFormatter = new Map<TimeSpeed, number>( [
   [ TimeSpeed.FAST, 7 / 4 ],
   [ TimeSpeed.NORMAL, 1 ],
   [ TimeSpeed.SLOW, 1 / 4 ]
 ] );

 type SelfOptions = {
  engineFactory: ( bodies: ObservableArray<Body> ) => Engine;
  tandem: Tandem;
 }

 export type MySolarSystemModelOptions = SelfOptions;
 
 abstract class MySolarSystemModel {
   bodies: ObservableArray<Body>;
   engine: Engine;
   centerOfMass: CenterOfMass;
 
   timeRange: Range;
   timeProperty: Property<number>;
   isPlayingProperty: Property<boolean>;
   timeSpeedProperty: EnumerationProperty<TimeSpeed>;
 
   pathVisibleProperty: Property<boolean>;
   gridVisibleProperty: Property<boolean>;
   gravityVisibleProperty: Property<boolean>;
   velocityVisibleProperty: Property<boolean>;
 
   zoomLevelProperty: RangedProperty;
 
 
   constructor( providedOptions: MySolarSystemModelOptions ) {
     assert && assert( providedOptions.tandem instanceof Tandem, 'invalid tandem' );
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
     this.gridVisibleProperty = new Property<boolean>( false );
     this.gravityVisibleProperty = new Property<boolean>( false );
     this.velocityVisibleProperty = new Property<boolean>( false );
 
     this.bodies = createObservableArray();
     this.repopulateBodies();
 
     this.engine = providedOptions.engineFactory( this.bodies );
     this.engine.restart();
 
     this.centerOfMass = new CenterOfMass();
     this.centerOfMass.positionProperty.value = this.engine.getCenterOfMassPosition();
 
     this.zoomLevelProperty = new NumberProperty( 1, {
       range: new Range( 0.5, 2 )
     } ).asRanged();
   }
 
   abstract repopulateBodies(): void
 
   restart(): void {
     this.repopulateBodies();
     this.engine.update( this.bodies );
     this.engine.restart();
     this.centerOfMass.positionProperty.value = this.engine.getCenterOfMassPosition();
     this.timeProperty.value = 0;
   }
 
   stepForward(): void {
     this.engine.run( 1 / 30 );
     this.timeProperty.value += timeFormatter.get( this.timeSpeedProperty.value )! / 10;
   }
   
   reset(): void {
     this.restart();
   }
   
   step( dt: number ): void {
     if ( this.isPlayingProperty.value ) {
       this.engine.run( dt * timeFormatter.get( this.timeSpeedProperty.value )! );
       this.timeProperty.value += timeFormatter.get( this.timeSpeedProperty.value )! / 10;
       this.centerOfMass.positionProperty.value = this.engine.getCenterOfMassPosition();
     }
   }
 }
 
 mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );
 export default MySolarSystemModel;