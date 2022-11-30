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
import CommonModel, { CommonModelOptions } from '../../common/model/CommonModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumericalEngine from '../../common/model/NumericalEngine.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SuperTypeOptions = CommonModelOptions<NumericalEngine>;

export type IntroModelOptions = StrictOmit<SuperTypeOptions, 'engineFactory' | 'isLab'>;

class IntroModel extends CommonModel<NumericalEngine> {
  public constructor( providedOptions: IntroModelOptions ) {
    const options = optionize<IntroModelOptions, EmptySelfOptions, SuperTypeOptions>()( {
      engineFactory: bodies => new NumericalEngine( bodies ),
      isLab: false
    }, providedOptions );
    super( options );
  }

  public override reset(): void {
    super.reset();

    const IntroDefaultModeInfo = [
      { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -5 ) },
      { mass: 10, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 100 ) }
    ];
    this.setInitialBodyStates( IntroDefaultModeInfo );
  }
}

mySolarSystem.register( 'IntroModel', IntroModel );
export default IntroModel;