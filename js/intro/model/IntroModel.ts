// Copyright 2020-2023, University of Colorado Boulder

/**
 * Main model for Intro Screen in My Solar System.
 * In charge of keeping track of the position and states of the bodies,
 * their center of mass, and the time.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumericalEngine from '../../common/model/NumericalEngine.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MySolarSystemModel, { MySolarSystemModelOptions } from '../../common/model/MySolarSystemModel.js';

type SuperTypeOptions = MySolarSystemModelOptions;

export type IntroModelOptions = StrictOmit<SuperTypeOptions, 'engineFactory' | 'isLab'>;

export default class IntroModel extends MySolarSystemModel {
  public constructor( providedOptions: IntroModelOptions ) {
    const options = optionize<IntroModelOptions, EmptySelfOptions, SuperTypeOptions>()( {
      engineFactory: bodies => new NumericalEngine( bodies ),
      isLab: false
    }, providedOptions );
    super( options );
  }

  public override reset(): void {
    super.reset();
    this.loadBodyStates( [
      { active: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -11.1 ) },
      { active: true, mass: 25, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 111 ) }
    ] );
  }
}

mySolarSystem.register( 'IntroModel', IntroModel );
