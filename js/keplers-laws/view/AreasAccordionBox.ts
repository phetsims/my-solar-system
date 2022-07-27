// Copyright 2022, University of Colorado Boulder

/**
 * Kepler's second law panel control: Swept area
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { FlowBox, HBox, Text, VDivider } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const dotsString = 'Dots';
const sweepArea = 'Swept Area';
const areaGraphString = 'Area Graph';
const periodDivisionString = 'Period Divisions';

type AreasAccordionBoxOptions = AccordionBoxOptions;

export default class AreasAccordionBox extends AccordionBox {
  public constructor( model: KeplersLawsModel, providedOptions?: AreasAccordionBoxOptions ) {
    const options = combineOptions<AreasAccordionBoxOptions>( {
      titleNode: new Text( 'Area', TITLE_OPTIONS ),
      expandedProperty: model.areasVisibleProperty,
      buttonXMargin: 5,
      buttonYMargin: 5,
      fill: MySolarSystemColors.backgroundProperty,
      stroke: MySolarSystemColors.gridIconStrokeColorProperty
    }, providedOptions );

    super( new AreasControls( model ), options );
  }
}

class AreasControls extends FlowBox {
  public constructor( model: KeplersLawsModel ) {
    const divisionsRange = new RangeWithValue( 2, 10, 4 );
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
      thumbMouseAreaYDilation: 5
    } );

    divisionSlider.addMajorTick( divisionsRange.min, new Text( divisionsRange.min, TEXT_OPTIONS ) );
    divisionSlider.addMajorTick( divisionsRange.min + 0.50 * divisionsRange.getLength() );
    divisionSlider.addMajorTick( divisionsRange.max, new Text( divisionsRange.max, TEXT_OPTIONS ) );

    // minor ticks
    divisionSlider.addMinorTick( divisionsRange.min + 0.25 * divisionsRange.getLength() );
    divisionSlider.addMinorTick( divisionsRange.min + 0.75 * divisionsRange.getLength() );

    super( {
      children: [
        new Checkbox( model.dotsVisibleProperty, new Text( dotsString, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new Checkbox( model.sweepAreaVisibleProperty, new Text( sweepArea, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new Checkbox( model.areaGraphVisibleProperty, new Text( areaGraphString, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new VDivider( MySolarSystemConstants.VDIVIDER_OPTIONS ),
        new HBox( {
          children: [
            new Text( periodDivisionString, TEXT_OPTIONS ),
            new NumberDisplay( model.periodDivisionProperty, divisionsRange,
                {
                  maxWidth: 40
                } )
          ],
          margin: 4
        } ),
        divisionSlider
      ],
      spacing: 10,
      align: 'left',
      stretch: true,
      orientation: 'vertical'
    } );
  }
}

mySolarSystem.register( 'AreasAccordionBox', AreasAccordionBox );