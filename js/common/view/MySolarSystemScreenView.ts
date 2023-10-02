// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { AlignBox, HBox, Node, RichText, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import MySolarSystemControlPanel from './MySolarSystemControlPanel.js';
import mySolarSystem from '../../mySolarSystem.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonScreenView, { BodyBoundsItem, SolarSystemCommonScreenViewOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonScreenView.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import ValuesPanel from './ValuesPanel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Range from '../../../../dot/js/Range.js';
import ViewSynchronizer from '../../../../scenery-phet/js/ViewSynchronizer.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import BodyNode from '../../../../solar-system-common/js/view/BodyNode.js';
import VectorNode from '../../../../solar-system-common/js/view/VectorNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dialog from '../../../../sun/js/Dialog.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import PathsCanvasNode from './PathsCanvasNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import TimePanel from './TimePanel.js';
import LabModePanel from './LabModePanel.js';

export type IntroLabScreenViewOptions = SolarSystemCommonScreenViewOptions;

export default class MySolarSystemScreenView extends SolarSystemCommonScreenView {

  private readonly bodyNodeSynchronizer: ViewSynchronizer<Body, BodyNode>;

  private readonly topRightControlBox: Node;
  private readonly zoomButtons: Node;
  private readonly dataPanelTopRow: Node;
  private readonly fullDataPanel: Node;
  private readonly numberSpinnerBox: Node;
  private readonly followCenterOfMassButton: Node;

  public constructor( model: MySolarSystemModel, providedOptions: IntroLabScreenViewOptions ) {

    const options = optionize<IntroLabScreenViewOptions, EmptySelfOptions, SolarSystemCommonScreenViewOptions>()( {
      centerOrbitOffset: new Vector2( SolarSystemCommonConstants.GRID_SPACING, SolarSystemCommonConstants.GRID_SPACING )
    }, providedOptions );

    super( model, options );

    // Body and Arrows Creation =================================================================================================
    // Setting the Factory functions that will create the necessary Nodes

    this.bodyNodeSynchronizer = new ViewSynchronizer( this.bodiesLayer, ( body: Body ) => {
      return new BodyNode( body, this.modelViewTransformProperty, {
        valuesVisibleProperty: model.valuesVisibleProperty,
        mapPosition: this.constrainBoundaryViewPoint.bind( this ),
        soundViewNode: this
      } );
    } );

    const velocityVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, this.createDraggableVectorNode );

