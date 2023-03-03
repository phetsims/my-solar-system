// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 *
 * @author Agustín Vallejo
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { AlignBox, HBox, Node, RichText, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import MySolarSystemControls from './MySolarSystemControls.js';
import mySolarSystem from '../../mySolarSystem.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonScreenView from '../../../../solar-system-common/js/view/SolarSystemCommonScreenView.js';
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
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import LabMode from '../../../../solar-system-common/js/model/LabMode.js';

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

export default class MySolarSystemScreenView extends SolarSystemCommonScreenView {

  private readonly bodyNodeSynchronizer: ViewSynchronizer<Body, BodyNode>;

  public constructor( model: MySolarSystemModel, providedOptions: IntroLabScreenViewOptions ) {
    super( model, providedOptions );

    const modelDragBoundsProperty = new DerivedProperty( [
      this.visibleBoundsProperty,
      this.modelViewTransformProperty
    ], ( visibleBounds, modelViewTransform ) => {
      return modelViewTransform.viewToModelBounds( visibleBounds );
    } );

    // Body and Arrows Creation =================================================================================================
    // Setting the Factory functions that will create the necessary Nodes

    this.bodyNodeSynchronizer = new ViewSynchronizer( this.bodiesLayer, ( body: Body ) => {
      const bodyNode = new BodyNode( body, this.modelViewTransformProperty, {
        valuesVisibleProperty: model.valuesVisibleProperty,
        mapPosition: ( point, radius ) => modelDragBoundsProperty.value.eroded( radius ).closestPointTo( point ),
        soundViewNode: this
      } );

      return bodyNode;
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
      this.bodyNodeSynchronizer, velocityVectorSynchronizer, forceVectorSynchronizer
    ];

    // Create bodyNodes and arrows for every body
    model.bodies.forEach( body => trackers.forEach( tracker => tracker.add( body ) ) );

    // Set up listeners for object creation and disposal
    model.bodies.elementAddedEmitter.addListener( body => {
      trackers.forEach( tracker => tracker.add( body ) );
    } );
    model.bodies.elementRemovedEmitter.addListener( body => {
      trackers.forEach( tracker => tracker.remove( body ) );
    } );

    // Center of Mass Node
    const centerOfMassNode = new CenterOfMassNode( model.centerOfMass, this.modelViewTransformProperty );
    this.componentsLayer.addChild( centerOfMassNode );


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

    const COMBO_BOX_TEXT_OPTIONS = {
      font: SolarSystemCommonConstants.PANEL_FONT,
      maxWidth: SolarSystemCommonConstants.MAX_WIDTH
    };


    // Control Panel --------------------------------------------------------------------------------------------
    const topRightControlBox = new AlignBox(
      new VBox(
        {
          spacing: 10,
          stretch: true,
          children: [
            new Panel( new Node( {
              children: [
                ...(
                  model.isLab
                  ? [
                      new ComboBox( model.labModeProperty, [
                        { value: LabMode.SUN_PLANET, createNode: () => new Text( MySolarSystemStrings.mode.sunAndPlanetStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.SUN_PLANET_MOON, createNode: () => new Text( MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.SUN_PLANET_COMET, createNode: () => new Text( MySolarSystemStrings.mode.sunPlanetAndCometStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.TROJAN_ASTEROIDS, createNode: () => new Text( MySolarSystemStrings.mode.trojanAsteroidsStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.ELLIPSES, createNode: () => new Text( MySolarSystemStrings.mode.ellipsesStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.HYPERBOLIC, createNode: () => new Text( MySolarSystemStrings.mode.hyperbolicStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.SLINGSHOT, createNode: () => new Text( MySolarSystemStrings.mode.slingshotStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.DOUBLE_SLINGSHOT, createNode: () => new Text( MySolarSystemStrings.mode.doubleSlingshotStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.BINARY_STAR_PLANET, createNode: () => new Text( MySolarSystemStrings.mode.binaryStarPlanetStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.FOUR_STAR_BALLET, createNode: () => new Text( MySolarSystemStrings.mode.fourStarBalletStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.DOUBLE_DOUBLE, createNode: () => new Text( MySolarSystemStrings.mode.doubleDoubleStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                        { value: LabMode.CUSTOM, createNode: () => new Text( MySolarSystemStrings.mode.customStringProperty, COMBO_BOX_TEXT_OPTIONS ) }
                      ], this.topLayer, {
                        tandem: providedOptions.tandem.createTandem( 'labModeComboBox' ),
                        widthSizable: false,
                        layoutOptions: {
                          align: 'center'
                        }
                      } )
                    ]
                  : [] )
              ]
            } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ),
            this.timeBox,
            new Panel(
              new MySolarSystemControls( model, this.topLayer, {
                tandem: providedOptions.tandem.createTandem( 'controlPanel' )
              } ), SolarSystemCommonConstants.CONTROL_PANEL_OPTIONS ),
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
        new NumberSpinner( model.numberOfActiveBodiesProperty, new TinyProperty( new Range( 1, SolarSystemCommonConstants.NUM_BODIES ) ),
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

    assert && assert( this.interfaceLayer.pdomOrder );
    // ZoomBox should be first in the PDOM Order
    this.interfaceLayer.pdomOrder = [ topLeftZoomBox, ...this.interfaceLayer.pdomOrder! ];


    this.bottomLayer.addChild( new PathsCanvasNode( model.bodies, this.modelViewTransformProperty, this.visibleBoundsProperty, {
      visibleProperty: model.pathVisibleProperty
    } ) );
  }

  public override step( dt: number ): void {
    super.step( dt );

    this.bodyNodeSynchronizer.getViews().forEach( bodyNode => {
      if ( this.model.isPlayingProperty.value ) {
        bodyNode.playSound();
      }
      else {
        bodyNode.stopSound();
      }
    } );
  }
}

mySolarSystem.register( 'MySolarSystemScreenView', MySolarSystemScreenView );