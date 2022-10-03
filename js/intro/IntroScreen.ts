// Copyright 2020-2022, University of Colorado Boulder

/**
 * Intro Screen, where the user can learn about a two-body system
 *
 * @author Agustín Vallejo
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemColors from '../common/MySolarSystemColors.js';
import mySolarSystem from '../mySolarSystem.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';
import IntroScreenIcon from './view/IntroScreenIcon.js';
import MySolarSystemStrings from '../MySolarSystemStrings.js';

class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      homeScreenIcon: new IntroScreenIcon(),
      backgroundColorProperty: MySolarSystemColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem,
      name: MySolarSystemStrings.screen.introStringProperty
    };

    super(
      () => new IntroModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new IntroScreenView( model, { tandem: tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

mySolarSystem.register( 'IntroScreen', IntroScreen );
export default IntroScreen;