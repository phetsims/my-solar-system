// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Sola Olateju
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemColors from '../common/MySolarSystemColors.js';
import mySolarSystem from '../mySolarSystem.js';
import MySolarSystemModel from './model/MySolarSystemModel.js';
import MySolarSystemScreenView from './view/MySolarSystemScreenView.js';

class MySolarSystemScreen extends Screen<MySolarSystemModel, MySolarSystemScreenView> {

  constructor( tandem: Tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: MySolarSystemColors.SCREEN_VIEW_BACKGROUND,
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