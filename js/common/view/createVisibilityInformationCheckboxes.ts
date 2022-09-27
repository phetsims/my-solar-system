// Copyright 2022, University of Colorado Boulder


//REVIEW: Sometimes there are extra blank lines above the top documentation and under the copyright header.
//REVIEW: Prefer just one blank line between the copyright header and the top documentation.
/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, Text } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import MySolarSystemGridNode from './MySolarSystemGridNode.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import CommonModel from '../model/CommonModel.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const createVisibilityInformationCheckboxes = ( model: CommonModel, tandem: Tandem ): MySolarSystemCheckbox[] => {

  const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.3 } );

  return [
    new MySolarSystemCheckbox( model.gridVisibleProperty, new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.gridStringProperty, TEXT_OPTIONS ),
        //REVIEW: Usually prefer Vector2.ZERO to new Vector2( 0, 0 ) - it's a bit easier, and doesn't create a new vector
        new MySolarSystemGridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
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
    } ),
    //REVIEW: Is this HBox here for consistency? This HBox probably doesn't need to exist
    new MySolarSystemCheckbox( model.valuesVisibleProperty, new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.valuesStringProperty, TEXT_OPTIONS )
      ]
    } ), {
      tandem: tandem.createTandem( 'valuesVisibleCheckbox' )
    } )
  ];
};

mySolarSystem.register( 'createVisibilityInformationCheckboxes', createVisibilityInformationCheckboxes );
export default createVisibilityInformationCheckboxes;