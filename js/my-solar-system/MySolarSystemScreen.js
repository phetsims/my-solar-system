// Copyright 2021, University of Colorado Boulder

/**
 * @author Sola Olateju.
 */

import Screen from '../../../joist/js/Screen.js';
import MySolarSystemColorProfile from '../common/MySolarSystemColorProfile.js';
import mySolarSystem from '../mySolarSystem.js';
import MySolarSystemModel from './model/MySolarSystemModel.js';
import MySolarSystemScreenView from './view/MySolarSystemScreenView.js';

class MySolarSystemScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: MySolarSystemColorProfile.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new MySolarSystemModel( tandem.createTandem( 'model' ) ),
      model => new MySolarSystemScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

mySolarSystem.register( 'MySolarSystemScreen', MySolarSystemScreen );
export default MySolarSystemScreen;