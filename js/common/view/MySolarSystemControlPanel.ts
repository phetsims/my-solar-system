// Copyright 2022-2023, University of Colorado Boulder

/**
 * MySolarSystemControls is the main control panel, containing several checkboxes and a slider.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { HBox, HSeparator, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import GravityScaleSlider from '../../../../solar-system-common/js/view/GravityScaleSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import VisibleProperties from '../../../../solar-system-common/js/view/VisibleProperties.js';

const TEXT_OPTIONS = combineOptions<TextOptions>( {}, SolarSystemCommonConstants.TEXT_OPTIONS, {
  maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
} );

export default class MySolarSystemControlPanel extends Panel {

  public constructor( model: MySolarSystemModel, visibleProperties: VisibleProperties, tandem: Tandem ) {

    const centerOfMassCheckbox = new SolarSystemCommonCheckbox( model.centerOfMass.visibleProperty, new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.centerOfMassStringProperty, TEXT_OPTIONS ),
        new XNode( {
          fill: 'red',
          stroke: SolarSystemCommonColors.foregroundProperty,
          scale: 0.5
        } )
      ]
    } ), {
      tandem: tandem.createTandem( 'centerOfMassCheckbox' ),
      accessibleName: MySolarSystemStrings.centerOfMassStringProperty
    } );

    const content = new VBox( {
      children: [
        centerOfMassCheckbox,
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( visibleProperties, tandem ),
        new GravityScaleSlider( model.forceScaleProperty, visibleProperties.gravityVisibleProperty ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( visibleProperties, model.pathVisibleProperty, tandem )
      ],
      spacing: SolarSystemCommonConstants.CHECKBOX_SPACING,
      align: 'left',
      stretch: true
    } );

    super( content, combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS, {

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Control Panel',

      // phet-io
      tandem: tandem
    } ) );
  }
}

mySolarSystem.register( 'MySolarSystemControlPanel', MySolarSystemControlPanel );

