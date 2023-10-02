// Copyright 2023, University of Colorado Boulder

/**
 * LabModePanel is the panel that contains the combo box for selecting the LabMode - the desired configuration of bodies.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import LabModeComboBox from './LabModeComboBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import mySolarSystem from '../../mySolarSystem.js';
import LabMode from '../../../../solar-system-common/js/model/LabMode.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { Node } from '../../../../scenery/js/imports.js';

export default class LabModePanel extends Panel {

  public constructor( labModeProperty: Property<LabMode>, listboxParent: Node, tandem: Tandem ) {

    const labModeComboBox = new LabModeComboBox( labModeProperty, listboxParent, {
      widthSizable: false,
      layoutOptions: {
        align: 'center'
      },
      tandem: tandem.createTandem( 'labModeComboBox' ),
      phetioVisiblePropertyInstrumented: false // because this is the only control in the panel
    } );

    super( labModeComboBox, combineOptions<PanelOptions>( {
      tandem: tandem
    }, SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ) );
  }
}

mySolarSystem.register( 'LabModePanel', LabModePanel );