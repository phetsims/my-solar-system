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
import Property from '../../../../axon/js/Property.js';
import LawMode from './LawMode.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import EllipticalOrbit from './EllipticalOrbit.js';
import { EmptyEngine } from '../../common/model/Engine.js';

type KeplersLawsModelOptions = StrictOmit<CommonModelOptions, 'engineFactory' | 'isLab'>;

class KeplersLawsModel extends CommonModel {
  public readonly selectedLawProperty = new EnumerationProperty( LawMode.SECOND_LAW );
  public readonly orbit: EllipticalOrbit;

  public apoapsisVisibleProperty = new Property<boolean>( false );
  public periapsisVisibleProperty = new Property<boolean>( false );
  public axisVisibleProperty = new Property<boolean>( false );
 
  public areasVisibleProperty = new Property<boolean>( false );
  public dotsVisibleProperty = new Property<boolean>( false );
  public sweepAreaVisibleProperty = new Property<boolean>( false );
  public areaGraphVisibleProperty = new Property<boolean>( false );
  public periodDivisionProperty = new Property<number>( 4 );
  
  public separationProperty = new Property<number>( 150 );

  public constructor( providedOptions: KeplersLawsModelOptions ) {
    const options = optionize<KeplersLawsModelOptions, EmptySelfOptions, CommonModelOptions>()( {
      engineFactory: bodies => new EmptyEngine( bodies ),
      isLab: false
    }, providedOptions );
    super( options );
    
    // TODO: How is the memory handled in this case?
    this.orbit = new EllipticalOrbit( this.bodies );
    this.engine = this.orbit; // Is this a copy or a reference? Hopefully a reference

    this.separationProperty.link( separation => {
      this.softReset();
      this.bodies[ 1 ].positionProperty.value = new Vector2( separation, 0 );
      // this.bodies[ 1 ].positionProperty.initialValue.x = separation;
    } );
  }

  public override createBodies(): void {
    // Clear out the bodies array and create N new random bodies
    this.bodies.clear();
    this.bodies.push( new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -6 ) ) );
    this.bodies.push( new Body( 10, new Vector2( 150, 0 ), new Vector2( 0, 120 ) ) );
  }

  public softReset(): void {
    // Calls reset only on the super to avoid reentries on separationProperty
    super.reset();
  }

  public override reset(): void {
    super.reset();
    this.selectedLawProperty.reset();
    this.apoapsisVisibleProperty.reset();
    this.periapsisVisibleProperty.reset();
    this.axisVisibleProperty.reset();
    this.areasVisibleProperty.reset();
    this.dotsVisibleProperty.reset();
    this.sweepAreaVisibleProperty.reset();
    this.areaGraphVisibleProperty.reset();
    this.periodDivisionProperty.reset();
    this.separationProperty.reset();
  }
}

mySolarSystem.register( 'KeplersLawsModel', KeplersLawsModel );
export default KeplersLawsModel;