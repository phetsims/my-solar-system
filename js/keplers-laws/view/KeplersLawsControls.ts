// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import createArrowsVisibilityCheckboxes from '../../common/view/createArrowsVisibilityCheckboxes.js';
import createVisibilityInformationCheckboxes from '../../common/view/createVisibilityInformationCheckboxes.js';
import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsOrbitalInformation from './KeplersLawsOrbitalInformation.js';

class KeplersLawsControls extends Panel {
  public constructor( model: KeplersLawsModel, tandem: Tandem ) {
    super( new VBox( {
      children: [
        new KeplersLawsOrbitalInformation( model, {
          tandem: tandem
        } ),
        new HSeparator( MySolarSystemConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( model, tandem ),
        new HSeparator( MySolarSystemConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( model, tandem )
      ],
      spacing: 5,
      align: 'left',
      stretch: true
    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );
  }
}

mySolarSystem.register( 'KeplersLawsControls', KeplersLawsControls );
export default KeplersLawsControls;