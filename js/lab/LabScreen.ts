// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Agustín Vallejo
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemColors from '../common/MySolarSystemColors.js';
import mySolarSystem from '../mySolarSystem.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';
import LabScreenIcon from './view/LabScreenIcon.js';

class LabScreen extends Screen<LabModel, LabScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      homeScreenIcon: new LabScreenIcon(),
      backgroundColorProperty: MySolarSystemColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem,
      //REVIEW: make this translatable!
      name: new Property( 'Lab' )
    };

    super(
      () => new LabModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new LabScreenView( model, { tandem: tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

mySolarSystem.register( 'LabScreen', LabScreen );
export default LabScreen;