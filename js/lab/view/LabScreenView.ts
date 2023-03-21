// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen View for Lab Screen: Where you can play with all the presets and body configurations
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import LabModel from '../model/LabModel.js';
import MySolarSystemScreenView, { IntroLabScreenViewOptions } from '../../common/view/MySolarSystemScreenView.js';
import { Node } from '../../../../scenery/js/imports.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { IntroScreenViewOptions } from '../../intro/view/IntroScreenView.js';

type SelfOptions = EmptySelfOptions;
export type LabScreenViewOptions = IntroLabScreenViewOptions;

export default class LabScreenView extends MySolarSystemScreenView {
  public constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {

    const options = optionize<IntroScreenViewOptions, SelfOptions, IntroLabScreenViewOptions>()( {

      // pdom
      screenSummaryContent: new LabScreenViewSummaryContentNode()
    }, providedOptions );
    super( model, options );

    model.bodyAddedEmitter.addListener( () => {
      this.bodySoundManager.playBodyAddedSound( model.bodies.length - 1 );
    } );

    model.bodyRemovedEmitter.addListener( () => {
      this.bodySoundManager.playBodyRemovedSound( model.bodies.length - 1 );
    } );
  }
}

class LabScreenViewSummaryContentNode extends Node {
  public constructor() {

    const playAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: MySolarSystemStrings.a11y.labScreen.screenSummary.playAreaDescriptionStringProperty
    } );
    const controlAreaDescriptionNode = new Node( {
      tagName: 'p',
      innerContent: MySolarSystemStrings.a11y.labScreen.screenSummary.controlAreaDescriptionStringProperty
    } );

    super( {
      children: [ playAreaDescriptionNode, controlAreaDescriptionNode ]
    } );
  }
}

mySolarSystem.register( 'LabScreenView', LabScreenView );