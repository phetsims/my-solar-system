// Copyright 2022-2023, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, Text, TextOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import GridNode from '../../../../scenery-phet/js/GridNode.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import CommonModel from '../model/CommonModel.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

// constants
const TEXT_OPTIONS = combineOptions<TextOptions>( {
  maxWidth: 200
}, MySolarSystemConstants.TEXT_OPTIONS );

const createVisibilityInformationCheckboxes = ( model: CommonModel, tandem: Tandem ): MySolarSystemCheckbox[] => {

  const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.3 } );

  return [
    new MySolarSystemCheckbox( model.gridVisibleProperty, new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.gridStringProperty, TEXT_OPTIONS ),
        new GridNode( new Property( ModelViewTransform2.createIdentity() ), 10, Vector2.ZERO, 1, {
          stroke: MySolarSystemColors.gridIconStrokeColorProperty,
          lineWidth: 1.5
        } )
      ]
    } ), {
      tandem: tandem.createTandem( 'gridVisibleCheckbox' )
    } ),
    new MySolarSystemCheckbox( model.measuringTapeVisibleProperty, new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.measuringTapeStringProperty, TEXT_OPTIONS ),
        measuringTapeIcon
      ]
    } ), {
      tandem: tandem.createTandem( 'measuringTapeVisibleCheckbox' )
    } )
  ];
};

mySolarSystem.register( 'createVisibilityInformationCheckboxes', createVisibilityInformationCheckboxes );
export default createVisibilityInformationCheckboxes;