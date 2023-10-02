// Copyright 2022-2023, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import createOrbitalInformationCheckboxes from './createOrbitalInformationCheckboxes.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import GravityScaleSlider from '../../../../solar-system-common/js/view/GravityScaleSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class MySolarSystemControls extends VBox {

  public constructor( model: MySolarSystemModel, tandem: Tandem ) {
    super( {
      children: [
        ...createOrbitalInformationCheckboxes( model, tandem ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( model, tandem ),
        new GravityScaleSlider( model.forceScaleProperty, model.gravityVisibleProperty ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( model, tandem )
      ],
      spacing: SolarSystemCommonConstants.CHECKBOX_SPACING,
      align: 'left',
      stretch: true,

      //pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Control Panel',

      tandem: tandem
    } );
  }
}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );

