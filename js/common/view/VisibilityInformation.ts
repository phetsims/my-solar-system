// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Shape } from '../../../../kite/js/imports.js';
import { FlowBox, Text, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
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

const gridString = mySolarSystemStrings.grid;
const measuringTapeString = 'Measuring Tape';
const valuesString = 'Values';

// constants
const CHECKBOX_OPTIONS = {
  boxWidth: 14,
  checkboxColor: MySolarSystemColors.foregroundProperty,
  checkboxColorBackground: MySolarSystemColors.backgroundProperty
};
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const SPACING = 10;

type SelfOptions = {};

type VisibilityInformationOptions = SelfOptions & VBoxOptions;

class VisibilityInformation extends FlowBox {

  constructor( model: CommonModel, providedOptions?: VisibilityInformationOptions ) {

    const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.3 } );

    const children = [
      new Checkbox( new FlowBox( {
        spacing: 10,
        children: [
          new Text( gridString, TEXT_OPTIONS ),
          new MySolarSystemGridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
            stroke: MySolarSystemColors.gridIconStrokeColorProperty,
            lineWidth: 1.5
      } )
        ]
      } ), model.gridVisibleProperty, CHECKBOX_OPTIONS ),
      new Checkbox( new FlowBox( {
        spacing: 10,
        children: [
          new Text( measuringTapeString, TEXT_OPTIONS ),
          measuringTapeIcon
        ]
      } ), model.measuringTapeVisibleProperty, CHECKBOX_OPTIONS ),
      new Checkbox( new FlowBox( {
        spacing: 10,
        children: [
          new Text( valuesString, TEXT_OPTIONS )
        ]
      } ), model.valuesVisibleProperty, CHECKBOX_OPTIONS )
    ];

    // increase the touch area of the checkboxes
    const touchAreaHeight = 32;
    children.forEach( child => {
      const VisibilityInformation = child;
      const bounds = VisibilityInformation.parentToLocalBounds( VisibilityInformation.bounds );
      VisibilityInformation.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
    } );

    super( optionize<VisibilityInformationOptions, SelfOptions, FlowBox>()( {
      children: children,
      spacing: SPACING,
      orientation: 'vertical',
      align: 'left',
      stretch: true
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'VisibilityInformation', VisibilityInformation );
export default VisibilityInformation;