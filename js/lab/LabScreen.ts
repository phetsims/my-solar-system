// Copyright 2020-2023, University of Colorado Boulder

/**
 * Screen for Lab Screen, where the user can create their own system
 *
 * @author Agustín Vallejo
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import SolarSystemCommonColors from '../../../solar-system-common/js/SolarSystemCommonColors.js';
import mySolarSystem from '../mySolarSystem.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';
import LabScreenIcon from './view/LabScreenIcon.js';
import MySolarSystemStrings from '../MySolarSystemStrings.js';
import BasicActionsKeyboardHelpSection from '../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';

export default class LabScreen extends Screen<LabModel, LabScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      homeScreenIcon: new LabScreenIcon(),
      backgroundColorProperty: SolarSystemCommonColors.backgroundProperty,
      tandem: tandem,
      name: MySolarSystemStrings.screen.labStringProperty,
      createKeyboardHelpNode: () => {
        return new BasicActionsKeyboardHelpSection( {
          withCheckboxContent: true,
          withDraggableContent: true,
          withKeypadContent: true
        } );
      }
    };

    super(
      () => new LabModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new LabScreenView( model, { tandem: tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

mySolarSystem.register( 'LabScreen', LabScreen );