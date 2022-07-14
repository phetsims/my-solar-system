// Copyright 2020-2022, University of Colorado Boulder

/**
 * Main model for Intro Screen in My Solar System.
 * In charge of keeping track of the position and states of the bodies,
 * their center of mass, and the time.
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

type IntroModelOptions = StrictOmit<CommonModelOptions, 'engineFactory' | 'isLab'>;

class IntroModel extends CommonModel {
  public constructor( providedOptions: IntroModelOptions ) {
    const options = optionize<IntroModelOptions, EmptyObjectType, CommonModelOptions>()( {
      engineFactory: bodies => new Engine( bodies ),
      isLab: false
    }, providedOptions );
    super( options );
  }

  public override createBodies(): void {
    // Clear out the bodies array and create N new random bodies
    this.bodies.clear();
    this.bodies.push( new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -6 ) ) );
    this.bodies.push( new Body( 10, new Vector2( 150, 0 ), new Vector2( 0, 120 ) ) );
  }
}

mySolarSystem.register( 'IntroModel', IntroModel );
export default IntroModel;