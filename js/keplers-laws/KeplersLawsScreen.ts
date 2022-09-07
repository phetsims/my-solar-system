// Copyright 2020-2022, University of Colorado Boulder

/**
 * REVIEW: Would recommend replacing the author here
 * @author Sola Olateju
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemColors from '../common/MySolarSystemColors.js';
import mySolarSystem from '../mySolarSystem.js';
import KeplersLawsModel from './model/KeplersLawsModel.js';
import KeplersLawsScreenView from './view/KeplersLawsScreenView.js';

class KeplersLawsScreen extends Screen<KeplersLawsModel, KeplersLawsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: MySolarSystemColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem,
      name: 'Kepler\'s Laws'
    };

    super(
      () => new KeplersLawsModel( { tandem: tandem.createTandem( 'model' ) } ),
      model => new KeplersLawsScreenView( model, { tandem: tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

mySolarSystem.register( 'KeplersLawsScreen', KeplersLawsScreen );
export default KeplersLawsScreen;