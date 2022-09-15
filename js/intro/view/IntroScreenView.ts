// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import IntroModel from '../model/IntroModel.js';
import IntroLabScreenView, { IntroLabScreenViewOptions } from '../../common/view/IntroLabScreenView.js';

export type IntroScreenViewOptions = IntroLabScreenViewOptions;

class IntroScreenView extends IntroLabScreenView {
  public constructor( model: IntroModel, providedOptions: IntroScreenViewOptions ) {
    super( model, providedOptions );
  }
}

mySolarSystem.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;