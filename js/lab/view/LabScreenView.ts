// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen View for Lab Screen: Where you can play with all the presets and body configurations
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import LabModel from '../model/LabModel.js';
import MySolarSystemScreenView from '../../common/view/MySolarSystemScreenView.js';
import { Node } from '../../../../scenery/js/imports.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import OrbitalSystemPanel from './OrbitalSystemPanel.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

export default class LabScreenView extends MySolarSystemScreenView {
  public constructor( model: LabModel, tandem: Tandem ) {

    super( model, {
      tandem: tandem,
      screenSummaryContent: new LabScreenViewSummaryContentNode()
    } );

    // Add a panel at the top left for selecting the orbital system.
    // Put that panel at the beginning of the PDOM order for interfaceLayer.
    const orbitalSystemPanel = new OrbitalSystemPanel( model.orbitalSystemProperty, this.topLayer, this.panelsTandem.createTandem( 'orbitalSystemPanel' ) );
    this.topRightVBox.insertChild( 0, orbitalSystemPanel );
    this.interfaceLayer.pdomOrder = [ orbitalSystemPanel, ...this.interfaceLayer.pdomOrder! ];

    model.activeBodies.addItemAddedListener( () => {

      // Skip this when restoring PhET-iO state, because the contents of activeBodies may be restored before its
      // lengthProperty. See https://github.com/phetsims/my-solar-system/issues/290.
      if ( !isSettingPhetioStateProperty.value && model.changingNumberOfBodies ) {
          this.bodySoundManager.playBodyAddedSound( model.activeBodies.length );
      }
    } );

    model.activeBodies.addItemRemovedListener( () => {

      // Skip this when restoring PhET-iO state, because the contents of activeBodies may be restored before its
      // lengthProperty. See https://github.com/phetsims/my-solar-system/issues/290.
      if ( !isSettingPhetioStateProperty.value && model.changingNumberOfBodies ) {
          this.bodySoundManager.playBodyRemovedSound( model.activeBodies.length );
      }
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