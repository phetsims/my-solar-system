// Copyright 2020-2022, University of Colorado Boulder

/**
 * REVIEW: Would recommend replacing the author here
 * @author Sola Olateju
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemColors from '../common/MySolarSystemColors.js';
import mySolarSystem from '../mySolarSystem.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      //REVIEW: Make an issue for screen icons?
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: MySolarSystemColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem,
      //REVIEW: Make this translatable!
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