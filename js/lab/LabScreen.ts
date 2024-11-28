// Copyright 2020-2024, University of Colorado Boulder

/**
 * Screen for Lab Screen, where the user can create their own system
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemKeyboardHelpContent from '../common/view/MySolarSystemKeyboardHelpContent.js';
import mySolarSystem from '../mySolarSystem.js';
import MySolarSystemStrings from '../MySolarSystemStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenIcon from './view/LabScreenIcon.js';
import LabScreenView from './view/LabScreenView.js';

export default class LabScreen extends Screen<LabModel, LabScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      homeScreenIcon: new LabScreenIcon(),
      backgroundColorProperty: SolarSystemCommonColors.backgroundProperty,
      tandem: tandem,
      name: MySolarSystemStrings.screen.labStringProperty,
      createKeyboardHelpNode: () => new MySolarSystemKeyboardHelpContent( true /* hasComboBoxHelp */ )
    };

    super(
      () => new LabModel( tandem.createTandem( 'model' ) ),
      model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

mySolarSystem.register( 'LabScreen', LabScreen );