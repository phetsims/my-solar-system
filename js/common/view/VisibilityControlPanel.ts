// Copyright 2022-2023, University of Colorado Boulder

/**
 * MySolarSystemControls is the main control panel, containing several checkboxes and a slider.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { HSeparator, VBox } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import GravityZoomControl from '../../../../solar-system-common/js/view/GravityZoomControl.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
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
        new GravityZoomControl( model.forceScaleProperty, visibleProperties.gravityVisibleProperty,
          tandem.createTandem( 'gravityZoomControl' ) ),

        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),

        // 'Path', 'Grid', and 'Measuring Tape' sliders
        MySolarSystemCheckbox.createPathCheckbox( visibleProperties.pathVisibleProperty, tandem.createTandem( 'pathCheckbox' ) ),
        SolarSystemCommonCheckbox.createGridCheckbox( visibleProperties.gridVisibleProperty, tandem.createTandem( 'gridCheckbox' ) ),
        SolarSystemCommonCheckbox.createMeasuringTapeCheckbox( visibleProperties.measuringTapeVisibleProperty, tandem.createTandem( 'measuringTapeCheckbox' ) )
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

mySolarSystem.register( 'VisibilityControlPanel', VisibilityControlPanel );

