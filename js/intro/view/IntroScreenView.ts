// Copyright 2020-2024, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MySolarSystemScreenView from '../../common/view/MySolarSystemScreenView.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import IntroModel from '../model/IntroModel.js';

export default class IntroScreenView extends MySolarSystemScreenView {
  public constructor( model: IntroModel, tandem: Tandem ) {
    super( model, {
      tandem: tandem,
      screenSummaryContent: new ScreenSummaryContent( [
        MySolarSystemStrings.a11y.introScreen.screenSummary.playAreaDescriptionStringProperty,
        MySolarSystemStrings.a11y.introScreen.screenSummary.controlAreaDescriptionStringProperty
      ] )
    } );
  }
}

mySolarSystem.register( 'IntroScreenView', IntroScreenView );