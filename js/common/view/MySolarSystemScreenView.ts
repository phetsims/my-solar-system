// Copyright 2022-2023, University of Colorado Boulder

/**
 * MySolarSystemScreenView is the base class for ScreenViews in the My Solar System sim.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { AlignBox, HBox, Node, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
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
import UnitsInformationDialog from './UnitsInformationDialog.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

export type MySolarSystemScreenViewOptions = SelfOptions &
  PickRequired<SolarSystemCommonScreenViewOptions, 'tandem' | 'screenSummaryContent'>;

export default class MySolarSystemScreenView extends SolarSystemCommonScreenView {

  private readonly bodyNodeSynchronizer: ViewSynchronizer<Body, BodyNode>;

  // VBox that contains the control panels in the top-right corner of the screen.
  private readonly topRightVBox: Node;

  // HBox that contains controls that appear above the ValuesPanel.
  private readonly hboxAboveValuesPanel: Node;

  private readonly zoomButtons: Node;
  private readonly valuesPanel: Node;
  private readonly numberSpinnerBox: Node;
  private readonly followCenterOfMassButton: Node;

  protected constructor( model: MySolarSystemModel, providedOptions: MySolarSystemScreenViewOptions ) {

    const options = optionize<MySolarSystemScreenViewOptions, SelfOptions, SolarSystemCommonScreenViewOptions>()( {

      // SolarSystemCommonScreenViewOptions
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

    // Panels in the top-right of the screen ===========================================================================

    const labModePanel = new LabModePanel( model.labModeProperty, this.topLayer, options.tandem.createTandem( 'labModePanel' ) );
    labModePanel.visible = model.isLab; //TODO https://github.com/phetsims/my-solar-system/issues/198

    const timePanel = new TimePanel( model, options.playingAllowedProperty, options.tandem.createTandem( 'timePanel' ) );

    const controlPanel = new MySolarSystemControlPanel( model, options.tandem.createTandem( 'controlPanel' ) );

    this.topRightVBox = new VBox( {
      spacing: 7.5,
      stretch: true,
      children: [
        labModePanel,
        timePanel,
        controlPanel
      ]
    } );

    const topRightAlignBox = new AlignBox( this.topRightVBox, {
      alignBoundsProperty: this.availableBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'right',
      yAlign: 'top'
    } );

    // Panel and associated controls at the bottom-left of the screen ==================================================

    this.valuesPanel = new ValuesPanel( model, options.tandem.createTandem( 'valuesPanel' ) );

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

    this.numberSpinnerBox = new VBox( {
      children: [
        new Text( MySolarSystemStrings.dataPanel.bodiesStringProperty,
          combineOptions<TextOptions>( {}, SolarSystemCommonConstants.TEXT_OPTIONS, {
            maxWidth: 70
          } ) ),

        //TODO https://github.com/phetsims/my-solar-system/issues/208 range should be available from numberOfActiveBodiesProperty
        new NumberSpinner( model.numberOfActiveBodiesProperty, new TinyProperty( new Range( 1, SolarSystemCommonConstants.NUM_BODIES ) ), {
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
      tandem: model.isLab ? options.tandem.createTandem( 'numberSpinner' ) : Tandem.OPT_OUT
    } );

    const moreDataCheckbox = new SolarSystemCommonCheckbox(
      model.moreDataProperty,
      new Text( MySolarSystemStrings.dataPanel.moreDataStringProperty,
        combineOptions<TextOptions>( {}, SolarSystemCommonConstants.TEXT_OPTIONS, {
          maxWidth: 300
        } ) ),
      combineOptions<CheckboxOptions>( {}, SolarSystemCommonConstants.CHECKBOX_OPTIONS, {
        accessibleName: MySolarSystemStrings.a11y.moreDataStringProperty,
        touchAreaXDilation: 10,
        touchAreaYDilation: 10,
        tandem: model.isLab ? options.tandem.createTandem( 'moreDataCheckbox' ) : Tandem.OPT_OUT
      } )
    );

    const unitsInformationDialog = new UnitsInformationDialog( options.tandem.createTandem( 'unitsInformationDialog' ) );

    const unitsInformationButton = new InfoButton( {
      accessibleName: MySolarSystemStrings.a11y.infoStringProperty,
      scale: 0.5,
      iconFill: 'rgb( 41, 106, 163 )',
      touchAreaDilation: 20,
      listener: () => unitsInformationDialog.show(),
      tandem: model.isLab ? options.tandem.createTandem( 'unitsInformationButton' ) : Tandem.OPT_OUT
    } );

    this.hboxAboveValuesPanel = new HBox( {
      stretch: true,
      visible: model.isLab,
      children: [ moreDataCheckbox, unitsInformationButton ]
    } );

    const bottomLeftHBox = new HBox( {
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
            this.hboxAboveValuesPanel,
            this.valuesPanel
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

    const bottomLeftAlignBox = new AlignBox( bottomLeftHBox, {
      alignBoundsProperty: this.availableBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'left',
      yAlign: 'bottom'
    } );

    // Zoom buttons ====================================================================================================

    this.zoomButtons = new MagnifyingGlassZoomButtonGroup( model.zoomLevelProperty, {
      spacing: 8,
      magnifyingGlassNodeOptions: {
        glassRadius: 8
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      tandem: options.tandem.createTandem( 'zoomButtons' )
    } );

    const zoomButtonsAlignBox = new AlignBox( this.zoomButtons, {
      alignBoundsProperty: this.availableBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'left',
      yAlign: 'top'
    } );

    // Button and message that appear at top-center ====================================================================

    const offScaleMessage = new Text( SolarSystemCommonStrings.offscaleMessageStringProperty,
      combineOptions<TextOptions>( {}, SolarSystemCommonConstants.TEXT_OPTIONS, {
        visibleProperty: DerivedProperty.and( [ model.gravityVisibleProperty, model.isAnyForceOffscaleProperty ] ),
        maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH * 1.6
      } )
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
      containerTagName: 'div',
      tandem: options.tandem.createTandem( 'returnBodiesButton' )
    } );

    const topCenterAlignBox = new AlignBox( new HBox( {
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

    this.interfaceLayer.addChild( topCenterAlignBox );
    this.interfaceLayer.addChild( this.resetAllButton );
    this.interfaceLayer.addChild( bottomLeftAlignBox );
    this.interfaceLayer.addChild( topRightAlignBox );
    this.interfaceLayer.addChild( zoomButtonsAlignBox );

    // ZoomBox should be first in the PDOM Order
    this.interfaceLayer.pdomOrder = [
      labModePanel,
      timePanel,
      topCenterAlignBox,
      bottomLeftHBox,
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
        node: this.topRightVBox,
        expandX: 'right',
        expandY: 'top'
      },
      {
        node: this.zoomButtons,
        expandX: 'left',
        expandY: 'top'
      },
      // Bottom-left controls, all with individual scopes (all expanded bottom-left)
      ...[ this.hboxAboveValuesPanel, this.valuesPanel, this.numberSpinnerBox, this.followCenterOfMassButton ].map( ( node: Node ): BodyBoundsItem => {
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