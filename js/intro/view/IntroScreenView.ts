// Copyright 2020-2023, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import IntroModel from '../model/IntroModel.js';
import MySolarSystemScreenView, { IntroLabScreenViewOptions } from '../../common/view/MySolarSystemScreenView.js';

export type IntroScreenViewOptions = IntroLabScreenViewOptions;

class IntroScreenView extends MySolarSystemScreenView {
  public constructor( model: IntroModel, providedOptions: IntroScreenViewOptions ) {
    super( model, providedOptions );
  }
}

mySolarSystem.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;