// Copyright 2020-2023, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import IntroModel from '../model/IntroModel.js';
import MySolarSystemScreenView from '../../common/view/MySolarSystemScreenView.js';
import { Node } from '../../../../scenery/js/imports.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class IntroScreenView extends MySolarSystemScreenView {
  public constructor( model: IntroModel, tandem: Tandem ) {
    super( model, {
      tandem: tandem,
      screenSummaryContent: new IntroScreenViewSummaryContentNode()
    } );
  }
}

class IntroScreenViewSummaryContentNode extends Node {
  public constructor() {

    const playAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: MySolarSystemStrings.a11y.introScreen.screenSummary.playAreaDescriptionStringProperty
    } );
    const controlAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: MySolarSystemStrings.a11y.introScreen.screenSummary.controlAreaDescriptionStringProperty
    } );

    super( {
      children: [ playAreaDescriptionNode, controlAreaDescriptionNode ]
    } );
  }
}

mySolarSystem.register( 'IntroScreenView', IntroScreenView );