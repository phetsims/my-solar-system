// Copyright 2020-2022, University of Colorado Boulder

/**
 * Kepler's Laws Screen, where the user can learn about Kepler's Laws via an elliptical orbit
 *
 * @author Agustín Vallejo
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MySolarSystemColors from '../common/MySolarSystemColors.js';
import mySolarSystem from '../mySolarSystem.js';
import KeplersLawsModel from './model/KeplersLawsModel.js';
import KeplersLawsScreenView from './view/KeplersLawsScreenView.js';
import KeplersLawsScreenIcon from './view/KeplersLawsScreenIcon.js';
import MySolarSystemStrings from '../MySolarSystemStrings.js';

class KeplersLawsScreen extends Screen<KeplersLawsModel, KeplersLawsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      homeScreenIcon: new KeplersLawsScreenIcon(),
      backgroundColorProperty: MySolarSystemColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem,
      name: MySolarSystemStrings.screen.keplersLawsStringProperty
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