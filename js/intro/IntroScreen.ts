// Copyright 2020-2024, University of Colorado Boulder

/**
 * Intro Screen, where the user can learn about a two-body system
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemKeyboardHelpContent from '../common/view/MySolarSystemKeyboardHelpContent.js';
import mySolarSystem from '../mySolarSystem.js';
import MySolarSystemStrings from '../MySolarSystemStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenIcon from './view/IntroScreenIcon.js';
import IntroScreenView from './view/IntroScreenView.js';

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      homeScreenIcon: new IntroScreenIcon(),
      backgroundColorProperty: SolarSystemCommonColors.backgroundProperty,
      tandem: tandem,
      name: MySolarSystemStrings.screen.introStringProperty,
      createKeyboardHelpNode: () => new MySolarSystemKeyboardHelpContent()
    };

    super(
      () => new IntroModel( tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

mySolarSystem.register( 'IntroScreen', IntroScreen );