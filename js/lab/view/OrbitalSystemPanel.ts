// Copyright 2023, University of Colorado Boulder

/**
 * OrbitalSystemPanel is the panel that contains the combo box for selecting an OrbitalSystem (configuration of bodies).
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import OrbitalSystemComboBox from './OrbitalSystemComboBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import mySolarSystem from '../../mySolarSystem.js';
import OrbitalSystem from '../model/OrbitalSystem.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import { Node } from '../../../../scenery/js/imports.js';

export default class OrbitalSystemPanel extends Panel {

  public constructor( orbitalSystemProperty: Property<OrbitalSystem>, listboxParent: Node, tandem: Tandem ) {

    const orbitalSystemComboBox = new OrbitalSystemComboBox( orbitalSystemProperty, listboxParent, {
      widthSizable: false,
      layoutOptions: {
        align: 'center'
      },
      tandem: tandem.createTandem( 'orbitalSystemComboBox' ),
      phetioVisiblePropertyInstrumented: false // because this is the only control in the panel
    } );

    super( orbitalSystemComboBox, combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

mySolarSystem.register( 'OrbitalSystemPanel', OrbitalSystemPanel );