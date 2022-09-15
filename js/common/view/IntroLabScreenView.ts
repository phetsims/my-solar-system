// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 * 
 * @author Agustín Vallejo
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { AlignBox, Font, GridBox, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import MySolarSystemControls from './MySolarSystemControls.js';
import mySolarSystem from '../../mySolarSystem.js';
import CommonModel from '../model/CommonModel.js';
import PathsWebGLNode from './PathsWebGLNode.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CommonScreenView from './CommonScreenView.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import MySolarSystemCheckbox, { MySolarSystemCheckboxOptions } from './MySolarSystemCheckbox.js';
import FullDataPanel from './FullDataPanel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Range from '../../../../dot/js/Range.js';

type SelfOptions = EmptySelfOptions;

export type IntroLabScreenViewOptions = SelfOptions & ScreenViewOptions;

// Consts
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: 'white'
};

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


export default class IntroLabScreenView extends CommonScreenView {
  public constructor( model: CommonModel, providedOptions: IntroLabScreenViewOptions ) {
    super( model, providedOptions );

    // UI Elements ===================================================================================================

    // Zoom Buttons ---------------------------------------------------------------------------
    const topLeftZoomBox = new AlignBox(
      new MagnifyingGlassZoomButtonGroup(
        model.zoomLevelProperty,
        {
          spacing: 8, magnifyingGlassNodeOptions: { glassRadius: 8 }
        } ),
      {
        margin: MySolarSystemConstants.MARGIN,
        xAlign: 'left',
        yAlign: 'top'
      } );

    this.visibleBoundsProperty.link( visibleBounds => {
      topLeftZoomBox.alignBounds = visibleBounds;
    } );

    this.interfaceLayer.addChild( topLeftZoomBox );

    // Control Panel --------------------------------------------------------------------------------------------
    const topRightControlBox = new AlignBox(
      new Panel(
        new MySolarSystemControls( model, this.topLayer ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS ),
      {
        margin: MySolarSystemConstants.MARGIN,
        xAlign: 'right',
        yAlign: 'top'
      } );

    this.visibleBoundsProperty.link( visibleBounds => {
      topRightControlBox.alignBounds = visibleBounds;
    } );

    this.interfaceLayer.addChild( topRightControlBox );

    // Full Data Panel --------------------------------------------------------------------------------------------
    const fullDataPanel = new FullDataPanel( model, { fill: 'white', layoutOptions: { column: 1, row: 1 } } );
    const numberSpinnerBox = new VBox( {
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
      visible: model.isLab,
      spacing: 10,
      layoutOptions: {
        column: 0,
        row: 1,
        margin: 10,
        yAlign: 'bottom'
      }
    } );

    const moreDataCheckbox = new MySolarSystemCheckbox(
      model.moreDataProperty,
      new Text( MySolarSystemStrings.dataPanel.moreDataStringProperty, TEXT_OPTIONS ),
      combineOptions<MySolarSystemCheckboxOptions>(
          { layoutOptions: { column: 1, row: 0 }, visible: model.isLab },
          MySolarSystemConstants.CHECKBOX_OPTIONS )
    );


    const dataGridbox = new GridBox( {
      children: [
          numberSpinnerBox,
          moreDataCheckbox,
          fullDataPanel
        ],
      layoutOptions: {
        column: 0
      }
      } );

    const centerBox = new AlignBox( new GridBox( {
      children: [ dataGridbox, this.timeBox ],
      spacing: 20
      } ),
      {
        margin: MySolarSystemConstants.MARGIN,
        xAlign: 'center',
        yAlign: 'bottom'
      } );

    this.visibleBoundsProperty.link( visibleBounds => {
      centerBox.alignBounds = visibleBounds;
    } );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( centerBox );

    const pathsWebGLNode = new PathsWebGLNode( model, this.modelViewTransformProperty, { visibleProperty: model.pathVisibleProperty } );
    this.bottomLayer.addChild( pathsWebGLNode );
  }

  //REVIEW: This provides no value over the CommonScreenView update() method, and should be removed (so the subtypes
  //REVIEW: can specify the implementation more directly).
  public override update(): void {
    // See subclass for implementation
  }
}

mySolarSystem.register( 'IntroLabScreenView', IntroLabScreenView );