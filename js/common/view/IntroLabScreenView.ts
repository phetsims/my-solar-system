// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 * 
 * @author Agustín Vallejo
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { AlignBox, HBox, RichText, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import MySolarSystemControls from './MySolarSystemControls.js';
import mySolarSystem from '../../mySolarSystem.js';
import CommonModel from '../../../../solar-system-common/js/model/CommonModel.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CommonScreenView from '../../../../solar-system-common/js/view/CommonScreenView.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import FullDataPanel from './FullDataPanel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Range from '../../../../dot/js/Range.js';
import ViewSynchronizer from '../../../../scenery-phet/js/ViewSynchronizer.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import BodyNode from '../../../../solar-system-common/js/view/BodyNode.js';
import VectorNode from '../../../../solar-system-common/js/view/VectorNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dialog from '../../../../sun/js/Dialog.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import PathsCanvasNode from './PathsCanvasNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';


type SelfOptions = EmptySelfOptions;

export type IntroLabScreenViewOptions = SelfOptions & ScreenViewOptions;

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
      font: new PhetFont( 28 )
    }
  }
};

export default class IntroLabScreenView extends CommonScreenView {
  public constructor( model: CommonModel, providedOptions: IntroLabScreenViewOptions ) {
    super( model, providedOptions );

    const modelDragBoundsProperty = new DerivedProperty( [
      this.visibleBoundsProperty,
      this.modelViewTransformProperty
    ], ( visibleBounds, modelViewTransform ) => {
      return modelViewTransform.viewToModelBounds( visibleBounds );
    } );

    // Body and Arrows Creation =================================================================================================
    // Setting the Factory functions that will create the necessary Nodes

    const bodyNodeSynchronizer = new ViewSynchronizer( this.bodiesLayer, ( body: Body ) => {
      return new BodyNode( body, this.modelViewTransformProperty, {
        valuesVisibleProperty: model.valuesVisibleProperty,
        mapPosition: ( point, radius ) => modelDragBoundsProperty.value.eroded( radius ).closestPointTo( point )
      } );
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
          spacing: 8,
          magnifyingGlassNodeOptions: {
            glassRadius: 8
          },
          touchAreaXDilation: 5,
          touchAreaYDilation: 5
        } ),
      {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: SolarSystemCommonConstants.MARGIN,
        xAlign: 'left',
        yAlign: 'top'
      } );

    // Control Panel --------------------------------------------------------------------------------------------
    const topRightControlBox = new AlignBox(
      new VBox(
        {
          spacing: 10,
          stretch: true,
          children: [
            new Panel(
              new MySolarSystemControls( model, this.topLayer, {
                tandem: providedOptions.tandem.createTandem( 'controlPanel' )
              } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ),
            this.timeBox,
            new TextPushButton( MySolarSystemStrings.followCenterOfMassStringProperty, {
              visibleProperty: DerivedProperty.not( model.systemCenteredProperty ),
              listener: () => {
                model.systemCenteredProperty.value = true;
              },
              touchAreaXDilation: 5,
              touchAreaYDilation: 5,
              font: SolarSystemCommonConstants.PANEL_FONT,
              maxTextWidth: 200
            } )
          ]
        }
      ),
      {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: SolarSystemCommonConstants.MARGIN,
        xAlign: 'right',
        yAlign: 'top'
      } );

    // Full Data Panel --------------------------------------------------------------------------------------------
    const fullDataPanel = new FullDataPanel( model );
    const numberSpinnerBox = new VBox( {
      children: [
        new Text( MySolarSystemStrings.dataPanel.bodiesStringProperty, combineOptions<TextOptions>( {
          maxWidth: 70
        }, SolarSystemCommonConstants.TEXT_OPTIONS ) ),
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
      spacing: 10
    } );

    const unitsDialog = new Dialog( new RichText( MySolarSystemStrings.unitsInfo.contentStringProperty, { lineWrap: 600 } ), {
      titleAlign: 'center',
      title: new Text( MySolarSystemStrings.unitsInfo.titleStringProperty, { font: new PhetFont( 32 ) } ),
      tandem: providedOptions.tandem.createTandem( 'unitsDialog' )
    } );

    const dataGridbox = new HBox( {
      align: 'bottom',
      spacing: 10,
      children: [
        new VBox( {
          spacing: 3,
          stretch: true,
          children: [
            new HBox( {
              stretch: true,
              visible: model.isLab,
              children: [
                new SolarSystemCommonCheckbox(
                  model.moreDataProperty,
                  new Text( MySolarSystemStrings.dataPanel.moreDataStringProperty, combineOptions<TextOptions>( {
                    maxWidth: 300
                  }, SolarSystemCommonConstants.TEXT_OPTIONS ) ),
                  combineOptions<CheckboxOptions>( {
                    touchAreaXDilation: 10,
                    touchAreaYDilation: 10
                  }, SolarSystemCommonConstants.CHECKBOX_OPTIONS )
                ),
                new InfoButton( {
                  scale: 0.5,
                  iconFill: 'rgb( 41, 106, 163 )',
                  touchAreaDilation: 20,
                  listener: () => unitsDialog.show(),
                  tandem: providedOptions.tandem.createTandem( 'unitsInfoButton' )
                } )
              ]
            } ),
            fullDataPanel
          ]
        } ),
        numberSpinnerBox
      ],
      layoutOptions: {
        column: 0
      }
    } );

    const centerBox = new AlignBox(
      dataGridbox,
      {
        alignBoundsProperty: this.availableBoundsProperty,
        margin: SolarSystemCommonConstants.MARGIN,
        xAlign: 'left',
        yAlign: 'bottom'
      } );

    this.interfaceLayer.addChild( centerBox );
    this.interfaceLayer.addChild( topRightControlBox );
    this.interfaceLayer.addChild( topLeftZoomBox );

    this.bottomLayer.addChild( new PathsCanvasNode( model.bodies, this.modelViewTransformProperty, this.visibleBoundsProperty, {
      visibleProperty: model.pathVisibleProperty
    } ) );
  }
}

mySolarSystem.register( 'IntroLabScreenView', IntroLabScreenView );