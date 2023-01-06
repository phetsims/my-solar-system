// Copyright 2022-2023, University of Colorado Boulder

/**
 * The model in charge of the Kepler's Laws Screen components.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CommonModel, { CommonModelOptions } from '../../common/model/CommonModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import LawMode from './LawMode.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import EllipticalOrbit from './EllipticalOrbit.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import Emitter from '../../../../axon/js/Emitter.js';

type SuperTypeOptions = CommonModelOptions<EllipticalOrbit>;

type KeplersLawsModelOptions = StrictOmit<SuperTypeOptions, 'engineFactory' | 'isLab'>;

class KeplersLawsModel extends CommonModel<EllipticalOrbit> {
  public readonly selectedLawProperty = new EnumerationProperty( LawMode.SECOND_LAW );

  // Booleans to keep track of which law is selected
  // TODO: Is this very inefficient?
  public readonly isFirstLawProperty = new BooleanProperty( false );
  public readonly isSecondLawProperty = new BooleanProperty( false );
  public readonly isThirdLawProperty = new BooleanProperty( false );
  public readonly lawUpdatedEmitter = new Emitter();

  // First Law Properties
  public axisVisibleProperty = new BooleanProperty( false );
  public semiaxisVisibleProperty = new BooleanProperty( false );
  public fociVisibleProperty = new BooleanProperty( false );
  public excentricityVisibleProperty = new BooleanProperty( false );


  // Second Law properties
  public apoapsisVisibleProperty = new BooleanProperty( false );
  public periapsisVisibleProperty = new BooleanProperty( false );

  public areasVisibleProperty = new BooleanProperty( true );
  public dotsVisibleProperty = new BooleanProperty( true );
  public sweepAreaVisibleProperty = new BooleanProperty( true );
  public areaGraphVisibleProperty = new BooleanProperty( true );
  public periodDivisionProperty = new NumberProperty( 4 );
  public maxDivisionValue = MySolarSystemConstants.MAX_ORBITAL_DIVISIONS;

  // Third law properties
  public semimajorAxisVisibleProperty = new BooleanProperty( false );
  public periodVisibleProperty = new BooleanProperty( false );

  public selectedAxisPowerProperty = new NumberProperty( 1 );
  public selectedPeriodPowerProperty = new NumberProperty( 1 );

  public constructor( providedOptions: KeplersLawsModelOptions ) {
    const options = optionize<KeplersLawsModelOptions, EmptySelfOptions, SuperTypeOptions>()( {
      engineFactory: bodies => new EllipticalOrbit( bodies ),
      isLab: false
    }, providedOptions );
    super( options );

    this.selectedLawProperty.link( law => {
      this.visibilityReset();

      this.isFirstLawProperty.value = law === LawMode.FIRST_LAW;
      this.isSecondLawProperty.value = law === LawMode.SECOND_LAW;
      this.isThirdLawProperty.value = law === LawMode.THIRD_LAW;

      this.lawUpdatedEmitter.emit();
    } );

    this.periodDivisionProperty.link( divisions => {
      this.engine.periodDivisions = divisions;
      this.engine.update();
    } );

    this.engine.orbitalAreas.forEach( ( area, index ) => {
      area.insideProperty.link( inside => {
        if ( inside && this.isPlayingProperty.value && this.isSecondLawProperty.value ) {
          const soundIndex = this.engine.retrograde ? this.periodDivisionProperty.value - index - 1 : index;
          this.bodySoundManager.playOrbitalMetronome( soundIndex, this.engine.a );
        }
      } );
    } );

    this.timeScale = 2.0;
    this.timeMultiplier = 1 / 12.7;

    this.zoomLevelProperty.setInitialValue( 2 );
    this.zoomLevelProperty.value = 2;

    this.velocityVisibleProperty.value = true;

  }

  public override setInitialBodyStates(): void {
    if ( this.bodies.length === 0 ) {
      // If bodies haven't been created, populate the bodies array
      super.setInitialBodyStates( [
        { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
        { mass: 50, position: new Vector2( 100, 0 ), velocity: new Vector2( 0, 177 ) }
      ] );

      this.updatePreviousModeInfo();
    }
    else {
      // Reset the orbiting body
      this.bodies[ 1 ].reset();
      // debugger;
      this.engine.reset();
    }
  }

  public visibilityReset(): void {
    // Calls reset only on the visibilityProperties to avoid reentries on selectedLawProperty
    this.apoapsisVisibleProperty.reset();
    this.periapsisVisibleProperty.reset();
    this.axisVisibleProperty.reset();
    this.areasVisibleProperty.reset();
    this.dotsVisibleProperty.reset();
    this.sweepAreaVisibleProperty.reset();
    this.areaGraphVisibleProperty.reset();
    this.semimajorAxisVisibleProperty.reset();
    this.periodVisibleProperty.reset();
  }

  public override reset(): void {
    super.reset();
    this.selectedLawProperty.reset();
    this.periodDivisionProperty.reset();
    this.selectedAxisPowerProperty.reset();
    this.selectedPeriodPowerProperty.reset();

    this.visibilityReset();
    this.engine.update();
  }

  public override update(): void {
    if ( this.engine.updateAllowed ) {
      this.engine.update();
    }
  }
}

mySolarSystem.register( 'KeplersLawsModel', KeplersLawsModel );
export default KeplersLawsModel;