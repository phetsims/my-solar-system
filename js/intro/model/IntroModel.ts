// Copyright 2020-2023, University of Colorado Boulder

/**
 * Main model for Intro Screen in My Solar System.
 * In charge of keeping track of the position and states of the bodies,
 * their center of mass, and the time.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemModel from '../../common/model/MySolarSystemModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';


export default class IntroModel extends MySolarSystemModel {

  public constructor( tandem: Tandem ) {
    super( {
      // MySolarSystemModelOptions
      tandem: tandem
    } );
  }
}

mySolarSystem.register( 'IntroModel', IntroModel );
