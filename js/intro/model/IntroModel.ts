// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../../common/model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Engine from '../../common/model/Engine.js';

const timeFormatter = new Map<TimeSpeed, number>( [
  [ TimeSpeed.FAST, 7 / 4 ],
  [ TimeSpeed.NORMAL, 1 ],
  [ TimeSpeed.SLOW, 1 / 4 ]
] );

class IntroModel {
  bodies: ObservableArray<Body>;
  engine: Engine;
  isPlayingProperty: BooleanProperty;
  timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  pathVisibleProperty: BooleanProperty;
  gridVisibleProperty: BooleanProperty;
  centerOfMassVisibleProperty: BooleanProperty;
  gravityVisibleProperty: BooleanProperty;
  velocityVisibleProperty: BooleanProperty;


  constructor( tandem: Tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    this.isPlayingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: `This value is true if the play/pause button on this screen is in play mode. (It remains true even if the user switches screens. Use in combination with '${phet.joist.sim.screenProperty.tandem.phetioID}'.)`
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: tandem.createTandem( 'timeSpeedProperty' )
    } );

    this.pathVisibleProperty = new BooleanProperty( false );
    this.gridVisibleProperty = new BooleanProperty( false );
    this.centerOfMassVisibleProperty = new BooleanProperty( false );
    this.gravityVisibleProperty = new BooleanProperty( false );
    this.velocityVisibleProperty = new BooleanProperty( false );

    this.bodies = createObservableArray();
    this.repopulateBodies();

    this.engine = new Engine( this.bodies );
  }

  repopulateBodies(): void {
    // Clear out the bodies array and create N new random bodies
    this.bodies.clear();
    this.bodies.push( new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -6 ) ) );
    this.bodies.push( new Body( 10, new Vector2( 150, 0 ), new Vector2( 0, 120 ) ) );
  }

  restart(): void {
    this.repopulateBodies();
  }

  stepForward(): void {
    this.engine.run( 1 / 30 );
  }

  reset(): void {
    this.restart();
  }

  step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      this.engine.run( dt * timeFormatter.get( this.timeSpeedProperty.value )! );
    }
  }
}

mySolarSystem.register( 'IntroModel', IntroModel );
export default IntroModel;