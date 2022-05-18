// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 * 
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import IntroModel from '../model/IntroModel.js';
import CommonScreenView, { CommonScreenViewOptions } from '../../common/view/CommonScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';


type IntroScreenViewOptions = CommonScreenView;

class IntroScreenView extends CommonScreenView {
  constructor( model: IntroModel, tandem: Tandem ) {
    const options = optionize<IntroScreenViewOptions, {}, CommonScreenViewOptions>()( {
      tandem: tandem
    } );
    super( model, options );
  }
}

mySolarSystem.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;