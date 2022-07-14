// Copyright 2022, University of Colorado Boulder

/**
 * Kepler's second law panel control: Swept area
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { FlowBox, Text, VDivider } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

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
    super( {
      children: [
        new Checkbox( model.dotsVisibleProperty, new Text( dotsString, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new Checkbox( model.sweepAreaVisibleProperty, new Text( sweepArea, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new Checkbox( model.areaGraphVisibleProperty, new Text( areaGraphString, TEXT_OPTIONS ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
        new VDivider( MySolarSystemConstants.VDIVIDER_OPTIONS ),
        new FlowBox( {
          children: [
            new Text( periodDivisionString, TEXT_OPTIONS )
          ]
        } )
      ],
      spacing: 10,
      align: 'left',
      stretch: true,
      orientation: 'vertical'
    } );
  }
}

mySolarSystem.register( 'AreasAccordionBox', AreasAccordionBox );