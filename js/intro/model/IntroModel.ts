// Copyright 2020-2024, University of Colorado Boulder

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
import Vector2 from '../../../../dot/js/Vector2.js';
import BodyInfo from '../../../../solar-system-common/js/model/BodyInfo.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';


export default class IntroModel extends MySolarSystemModel {

  public constructor( tandem: Tandem ) {
    super( {
      // MySolarSystemModelOptions
      defaultBodyInfo: [
        new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -2.3446 ) } ),
        new BodyInfo( { isActive: true, mass: 25, position: new Vector2( 2.00, 0 ), velocity: new Vector2( 0, 23.4457 ) } )
      ],
      bodyColors: [
        MySolarSystemColors.body1ColorProperty,
        MySolarSystemColors.body2ColorProperty
      ],
      tandem: tandem
    } );
  }
}

mySolarSystem.register( 'IntroModel', IntroModel );