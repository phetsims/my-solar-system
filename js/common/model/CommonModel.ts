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
import Vector2 from '../../../../dot/js/Vector2.js';

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

export type CommonModelOptions<EngineType extends Engine> = SelfOptions<EngineType>;

abstract class CommonModel<EngineType extends Engine = Engine> {
  public readonly bodies: ObservableArray<Body>;
  public readonly centerOfMass: CenterOfMass;
  public engine: EngineType;

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

  public readonly availableBodies: Body[];


  public constructor( providedOptions: CommonModelOptions<EngineType> ) {
    this.bodies = createObservableArray();

    //REVIEW: createBodies is only... called once in the constructor? AND it's done in the supertype (common model)
    //REVIEW: so it doesn't require any of the subtypes to access class properties?
    //REVIEW: Can we just switch to passing in the bodies in the constructor (as an array) and remove this method?
    //REVIEW: Then we can also get rid of the "clear" each createBodies has.
    this.createBodies();
    this.centerOfMass = new CenterOfMass( this.bodies );
    this.engine = providedOptions.engineFactory( this.bodies );
    this.engine.reset();

    // Time settings
    // timeScale controls the velocity of time
    this.timeScale = 1.0;
    this.timeRange = new Range( 0, 1000 );
    //REVIEW: Could remove these two type parameters, because they will be inferred (because of what you are assigning
    //REVIEW them to).
    this.timeProperty = new Property<number>( 0 );
    this.isPlayingProperty = new Property<boolean>( false, {
      tandem: providedOptions.tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: `This value is true if the play/pause button on this screen is in play mode. (It remains true even if the user switches screens. Use in combination with '${phet.joist.sim.selectedScreenProperty.tandem.phetioID}'.)`
    } );
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: providedOptions.tandem.createTandem( 'timeSpeedProperty' )
    } );

    // Visibility properties for checkboxes
    //REVIEW: We'll want to add tandems to these (perhaps we can collaborate on adding phet-io tandems?)
    this.pathVisibleProperty = new Property<boolean>( false );
    this.gravityVisibleProperty = new Property<boolean>( false );
    this.velocityVisibleProperty = new Property<boolean>( false );
    this.gridVisibleProperty = new Property<boolean>( false );
    this.measuringTapeVisibleProperty = new Property<boolean>( false );
    this.valuesVisibleProperty = new Property<boolean>( false );
    this.moreDataProperty = new Property<boolean>( false );

    this.zoomLevelProperty = new NumberProperty( 3, {
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

    this.availableBodies = [
      new Body( 1, new Vector2( 0, 0 ), new Vector2( 0, 100 ) ),
      new Body( 1, new Vector2( 0, 0 ), new Vector2( 0, 100 ) ),
      new Body( 1, new Vector2( 0, 0 ), new Vector2( 0, 100 ) ),
      new Body( 1, new Vector2( 0, 0 ), new Vector2( 0, 100 ) )
    ];
  }

  /**
   * Abstract method for body creation, every screen model will decide how to implement
   */
  public abstract createBodies(): void;

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
    this.isPlayingProperty.value = false;
    this.bodies.forEach( body => body.reset() );
    //REVIEW: We set the timeProperty to zero after the update... is there a reason for that? If so, it should be documented.
    this.update();
    this.timeProperty.value = 0;
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
  }

  public step( dt: number ): void {
    this.update();

    if ( this.isPlayingProperty.value ) {
      this.stepOnce( dt );
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