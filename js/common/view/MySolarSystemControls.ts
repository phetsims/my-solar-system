// Copyright 2022-2023, University of Colorado Boulder

/**
 * MySolarSystemControls is the main control panel, containing several checkboxes and a slider.
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
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class MySolarSystemControls extends Panel {

  public constructor( model: MySolarSystemModel, tandem: Tandem ) {

    const content = new VBox( {
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
      stretch: true
    } );

    super( content, combineOptions<PanelOptions>( {

      //pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Control Panel',

      // phet-io
      tandem: tandem
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ) );
  }
}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );

