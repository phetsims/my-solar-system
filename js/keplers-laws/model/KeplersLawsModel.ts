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
import Engine from '../../common/model/Engine.js';
import CommonModel, { CommonModelOptions } from '../../common/model/CommonModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import Property from '../../../../axon/js/Property.js';

type KeplersLawsModelOptions = StrictOmit<CommonModelOptions, 'engineFactory' | 'isLab'>;

class KeplersLawsModel extends CommonModel {
  public apoapsisVisibleProperty: Property<boolean>;
  public periapsisVisibleProperty: Property<boolean>;
  public axisVisibleProperty: Property<boolean>;
 
  public areasVisibleProperty: Property<boolean>;
  public dotsVisibleProperty: Property<boolean>;
  public sweepAreaVisibleProperty: Property<boolean>;
  public areaGraphVisibleProperty: Property<boolean>;
  public periodDivisionProperty: Property<number>;
  public secondLawSelectedProperty: Property<boolean>;
  public thirdLawSelectedProperty: Property<boolean>;

  public separationProperty: Property<number>;

  constructor( providedOptions: KeplersLawsModelOptions ) {
    const options = optionize<KeplersLawsModelOptions, EmptyObjectType, CommonModelOptions>()( {
      engineFactory: bodies => new Engine( bodies ),
      isLab: false
    }, providedOptions );
    super( options );

    this.apoapsisVisibleProperty = new Property<boolean>( false );
    this.periapsisVisibleProperty = new Property<boolean>( false );
    this.axisVisibleProperty = new Property<boolean>( false );

    this.areasVisibleProperty = new Property<boolean>( false );
    this.dotsVisibleProperty = new Property<boolean>( false );
    this.sweepAreaVisibleProperty = new Property<boolean>( false );
    this.areaGraphVisibleProperty = new Property<boolean>( false );
    this.periodDivisionProperty = new Property<number>( 4 );
    this.secondLawSelectedProperty = new Property<boolean>( true );
    this.thirdLawSelectedProperty = new Property<boolean>( false );

    // TODO Turn thirdLawSelectedProperty into a DerivedProperty, the type errors scared me
    this.secondLawSelectedProperty.link( value => {
      this.thirdLawSelectedProperty.value = !value;
    } );

    this.separationProperty = new Property<number>( 150 );
    this.separationProperty.link( separation => {
      this.softReset();
      this.bodies[ 1 ].positionProperty.value = new Vector2( separation, 0 );
      // this.bodies[ 1 ].positionProperty.initialValue.x = separation;
    } );
  }

  createBodies(): void {
    // Clear out the bodies array and create N new random bodies
    this.bodies.clear();
    this.bodies.push( new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -6 ) ) );
    this.bodies.push( new Body( 10, new Vector2( 150, 0 ), new Vector2( 0, 120 ) ) );
  }

  softReset(): void {
    // Calls reset only on the super to avoid reentries on separationProperty
    super.reset();
  }

  override reset(): void {
    super.reset();
    this.separationProperty.reset();
  }
}

mySolarSystem.register( 'KeplersLawsModel', KeplersLawsModel );
export default KeplersLawsModel;