// Copyright 2020-2022, University of Colorado Boulder

/**
 * The sliders for the panel that controls the smaller body mass and separation
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { FlowBox, Text } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { optionize3 } from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import MySolarSystemSlider from '../../common/view/MySolarSystemSlider.js';

// constants
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.backgroundProperty
};

export default class KeplersLawsSliders extends Panel {
  constructor( model: KeplersLawsModel ) {
    
    // const massRange = new RangeWithValue( 1, 300, 10 );
    const separationRange = new RangeWithValue( 75, 200, 150 );
    
    // const massControl = new MySolarSystemSlider( model.bodies[ 1 ].massProperty, massRange, { thumbFill: 'fuchsia' } );
    const separationControl = new MySolarSystemSlider( model.separationProperty, separationRange, { thumbFill: 'fuchsia' } );

    const options = optionize3<PanelOptions, EmptyObjectType, PanelOptions>()(
       {},
       MySolarSystemConstants.CONTROL_PANEL_OPTIONS,
       { fill: 'white' }
       );
    
    super( new FlowBox( {
      children: [
        // new Text( 'Mass', TEXT_OPTIONS ),
        // massControl,
        new Text( 'Initial Separation', TEXT_OPTIONS ),
        separationControl
      ],
      yMargin: 5,
      margin: 10,
      orientation: 'vertical',
      align: 'left'
      } ), options
      );
  }
}

mySolarSystem.register( 'KeplersLawsSliders', KeplersLawsSliders );

