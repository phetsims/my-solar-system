// Copyright 2022, University of Colorado Boulder

/**
 * Screen View for Lab Screen: Where you can play with all the presets and body configurations
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import LabModel from '../model/LabModel.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import MySolarSystemCheckbox, { MySolarSystemCheckboxOptions } from '../../common/view/MySolarSystemCheckbox.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import { AlignBox, Font, GridBox, Text, VBox } from '../../../../scenery/js/imports.js';
import MassesControlPanel from '../../common/view/MassesControlPanel.js';
import FullDataPanel from './FullDataPanel.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import IntroLabScreenView, { IntroLabScreenViewOptions } from '../../common/view/IntroLabScreenView.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Range from '../../../../dot/js/Range.js';

// Consts
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: 'white'
};

type SelfOptions = {
  //REVIEW: This comment is keeping this from being EmptySelfOptions here, replace!
 //TODO add options that are specific to LabScreenView here
};

//REVIEW: export!
type LabScreenViewOptions = SelfOptions & IntroLabScreenViewOptions;

class LabScreenView extends IntroLabScreenView {
  //REVIEW: readonly?
  private gridbox: GridBox;
  private massesControlPanel: MassesControlPanel;
  private fullDataPanel: FullDataPanel;
  private numberSpinnerBox: VBox;

  public constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {

    //REVIEW: What is this optionize doing? The tandem is already in the providedOptions, so this seems to be doing nothing
    //REVIEW: remove if possible?
    const options = optionize<LabScreenViewOptions, SelfOptions, IntroLabScreenViewOptions>()( {
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
        textOptions: {
          font: new Font( { size: 28 } )
        }
      }
    };


    // Add the node for the Masses Sliders & Full Data Panel
    this.massesControlPanel = new MassesControlPanel( model, { fill: 'white', layoutOptions: { column: 1, row: 1 } } );
    this.fullDataPanel = new FullDataPanel( model, { fill: 'white', layoutOptions: { column: 1, row: 1 } } );
    this.numberSpinnerBox = new VBox( {
      children: [
        new Text( MySolarSystemStrings.dataPanel.bodiesStringProperty, TEXT_OPTIONS ),
        new NumberSpinner( model.numberOfActiveBodiesProperty, new TinyProperty( new Range( 2, 4 ) ),
            combineOptions<NumberSpinnerOptions>( {}, spinnerOptions, {
              arrowsPosition: 'bothRight',
              numberDisplayOptions: {
                yMargin: 10,
                align: 'right',
                scale: 0.8
              }
            } ) )
      ],
      spacing: 10,
      layoutOptions: {
        column: 0,
        row: 1,
        margin: 10,
        yAlign: 'bottom'
      }
    } );

    this.gridbox = new GridBox(
      { children: [
        this.numberSpinnerBox,
        new MySolarSystemCheckbox( model.moreDataProperty, new Text( MySolarSystemStrings.dataPanel.moreDataStringProperty, TEXT_OPTIONS ), checkboxOptions ),
        this.massesControlPanel,
        this.fullDataPanel
      ],
      xAlign: 'left' } );

    const lowerLeftBox = new AlignBox( this.gridbox,
      {
        margin: MySolarSystemConstants.MARGIN,
        xAlign: 'left',
        yAlign: 'bottom'
      } );

    this.visibleBoundsProperty.link( visibleBounds => {
      lowerLeftBox.alignBounds = visibleBounds;
    } );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( lowerLeftBox );

    model.moreDataProperty.link( moreData => {
      this.massesControlPanel.visible = !moreData;
      this.fullDataPanel.visible = moreData;
    } );
  }

  public override update(): void {
    this.massesControlPanel.update();
    this.fullDataPanel.update();
  }
}

mySolarSystem.register( 'LabScreenView', LabScreenView );
export default LabScreenView;