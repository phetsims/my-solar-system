// Copyright 2020-2022, University of Colorado Boulder

/**
 * REVIEW: Would recommend replacing the author here
 * @author Sola Olateju
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemColors from '../common/MySolarSystemColors.js';
import mySolarSystem from '../mySolarSystem.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';
import IntroScreenIcon from './view/IntroScreenIcon.js';

class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      homeScreenIcon: new IntroScreenIcon(),
      backgroundColorProperty: MySolarSystemColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem,
      //REVIEW: Make this translatable!
      name: new Property( 'Intro' )
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