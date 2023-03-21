// Copyright 2022-2023, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { HBox, Text, TextOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';

// constants
const TEXT_OPTIONS = combineOptions<TextOptions>( {
  maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
}, SolarSystemCommonConstants.TEXT_OPTIONS );

const createOrbitalInformationCheckboxes = ( model: MySolarSystemModel, tandem: Tandem ): SolarSystemCommonCheckbox[] => {

  return [
    new SolarSystemCommonCheckbox( model.centerOfMass.visibleProperty, new HBox( {
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
      tandem: tandem.createTandem( 'centerOfMassVisibleCheckbox' ),
      accessibleName: MySolarSystemStrings.centerOfMassStringProperty
    } )
  ];
};

export default createOrbitalInformationCheckboxes;
mySolarSystem.register( 'createOrbitalInformationCheckboxes', createOrbitalInformationCheckboxes );