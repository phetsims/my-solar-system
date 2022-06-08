// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MySolarSystemGridNode from './MySolarSystemGridNode.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import CommonModel from '../model/CommonModel.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';

const gridString = mySolarSystemStrings.grid;
const measuringTapeString = 'Measuring Tape';
const valuesString = 'Values';

// constants
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const SPACING = 10;

type SelfOptions = {};

type VisibilityInformationOptions = SelfOptions & VBoxOptions;

class VisibilityInformation extends VBox {

  constructor( model: CommonModel, providedOptions?: VisibilityInformationOptions ) {

    const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.3 } );

    const children = [
      new MySolarSystemCheckbox( new HBox( {
        spacing: 10,
        children: [
          new Text( gridString, TEXT_OPTIONS ),
          new MySolarSystemGridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
            stroke: MySolarSystemColors.gridIconStrokeColorProperty,
            lineWidth: 1.5
      } )
        ]
      } ), model.gridVisibleProperty ),
      new MySolarSystemCheckbox( new HBox( {
        spacing: 10,
        children: [
          new Text( measuringTapeString, TEXT_OPTIONS ),
          measuringTapeIcon
        ]
      } ), model.measuringTapeVisibleProperty ),
      new MySolarSystemCheckbox( new HBox( {
        spacing: 10,
        children: [
          new Text( valuesString, TEXT_OPTIONS )
        ]
      } ), model.valuesVisibleProperty )
    ];

    super( optionize<VisibilityInformationOptions, SelfOptions, VBox>()( {
      children: children,
      spacing: SPACING,
      align: 'left',
      stretch: true
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'VisibilityInformation', VisibilityInformation );
export default VisibilityInformation;