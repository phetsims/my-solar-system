// Copyright 2022, University of Colorado Boulder

/**
 * Screen View for Lab Screen: Where you can play with all the presets and body configurations
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import LabModel from '../model/LabModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CommonScreenView, { CommonScreenViewOptions } from '../../common/view/CommonScreenView.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import { AlignBox, FlowBox, Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';

// Consts
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: 'white'
};

type SelfOptions = {
 //TODO add options that are specific to LabScreenView here
};

type LabScreenViewOptions = SelfOptions & CommonScreenViewOptions;

class LabScreenView extends CommonScreenView {

  constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {

    const options = optionize<LabScreenViewOptions, SelfOptions, CommonScreenViewOptions>()( {
      tandem: providedOptions.tandem
    }, providedOptions );

    super( model, options );

    // Slider that controls the bodies mass
    this.UILayerNode.addChild( new AlignBox( new FlowBox( {
      children: [
        new Checkbox( new Text( 'More data', TEXT_OPTIONS ), model.moreDataProperty, MySolarSystemConstants.CHECKBOX_OPTIONS ),
        this.massesControlPanel
        // bodyNumberSpinner
      ],
      orientation: 'vertical'
    } ),
      {
     alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'left', yAlign: 'bottom'
    } ) );

    model.moreDataProperty.link( moreData => {
      
    } );
  }
}

mySolarSystem.register( 'LabScreenView', LabScreenView );
export default LabScreenView;