// Copyright 2022, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 * 
 * @author Agustín Vallejo
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { AlignBox, Font, GridBox, HBox, Path, Text, Utils, VBox } from '../../../../scenery/js/imports.js';
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
import ViewSynchronizer from '../../../../scenery-phet/js/ViewSynchronizer.js';
import Body from '../model/Body.js';
import BodyNode from './BodyNode.js';
import VectorNode from './VectorNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import undoSolidShape from '../../../../sherpa/js/fontawesome-5/undoSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';


type SelfOptions = EmptySelfOptions;

export type IntroLabScreenViewOptions = SelfOptions & ScreenViewOptions;

// Consts
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
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


    // Body and Arrows Creation =================================================================================================
    // Setting the Factory functions that will create the necessary Nodes

    const bodyNodeSynchronizer = new ViewSynchronizer( this.bodiesLayer, ( body: Body ) => {
      return new BodyNode( body, this.modelViewTransformProperty );
    } );

    const velocityVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, this.createDraggableVectorNode );

    const forceVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, ( body: Body ) => {
      return new VectorNode(
        body, this.modelViewTransformProperty, model.gravityVisibleProperty, body.forceProperty,
        0.05, { fill: PhetColorScheme.GRAVITATIONAL_FORCE }
      );
    } );

    // The ViewSynchronizers handle the creation and disposal of Model-View pairs
    const trackers = [
      bodyNodeSynchronizer, velocityVectorSynchronizer, forceVectorSynchronizer
    ];

    // Create bodyNodes and arrows for every body
    model.bodies.forEach( body => trackers.forEach( tracker => tracker.add( body ) ) );

    // Set up listeners for object creation and disposal
    model.bodies.elementAddedEmitter.addListener( body => {
      trackers.forEach( tracker => tracker.add( body ) );
      this.update();
    } );
    model.bodies.elementRemovedEmitter.addListener( body => {
      trackers.forEach( tracker => tracker.remove( body ) );
      this.update();
    } );

    // UI Elements ===================================================================================================

    // Zoom Buttons ---------------------------------------------------------------------------
    const topLeftZoomBox = new AlignBox(
      new MagnifyingGlassZoomButtonGroup(
        model.zoomLevelProperty,
        {
          spacing: 8, magnifyingGlassNodeOptions: { glassRadius: 8 },
          touchAreaXDilation: 5,
          touchAreaYDilation: 5
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
      new HBox(
        {
          align: 'top',
          children: [
            new RectangularPushButton( {
              content: new Path( undoSolidShape, { scale: 0.038, fill: 'black' } ),
              listener: () => model.restart(),
              tandem: providedOptions.tandem.createTandem( 'restartButton' ),
              layoutOptions: {
                xMargin: MySolarSystemConstants.MARGIN / 2
              }
            } ),
            new VBox(
              {
                spacing: 10,
                stretch: true,
                children: [
                  new Panel(
                    new MySolarSystemControls( model, this.topLayer, {
                      tandem: providedOptions.tandem.createTandem( 'controlPanel' )
                    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS ),
                  new TextPushButton( MySolarSystemStrings.systemCenteredStringProperty, {
                    enabledProperty: DerivedProperty.not( model.systemCenteredProperty ),
                    listener: () => {
                      model.systemCenteredProperty.value = true;
                    },
                    font: MySolarSystemConstants.PANEL_FONT
                  } )
                ]
              }
            )
          ]
        }
      ),
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
    const fullDataPanel = new FullDataPanel( model, { layoutOptions: { column: 1, row: 1 } } );
    const numberSpinnerBox = new VBox( {
      children: [
        new Text( MySolarSystemStrings.dataPanel.bodiesStringProperty, TEXT_OPTIONS ),
        new NumberSpinner( model.numberOfActiveBodiesProperty, new TinyProperty( new Range( 1, 4 ) ),
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
        {
            layoutOptions: { column: 1, row: 0, xAlign: 'left' },
            visible: model.isLab
        },
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
        xAlign: 'left',
        yAlign: 'bottom'
      } );

    this.visibleBoundsProperty.link( visibleBounds => {
      centerBox.alignBounds = visibleBounds;
    } );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( centerBox );

    if ( Utils.isWebGLSupported ) {
      const pathsWebGLNode = new PathsWebGLNode( model, this.modelViewTransformProperty, { visibleProperty: model.pathVisibleProperty } );
      this.bottomLayer.addChild( pathsWebGLNode );
    }
  }
}

mySolarSystem.register( 'IntroLabScreenView', IntroLabScreenView );