// Copyright 2022, University of Colorado Boulder

/**
 * The model in charge of the Kepler's Laws Screen components.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Body from '../../common/model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CommonModel, { CommonModelOptions } from '../../common/model/CommonModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import LawMode from './LawMode.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import EllipticalOrbit from './EllipticalOrbit.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';

type SuperTypeOptions = CommonModelOptions<EllipticalOrbit>;

type KeplersLawsModelOptions = StrictOmit<SuperTypeOptions, 'engineFactory' | 'isLab'>;

class KeplersLawsModel extends CommonModel<EllipticalOrbit> {
  public readonly selectedLawProperty = new EnumerationProperty( LawMode.SECOND_LAW );

  // Second Law properties
  public axisVisibleProperty = new BooleanProperty( false );
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
    } );

    this.periodDivisionProperty.link( divisions => {
        this.engine.periodDivisions = divisions;
        this.engine.update();
      } );

    this.engine.orbitalAreas.forEach( ( area, index ) => {
      area.insideProperty.link( inside => {
        if ( inside && this.isPlayingProperty.value ) {
          const soundIndex = this.engine.retrograde ? this.periodDivisionProperty.value - index - 1 : index;
          this.bodySoundManager.playOrbitalMetronome( soundIndex );
        }
      } );
    } );

    this.bodies.forEach( body => {
      body.userControlledPositionProperty.link( positionBeingDragged => {
        if ( positionBeingDragged ) {
          this.isPlayingProperty.value = false;
        }
      } );
    } );

    this.timeScale = 0.3;

    this.zoomLevelProperty.setInitialValue( 2 );
    this.zoomLevelProperty.value = 2;
  }

  public override setInitialBodyStates(): void {
    if ( this.bodies.length === 0 ) {
      // If bodies haven't been created, populate the bodies array
      this.bodies.add( new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, 0 ), MySolarSystemColors.firstBodyColorProperty ) );
      this.bodies.add( new Body( 10, new Vector2( 200, 0 ), new Vector2( 0, 110 ), MySolarSystemColors.secondBodyColorProperty ) );
    }
    else {
      // Reset the orbiting body
      this.bodies[ 1 ].reset();
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
  }

  public override update(): void {
    if ( this.engine.updateAllowed ) {
      this.engine.update();
    }
  }
}

mySolarSystem.register( 'KeplersLawsModel', KeplersLawsModel );
export default KeplersLawsModel;