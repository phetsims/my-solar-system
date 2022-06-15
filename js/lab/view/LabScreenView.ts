// Copyright 2022, University of Colorado Boulder

/**
 * Screen View for Lab Screen: Where you can play with all the presets and body configurations
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import LabModel from '../model/LabModel.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import CommonScreenView, { CommonScreenViewOptions } from '../../common/view/CommonScreenView.js';
import MySolarSystemCheckbox, { MySolarSystemCheckboxOptions } from '../../common/view/MySolarSystemCheckbox.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import { AlignBox, GridBox, Text } from '../../../../scenery/js/imports.js';
import MassesControlPanel from '../../common/view/MassesControlPanel.js';
import FullDataPanel from './FullDataPanel.js';

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
  private gridbox: GridBox;
  private massesControlPanel: MassesControlPanel;
  private fullDataPanel: FullDataPanel;

  constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {

    const options = optionize<LabScreenViewOptions, SelfOptions, CommonScreenViewOptions>()( {
      tandem: providedOptions.tandem
    }, providedOptions );

    super( model, options );

    const checkboxOptions = combineOptions<MySolarSystemCheckboxOptions>(
      { layoutOptions: { column: 1, row: 0 } },
      MySolarSystemConstants.CHECKBOX_OPTIONS );

    // Add the node for the Masses Sliders & Full Data Panel
    this.massesControlPanel = new MassesControlPanel( model, { fill: 'white', layoutOptions: { column: 1, row: 1 } } );
    this.fullDataPanel = new FullDataPanel( model, { fill: 'white', layoutOptions: { column: 1, row: 1 } } );

    this.gridbox = new GridBox( {
      children: [
        new MySolarSystemCheckbox( new Text( 'More data', TEXT_OPTIONS ), model.moreDataProperty, checkboxOptions ),
        this.massesControlPanel
        // bodyNumberSpinner
      ],
      xAlign: 'left'
    } );

    // Slider that controls the bodies mass
    this.UILayerNode.addChild( new AlignBox( this.gridbox,
      {
     alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'left', yAlign: 'bottom'
    } ) );

    model.moreDataProperty.link( moreData => {
      this.gridbox.children = [
        new MySolarSystemCheckbox( new Text( 'More data', TEXT_OPTIONS ), model.moreDataProperty, checkboxOptions ),
        !moreData ? this.massesControlPanel : this.fullDataPanel
        // bodyNumberSpinner
      ];
    } );
  }

  override update(): void {
    this.massesControlPanel.update();
    this.fullDataPanel.update();
  }
}

mySolarSystem.register( 'LabScreenView', LabScreenView );
export default LabScreenView;