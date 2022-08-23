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
import { AlignBox, Font, GridBox, Text, VBox } from '../../../../scenery/js/imports.js';
import MassesControlPanel from '../../common/view/MassesControlPanel.js';
import FullDataPanel from './FullDataPanel.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';

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
  private numberSpinner: VBox;

  public constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {

    const options = optionize<LabScreenViewOptions, SelfOptions, CommonScreenViewOptions>()( {
      tandem: providedOptions.tandem
    }, providedOptions );

    super( model, options );

    const checkboxOptions = combineOptions<MySolarSystemCheckboxOptions>(
      { layoutOptions: { column: 1, row: 0 } },
      MySolarSystemConstants.CHECKBOX_OPTIONS );

    const spinnerOptions: NumberSpinnerOptions = {
      deltaValue: 1,
      touchAreaXDilation: 20,
      touchAreaYDilation: 10,
      mouseAreaXDilation: 10,
      mouseAreaYDilation: 5,
      numberDisplayOptions: {
        decimalPlaces: 0,
        align: 'center',
        xMargin: 10,
        yMargin: 3,
        minBackgroundWidth: 100,
        textOptions: {
          font: new Font( { size: 28 } )
        }
      }
    };


    // Add the node for the Masses Sliders & Full Data Panel
    this.massesControlPanel = new MassesControlPanel( model, { fill: 'white', layoutOptions: { column: 1, row: 1 } } );
    this.fullDataPanel = new FullDataPanel( model, { fill: 'white', layoutOptions: { column: 1, row: 1 } } );
    this.numberSpinner = new VBox( {
      children: [
        new Text( mySolarSystemStrings.dataPanel.bodiesProperty, TEXT_OPTIONS ),
        new NumberSpinner( model.numberOfActiveBodies, model.rangeOfActiveBodies,
            combineOptions<NumberSpinnerOptions>( {}, spinnerOptions, {
              arrowsPosition: 'bothRight',
              numberDisplayOptions: {
                yMargin: 10,
                align: 'right',
                scale: 0.8
              }
            } ) )
      ],
      layoutOptions: { column: 0, row: 1, margin: 10 }
    } );

    this.gridbox = new GridBox( { xAlign: 'left' } );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( new AlignBox( this.gridbox,
      {
     alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'left', yAlign: 'bottom'
    } ) );

    model.moreDataProperty.link( moreData => {
      this.gridbox.children = [
        this.numberSpinner,
        new MySolarSystemCheckbox( model.moreDataProperty, new Text( mySolarSystemStrings.dataPanel.moreDataProperty, TEXT_OPTIONS ), checkboxOptions ),
        !moreData ? this.massesControlPanel : this.fullDataPanel
        // bodyNumberSpinner
      ];
    } );
  }

  public override update(): void {
    this.massesControlPanel.update();
    this.fullDataPanel.update();
  }
}

mySolarSystem.register( 'LabScreenView', LabScreenView );
export default LabScreenView;