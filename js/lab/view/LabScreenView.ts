// Copyright 2022-2024, University of Colorado Boulder

/**
 * Screen View for Lab Screen: Where you can play with all the presets and body configurations
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MySolarSystemScreenView from '../../common/view/MySolarSystemScreenView.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import LabModel from '../model/LabModel.js';
import OrbitalSystemPanel from './OrbitalSystemPanel.js';

export default class LabScreenView extends MySolarSystemScreenView {
  public constructor( model: LabModel, tandem: Tandem ) {

    super( model, {
      tandem: tandem,
      screenSummaryContent: new ScreenSummaryContent( [
        MySolarSystemStrings.a11y.labScreen.screenSummary.playAreaDescriptionStringProperty,
        MySolarSystemStrings.a11y.labScreen.screenSummary.controlAreaDescriptionStringProperty
      ] )
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

mySolarSystem.register( 'LabScreenView', LabScreenView );