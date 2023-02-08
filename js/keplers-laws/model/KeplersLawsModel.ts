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
import EllipticalOrbitEngine from './EllipticalOrbitEngine.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import Emitter from '../../../../axon/js/Emitter.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Body from '../../common/model/Body.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';

type SuperTypeOptions = CommonModelOptions<EllipticalOrbitEngine>;

type KeplersLawsModelOptions = StrictOmit<SuperTypeOptions, 'engineFactory' | 'isLab'>;

class KeplersLawsModel extends CommonModel<EllipticalOrbitEngine> {
  public readonly selectedLawProperty = new EnumerationProperty( LawMode.FIRST_LAW );
  public readonly alwaysCircularProperty = new BooleanProperty( false );

  public override readonly availableBodies = [
    new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, 0 ), MySolarSystemColors.firstBodyColorProperty ),
    new Body( 10, new Vector2( 200, 0 ), new Vector2( 0, 100 ), MySolarSystemColors.secondBodyColorProperty )
  ];

  // Booleans to keep track of which law is selected
  // TODO: Is this very inefficient?
  public readonly isFirstLawProperty = new BooleanProperty( false );
  public readonly isSecondLawProperty = new BooleanProperty( false );
  public readonly isThirdLawProperty = new BooleanProperty( false );
  public readonly lawUpdatedEmitter = new Emitter();

  // First Law Properties
  public readonly axisVisibleProperty = new BooleanProperty( false );
  public readonly semiaxisVisibleProperty = new BooleanProperty( false );
  public readonly fociVisibleProperty = new BooleanProperty( false );
  public readonly stringsVisibleProperty = new BooleanProperty( false );
  public readonly eccentricityVisibleProperty = new BooleanProperty( false );


  // Second Law properties
  public readonly apoapsisVisibleProperty = new BooleanProperty( false );
  public readonly periapsisVisibleProperty = new BooleanProperty( false );

  public readonly sweepAreaVisibleProperty = new BooleanProperty( true );
  public readonly areaGraphVisibleProperty = new BooleanProperty( true );
  public readonly periodDivisionProperty = new NumberProperty( 4 );
  public readonly maxDivisionValue = MySolarSystemConstants.MAX_ORBITAL_DIVISIONS;

  // Third law properties
  public readonly semiMajorAxisVisibleProperty = new BooleanProperty( false );
  public readonly periodVisibleProperty = new BooleanProperty( false );

  public readonly selectedAxisPowerProperty = new NumberProperty( 1 );
  public readonly selectedPeriodPowerProperty = new NumberProperty( 1 );

  public readonly poweredSemiMajorAxisProperty: ReadOnlyProperty<number>;
  public readonly poweredPeriodProperty: ReadOnlyProperty<number>;

  public readonly stopwatch: Stopwatch;

  public constructor( providedOptions: KeplersLawsModelOptions ) {
    const options = optionize<KeplersLawsModelOptions, EmptySelfOptions, SuperTypeOptions>()( {
      engineFactory: bodies => new EllipticalOrbitEngine( bodies ),
      isLab: false
    }, providedOptions );
    super( options );

    this.systemCenteredProperty.value = false;

    this.selectedLawProperty.link( law => {
      this.visibilityReset();

      this.isFirstLawProperty.value = law === LawMode.FIRST_LAW;
      this.isSecondLawProperty.value = law === LawMode.SECOND_LAW;
      this.isThirdLawProperty.value = law === LawMode.THIRD_LAW;

      this.lawUpdatedEmitter.emit();
    } );

    this.periodDivisionProperty.link( divisions => {
      this.engine.periodDivisions = divisions;
      this.engine.resetOrbitalAreas();
      this.engine.update();
    } );

    this.engine.orbitalAreas.forEach( ( area, index ) => {
      area.insideProperty.link( inside => {
        if ( inside && this.isPlayingProperty.value && this.isSecondLawProperty.value ) {
          const soundIndex = this.engine.retrograde ? this.periodDivisionProperty.value - index - 1 : index;
          this.bodySoundManager.playOrbitalMetronome( soundIndex, this.engine.a, this.periodDivisionProperty.value );
        }
      } );
    } );

    this.axisVisibleProperty.link( axisVisible => {
      this.semiaxisVisibleProperty.value = axisVisible ? this.semiaxisVisibleProperty.value : false;
      // this.eccentricityVisibleProperty.value = axisVisible ? this.eccentricityVisibleProperty.value : false;
    } );
    this.fociVisibleProperty.link( fociVisible => {
      this.stringsVisibleProperty.value = fociVisible ? this.stringsVisibleProperty.value : false;
    } );
    this.sweepAreaVisibleProperty.link( areasVisible => {
      this.areaGraphVisibleProperty.value = areasVisible ? this.areaGraphVisibleProperty.value : false;
    } );

    this.timeScale = 2.0;
    this.timeMultiplier = 1 / 12.7;

    this.velocityVisibleProperty.value = true;
    this.velocityVisibleProperty.setInitialValue( true );

    // Powered values of semiMajor axis and period
    this.poweredSemiMajorAxisProperty = new DerivedProperty(
      [ this.selectedAxisPowerProperty, this.engine.semiMajorAxisProperty ],
      ( power, semiMajorAxis ) => Math.pow( semiMajorAxis, power )
    );

    this.poweredPeriodProperty = new DerivedProperty(
      [ this.selectedPeriodPowerProperty, this.engine.periodProperty ],
      ( power, period ) => Math.pow( period, power )
    );

    this.alwaysCircularProperty.link( alwaysCircular => {
      this.engine.alwaysCircles = alwaysCircular;
      this.engine.update();
    } );

    this.stopwatch = new Stopwatch( {
      // TODO: Make this stopwatch work
      timePropertyOptions: {
        range: Stopwatch.ZERO_TO_ALMOST_SIXTY,
        units: 's'
      }
      // tandem: tandem.createTandem( 'stopwatch' )
    } );
  }

  public override setInitialBodyStates(): void {
    if ( this.bodies.length === 0 ) {
      // If bodies haven't been created, populate the bodies array
      // Earth's Position is x = 100, vy = 141.5
      super.setInitialBodyStates( [
        { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
        { mass: 10, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 100 ) }
      ] );
      this.updatePreviousModeInfo();
    }
    else {
      // Reset the orbiting body
      this.bodies.forEach( body => {
        body.reset();
      } );
      this.engine.reset();
    }
  }

  public override followCenterOfMass(): void {
    // This function is called on Common Model and shouldn't do anything in this screen
    // no-op
  }

  public visibilityReset(): void {
    // Calls reset only on the visibilityProperties to avoid reentries on selectedLawProperty
    // First Law
    this.axisVisibleProperty.reset();
    this.semiaxisVisibleProperty.reset();
    this.fociVisibleProperty.reset();
    this.eccentricityVisibleProperty.reset();
    this.stringsVisibleProperty.reset();

    // Second Law
    this.apoapsisVisibleProperty.reset();
    this.periapsisVisibleProperty.reset();
    this.sweepAreaVisibleProperty.reset();
    this.areaGraphVisibleProperty.reset();

    // Third Law
    this.semiMajorAxisVisibleProperty.reset();
    this.periodVisibleProperty.reset();
  }

  public override reset(): void {
    super.reset();
    this.selectedLawProperty.reset();
    this.periodDivisionProperty.reset();
    this.selectedAxisPowerProperty.reset();
    this.selectedPeriodPowerProperty.reset();
    this.alwaysCircularProperty.reset();

    this.visibilityReset();
    this.engine.updateAllowed = true;
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