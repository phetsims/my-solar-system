// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import OmitStrict from '../../../../phet-core/js/types/OmitStrict.js';
import Body from '../../common/model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Engine from '../../common/model/Engine.js';
import CommonModel, { CommonModelOptions } from '../../common/model/CommonModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';

type KeplersLawsModelOptions = OmitStrict<CommonModelOptions, 'engineFactory' | 'isLab'>;

class KeplersLawsModel extends CommonModel {
  apoapsisVisibleProperty: Property<boolean>;
  periapsisVisibleProperty: Property<boolean>;
  axisVisibleProperty: Property<boolean>;

  areasVisibleProperty: Property<boolean>;
  dotsVisibleProperty: Property<boolean>;
  sweepAreaVisibleProperty: Property<boolean>;
  areaGraphVisibleProperty: Property<boolean>;
  periodDivisionProperty: Property<number>;

  constructor( providedOptions: KeplersLawsModelOptions ) {
    const options = optionize<KeplersLawsModelOptions, {}, CommonModelOptions>()( {
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
  }

  createBodies(): void {
    // Clear out the bodies array and create N new random bodies
    this.bodies.clear();
    this.bodies.push( new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -6 ) ) );
    this.bodies.push( new Body( 10, new Vector2( 150, 0 ), new Vector2( 0, 120 ) ) );
  }
}

mySolarSystem.register( 'KeplersLawsModel', KeplersLawsModel );
export default KeplersLawsModel;