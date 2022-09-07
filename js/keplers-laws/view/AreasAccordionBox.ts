// Copyright 2022, University of Colorado Boulder

/**
 * Kepler's second law panel control: Swept area
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, Text, VBox, VDivider } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import LawMode from '../model/LawMode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

type SelfOptions = EmptySelfOptions;

export type AreasAccordionBoxOptions = SelfOptions & AccordionBoxOptions;

export default class AreasAccordionBox extends AccordionBox {
  public constructor( model: KeplersLawsModel ) {
    const options = combineOptions<AreasAccordionBoxOptions>( {
      titleNode: new Text( mySolarSystemStrings.area.titleStringProperty, TITLE_OPTIONS ),
      expandedProperty: model.areasVisibleProperty,
      visibleProperty: new DerivedProperty( [ model.selectedLawProperty ], selectedLaw => {
        return selectedLaw === LawMode.SECOND_LAW;
      } ),
      buttonXMargin: 5,
      buttonYMargin: 5
    }, MySolarSystemConstants.CONTROL_PANEL_OPTIONS );

    super( new AreasControls( model ), options );
  }
}

class AreasControls extends VBox {
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

      constrainValue: value => Utils.roundSymmetric( value )
    } );

    divisionSlider.addMajorTick( divisionsRange.min, new Text( divisionsRange.min, TEXT_OPTIONS ) );
    divisionSlider.addMajorTick( divisionsRange.min + 0.50 * divisionsRange.getLength() );
    divisionSlider.addMajorTick( divisionsRange.max, new Text( divisionsRange.max, TEXT_OPTIONS ) );

    // minor ticks
    divisionSlider.addMinorTick( divisionsRange.min + 0.25 * divisionsRange.getLength() );
    divisionSlider.addMinorTick( divisionsRange.min + 0.75 * divisionsRange.getLength() );

    super( {
      children: [
        new Checkbox( model.dotsVisibleProperty, new Text( mySolarSystemStrings.area.dotsStringProperty, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new Checkbox( model.sweepAreaVisibleProperty, new Text( mySolarSystemStrings.area.sweptAreaStringProperty, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new Checkbox( model.areaGraphVisibleProperty, new Text( mySolarSystemStrings.area.areaGraphStringProperty, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new VDivider( MySolarSystemConstants.VDIVIDER_OPTIONS ),
        new HBox( {
          children: [
            new Text( mySolarSystemStrings.area.periodDivisionStringProperty, TEXT_OPTIONS ),
            new NumberDisplay( model.periodDivisionProperty, divisionsRange,
              //REVIEW: indentation a bit weird here!
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
      stretch: true
    } );
  }
}

mySolarSystem.register( 'AreasAccordionBox', AreasAccordionBox );