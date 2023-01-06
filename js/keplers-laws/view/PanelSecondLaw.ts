// Copyright 2022-2023, University of Colorado Boulder

/**
 * Kepler's second law panel control: Swept area
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { AlignBox, HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Panel from '../../../../sun/js/Panel.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

export default class PanelSecondLaw extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const divisionsRange = new RangeWithValue( 2, model.maxDivisionValue, 4 );
    const divisionSlider = new HSlider( model.periodDivisionProperty, divisionsRange, {
      trackSize: new Dimension2( 150, 2 ),
      thumbSize: new Dimension2( 15, 25 ),
      thumbCenterLineStroke: 'white',
      trackFillEnabled: 'white',
      majorTickStroke: 'white',
      majorTickLength: 10,
      minorTickStroke: 'white',
      minorTickLength: 6,

      // Demonstrate larger x dilation.
      thumbTouchAreaXDilation: 30,
      thumbTouchAreaYDilation: 15,
      thumbMouseAreaXDilation: 10,
      thumbMouseAreaYDilation: 5,

      visibleProperty: model.dotsVisibleProperty,

      constrainValue: value => Utils.roundSymmetric( value )
    } );

    divisionSlider.addMajorTick( divisionsRange.min, new Text( divisionsRange.min, TEXT_OPTIONS ) );
    divisionSlider.addMajorTick( divisionsRange.min + 0.50 * divisionsRange.getLength() );
    divisionSlider.addMajorTick( divisionsRange.max, new Text( divisionsRange.max, TEXT_OPTIONS ) );

    // minor ticks
    divisionSlider.addMinorTick( divisionsRange.min + 0.25 * divisionsRange.getLength() );
    divisionSlider.addMinorTick( divisionsRange.min + 0.75 * divisionsRange.getLength() );

    super( new VBox( {
      children: [
        new HBox( {
          children: [
            new Text( MySolarSystemStrings.area.periodDivisionStringProperty, TEXT_OPTIONS ),
            new NumberDisplay( model.periodDivisionProperty, divisionsRange, {
              maxWidth: 40
            } )
          ],
          margin: 4,
          visibleProperty: model.dotsVisibleProperty
        } ),
        divisionSlider,
        new Checkbox( model.sweepAreaVisibleProperty, new Text( MySolarSystemStrings.area.sweptAreaStringProperty, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new AlignBox(
          new Checkbox( model.areaGraphVisibleProperty, new Text( MySolarSystemStrings.area.areaGraphStringProperty, TEXT_OPTIONS ),
            combineOptions<CheckboxOptions>( {
              enabledProperty: model.sweepAreaVisibleProperty
            }, MySolarSystemConstants.CHECKBOX_OPTIONS ) ), {
            leftMargin: 20
          } )
      ],
      spacing: 10,
      align: 'left',
      stretch: true
    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );
  }
}

mySolarSystem.register( 'PanelSecondLaw', PanelSecondLaw );