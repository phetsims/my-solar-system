// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Sola Olateju
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemColors from '../common/MySolarSystemColors.js';
import mySolarSystem from '../mySolarSystem.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  constructor( tandem: Tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: MySolarSystemColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem,
      name: 'Intro'
    };

    super(
      () => new IntroModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

mySolarSystem.register( 'IntroScreen', IntroScreen );
export default IntroScreen;