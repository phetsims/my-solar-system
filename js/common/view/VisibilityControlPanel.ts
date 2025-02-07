// Copyright 2022-2024, University of Colorado Boulder

/**
 * MySolarSystemControls is the main control panel, containing several checkboxes and a slider.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import GravityForceZoomControl from '../../../../solar-system-common/js/view/GravityForceZoomControl.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';
import MySolarSystemVisibleProperties from './MySolarSystemVisibleProperties.js';

export default class VisibilityControlPanel extends Panel {

  public constructor( model: MySolarSystemModel, visibleProperties: MySolarSystemVisibleProperties, tandem: Tandem ) {

    const content = new VBox( {
      children: [

        // 'Center of Mass' checkbox
        MySolarSystemCheckbox.createCenterOfMassCheckbox( visibleProperties.centerOfMassVisibleProperty, tandem.createTandem( 'centerOfMassCheckbox' ) ),

        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),

        // 'Speed', 'Velocity', and 'Gravity Force' checkboxes
        SolarSystemCommonCheckbox.createSpeedCheckbox( visibleProperties.speedVisibleProperty, tandem.createTandem( 'speedCheckbox' ) ),
        SolarSystemCommonCheckbox.createVelocityCheckbox( visibleProperties.velocityVisibleProperty, tandem.createTandem( 'velocityCheckbox' ) ),
        SolarSystemCommonCheckbox.createGravityForceCheckbox( visibleProperties.gravityVisibleProperty, tandem.createTandem( 'gravityForceCheckbox' ) ),

        // Gravity 'Zoom' control (labeled slider)
        new GravityForceZoomControl( model.gravityForceScalePowerProperty, visibleProperties.gravityVisibleProperty,
          tandem.createTandem( 'gravityForceZoomControl' ) ),

        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),

        // 'Path', 'Grid', and 'Measuring Tape' sliders
        MySolarSystemCheckbox.createPathCheckbox( visibleProperties.pathVisibleProperty, tandem.createTandem( 'pathCheckbox' ) ),
        SolarSystemCommonCheckbox.createGridCheckbox( visibleProperties.gridVisibleProperty, tandem.createTandem( 'gridCheckbox' ) ),
        SolarSystemCommonCheckbox.createMeasuringTapeCheckbox( visibleProperties.measuringTapeVisibleProperty, tandem.createTandem( 'measuringTapeCheckbox' ) )
      ],
      spacing: SolarSystemCommonConstants.VBOX_SPACING,
      align: 'left',
      stretch: true
    } );

    super( content, combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Control Panel',

      // phet-io
      tandem: tandem
    } ) );
  }
}

mySolarSystem.register( 'VisibilityControlPanel', VisibilityControlPanel );