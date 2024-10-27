// Copyright 2020-2023, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import IntroModel from '../model/IntroModel.js';
import MySolarSystemScreenView from '../../common/view/MySolarSystemScreenView.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';

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