    const forceVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, ( body: Body ) =>
      new VectorNode( body, this.modelViewTransformProperty, model.gravityVisibleProperty, body.forceProperty, model.forceScaleProperty, {
        fill: SolarSystemCommonColors.gravityColorProperty,
        constrainSize: true
      } )
    );

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

    const labModePanel = new LabModePanel( model.labModeProperty, this.topLayer, options.tandem.createTandem( 'labModePanel' ) );
    labModePanel.visible = model.isLab; //TODO https://github.com/phetsims/my-solar-system/issues/198

    const timePanel = new TimePanel( model, options.playingAllowedProperty, options.tandem.createTandem( 'timePanel' ) );

    const controlPanel = new MySolarSystemControlPanel( model, options.tandem.createTandem( 'controlPanel' ) );

    this.topRightControlBox = new VBox( {
      spacing: 7.5,
      stretch: true,
      children: [
        labModePanel,
        timePanel,
        controlPanel
      ]
    } );

    this.zoomButtons = new MagnifyingGlassZoomButtonGroup(
      model.zoomLevelProperty,
      {
        spacing: 8,
        magnifyingGlassNodeOptions: {
          glassRadius: 8
        },
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
      } );

    // Full Data Panel --------------------------------------------------------------------------------------------
    this.fullDataPanel = new ValuesPanel( model );

    this.followCenterOfMassButton = new TextPushButton( MySolarSystemStrings.followCenterOfMassStringProperty, {
      visibleProperty: model.userControlledProperty,
      listener: () => {
        model.systemCenteredProperty.value = true;
        model.userControlledProperty.value = false;
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: SolarSystemCommonConstants.CHECKBOX_SPACING / 2,
      font: SolarSystemCommonConstants.PANEL_FONT,
      maxTextWidth: 200,
      baseColor: 'orange'
    } );

    const numberSpinnerTandem = model.isLab ? options.tandem.createTandem( 'numberSpinner' ) : Tandem.OPT_OUT;

    this.numberSpinnerBox = new VBox( {
      children: [
        new Text( MySolarSystemStrings.dataPanel.bodiesStringProperty, combineOptions<TextOptions>( {
          maxWidth: 70
        }, SolarSystemCommonConstants.TEXT_OPTIONS ) ),
        new NumberSpinner( model.numberOfActiveBodiesProperty, new TinyProperty( new Range( 1, SolarSystemCommonConstants.NUM_BODIES ) ),
          {
            deltaValue: 1,
            touchAreaXDilation: 20,
            touchAreaYDilation: 10,
            mouseAreaXDilation: 10,
            mouseAreaYDilation: 5,
            arrowsPosition: 'bothRight',
            arrowsSoundPlayer: nullSoundPlayer,
            numberDisplayOptions: {
              decimalPlaces: 0,
              align: 'center',
              xMargin: 10,
              yMargin: 3,
              textOptions: {
                font: new PhetFont( 28 )
              }
            },
            accessibleName: MySolarSystemStrings.a11y.numberOfBodiesStringProperty
          } )
      ],
      visible: model.isLab,
      spacing: 5,
      tandem: numberSpinnerTandem
    } );

    const infoButtonTandem = model.isLab ? options.tandem.createTandem( 'unitsInfoButton' ) : Tandem.OPT_OUT;
    const moreDataCheckboxTandem = model.isLab ? options.tandem.createTandem( 'moreDataCheckbox' ) : Tandem.OPT_OUT;

    this.dataPanelTopRow = new HBox( {
      stretch: true,
      visible: model.isLab,
      children: [
        new SolarSystemCommonCheckbox(
          model.moreDataProperty,
          new Text( MySolarSystemStrings.dataPanel.moreDataStringProperty, combineOptions<TextOptions>( {
            maxWidth: 300
          }, SolarSystemCommonConstants.TEXT_OPTIONS ) ),
          combineOptions<CheckboxOptions>( {
            accessibleName: MySolarSystemStrings.a11y.moreDataStringProperty,
            touchAreaXDilation: 10,
            touchAreaYDilation: 10,
            tandem: moreDataCheckboxTandem
          }, SolarSystemCommonConstants.CHECKBOX_OPTIONS )
        ),
        new InfoButton( {
          accessibleName: MySolarSystemStrings.a11y.infoStringProperty,
          scale: 0.5,
          iconFill: 'rgb( 41, 106, 163 )',
          touchAreaDilation: 20,
          listener: () => unitsDialog.show(),
          tandem: infoButtonTandem
        } )
      ]
    } );

    const notesStringProperty = new DerivedProperty( [
        MySolarSystemStrings.unitsInfo.contentStringProperty,
        MySolarSystemStrings.unitsInfo.content2StringProperty,
        MySolarSystemStrings.unitsInfo.content3StringProperty
      ],
      ( content, content2, content3 ) => {
        return content + '<br><br>' + content2 + '<br><br>' + content3;
      } );

    const unitsDialog = new Dialog( new RichText( notesStringProperty, { lineWrap: 600 } ), {
      titleAlign: 'center',
      title: new Text( MySolarSystemStrings.unitsInfo.titleStringProperty, { font: new PhetFont( 32 ) } ),
      tandem: options.tandem.createTandem( 'unitsDialog' )
    } );

    // Masses Panel --------------------------------------------------------------------------------------------
    const dataGridbox = new HBox( {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Data Panel',
      align: 'bottom',
      spacing: 10,
      children: [
        new VBox( {
          spacing: 3,
          stretch: true,
          children: [
            this.dataPanelTopRow,
            this.fullDataPanel
          ]
        } ),
        new HBox( {
          align: 'bottom',
          spacing: 10,
          children: [
            this.numberSpinnerBox,
            this.followCenterOfMassButton
          ]
        } )
      ]
    } );

    const controlsAlignBox = new AlignBox( dataGridbox, {
      alignBoundsProperty: this.availableBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'left',
      yAlign: 'bottom'
    } );

    const zoomButtonsBox = new AlignBox( this.zoomButtons, {
      alignBoundsProperty: this.availableBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'left',
      yAlign: 'top'
    } );

    const offScaleMessage = new Text( SolarSystemCommonStrings.offscaleMessageStringProperty,
      combineOptions<TextOptions>( {
          visibleProperty: DerivedProperty.and( [ model.gravityVisibleProperty, model.isAnyForceOffscaleProperty ] ),
          maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH * 1.6
        },
        SolarSystemCommonConstants.TEXT_OPTIONS )
    );
    const returnBodiesButton = new TextPushButton( MySolarSystemStrings.returnBodiesStringProperty, {
      visibleProperty: model.isAnyBodyEscapedProperty,
      listener: () => {
        model.restart();
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      font: SolarSystemCommonConstants.PANEL_FONT,
      maxTextWidth: 190,
      containerTagName: 'div'
    } );

    const topCenterButtonBox = new AlignBox( new HBox( {
      spacing: 20,
      heightSizable: false,
      preferredHeight: returnBodiesButton.height,
      children: [ returnBodiesButton, offScaleMessage ]
    } ), {
      alignBoundsProperty: this.availableBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      centerX: -controlPanel.width / 2,
      xAlign: 'center',
      yAlign: 'top'
    } );

    const topRightAlignBox = new AlignBox(
      this.topRightControlBox, {
        alignBoundsProperty: this.availableBoundsProperty,
        xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
        yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
        xAlign: 'right',
        yAlign: 'top'
      } );

    this.interfaceLayer.addChild( topCenterButtonBox );
    this.interfaceLayer.addChild( this.resetAllButton );
    this.interfaceLayer.addChild( controlsAlignBox );
    this.interfaceLayer.addChild( topRightAlignBox );
    this.interfaceLayer.addChild( zoomButtonsBox );

    // ZoomBox should be first in the PDOM Order
    this.interfaceLayer.pdomOrder = [
      labModePanel,
      timePanel,
      topCenterButtonBox,
      dataGridbox,
      controlPanel,
      this.zoomButtons,
      this.resetAllButton
    ];

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

  protected override getBodyBoundsItems(): BodyBoundsItem[] {
    return [
      ...super.getBodyBoundsItems(),
      {
        node: this.topRightControlBox,
        expandX: 'right',
        expandY: 'top'
      },
      {
        node: this.zoomButtons,
        expandX: 'left',
        expandY: 'top'
      },
      // Bottom-left controls, all with individual scopes (all expanded bottom-left)
      ...[ this.dataPanelTopRow, this.fullDataPanel, this.numberSpinnerBox, this.followCenterOfMassButton ].map( ( node: Node ): BodyBoundsItem => {
        return {
          node: node,
          expandX: 'left',
          expandY: 'bottom'
        };
      } )
    ];
  }
}

mySolarSystem.register( 'MySolarSystemScreenView', MySolarSystemScreenView );