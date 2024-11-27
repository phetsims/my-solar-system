// Copyright 2022-2024, University of Colorado Boulder

/**
 * MySolarSystemScreenView is the base class for ScreenViews in the My Solar System sim.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import BodyNode from '../../../../solar-system-common/js/view/BodyNode.js';
import DraggableVelocityVectorNode from '../../../../solar-system-common/js/view/DraggableVelocityVectorNode.js';
import SolarSystemCommonScreenView, { DragBoundsItem, SolarSystemCommonScreenViewOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonScreenView.js';
import VectorNode from '../../../../solar-system-common/js/view/VectorNode.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';
import MySolarSystemVisibleProperties from './MySolarSystemVisibleProperties.js';
import NumberOfBodiesControl from './NumberOfBodiesControl.js';
import PathsCanvasNode from './PathsCanvasNode.js';
import TimePanel from './TimePanel.js';
import UnitsInformationDialog from './UnitsInformationDialog.js';
import ValuesPanel from './ValuesPanel.js';
import VisibilityControlPanel from './VisibilityControlPanel.js';

type SelfOptions = EmptySelfOptions;

export type MySolarSystemScreenViewOptions = SelfOptions &
  PickRequired<SolarSystemCommonScreenViewOptions, 'tandem' | 'screenSummaryContent'>;

export default class MySolarSystemScreenView extends SolarSystemCommonScreenView<MySolarSystemVisibleProperties> {

  // VBox that contains the control panels in the top-right corner of the screen.
  protected readonly topRightVBox: Node;

  // HBox that contains controls that appear above the ValuesPanel.
  private readonly hboxAboveValuesPanel: Node;

  private readonly zoomButtonGroup: Node;
  private readonly valuesPanel: Node;
  private readonly numberOfBodiesControl: Node;
  private readonly followCenterOfMassButton: Node;

  private readonly bodyNodes: BodyNode[];

  // Group all panels under a parent tandem
  protected readonly panelsTandem: Tandem;

  protected constructor( model: MySolarSystemModel, providedOptions: MySolarSystemScreenViewOptions ) {

    const options = optionize<MySolarSystemScreenViewOptions, SelfOptions, SolarSystemCommonScreenViewOptions>()( {
      // SolarSystemCommonScreenViewOptions
      centerOrbitOffset: new Vector2( 100, 100 )
    }, providedOptions );

    super( model, new MySolarSystemVisibleProperties( model.isLab, options.tandem.createTandem( 'visibleProperties' ) ), options );

    this.visibleProperties.pathVisibleProperty.link( visible => {
      model.clearPaths();
      model.addingPathPoints = visible;
    } );

    // Creation of Nodes associates with each Body =====================================================================

    this.bodyNodes = [];
    const orbitalSystemNodesTandem = options.tandem.createTandem( 'orbitalSystemNodes' );

    model.bodies.forEach( body => {

      const bodyNode = new BodyNode( body, this.modelViewTransformProperty, {
        speedVisibleProperty: this.visibleProperties.speedVisibleProperty,
        mapPosition: this.constrainDragPoint.bind( this ),
        soundViewNode: this,
        visibleProperty: body.isActiveProperty, // visible when the associated Body is active
        tandem: orbitalSystemNodesTandem.createTandem( `body${body.index}Node` )
      } );
      this.bodiesLayer.addChild( bodyNode );
      this.bodyNodes.push( bodyNode );

      const velocityVectorNode = new DraggableVelocityVectorNode( body, this.modelViewTransformProperty, {
        mapPosition: this.constrainDragPoint.bind( this ),
        soundViewNode: this,
        visibleProperty: DerivedProperty.and( [ body.isActiveProperty, this.visibleProperties.velocityVisibleProperty ] ),
        tandem: orbitalSystemNodesTandem.createTandem( `velocityVector${body.index}Node` )
      } );
      this.componentsLayer.addChild( velocityVectorNode );

      const gravityForceVectorNode = new VectorNode( body, this.modelViewTransformProperty, body.gravityForceProperty, model.gravityForceScalePowerProperty, {
        fill: SolarSystemCommonColors.gravityColorProperty,
        scalingOffset: SolarSystemCommonConstants.INITIAL_VECTOR_OFFSCALE, // This option ensures the gravity vectors are initially scaled properly
        visibleProperty: DerivedProperty.and( [ body.isActiveProperty, this.visibleProperties.gravityVisibleProperty ] )
        // tandem: Do not instrument, nothing interesting here.
      } );
      this.componentsLayer.addChild( gravityForceVectorNode );

      Multilink.multilink(
        [ this.model.isPlayingProperty, body.isActiveProperty ],
        ( isPlaying, isActive ) => {
          if ( isPlaying && isActive ) {
            bodyNode.playSound();
          }
          else {
            bodyNode.stopSound();
          }
        } );
    } );

    // Center of Mass Node
    const centerOfMassNode = new CenterOfMassNode( model.centerOfMass, this.visibleProperties.centerOfMassVisibleProperty,
      this.modelViewTransformProperty, orbitalSystemNodesTandem.createTandem( 'centerOfMassNode' ) );
    this.componentsLayer.addChild( centerOfMassNode );

    // Panels in the top-right of the screen ===========================================================================

    this.panelsTandem = options.tandem.createTandem( 'panels' );

    const timePanel = new TimePanel( model, options.playingAllowedProperty, this.panelsTandem.createTandem( 'timePanel' ) );

    const visibilityControlPanel = new VisibilityControlPanel( model, this.visibleProperties,
      this.panelsTandem.createTandem( 'visibilityControlPanel' ) );

    this.topRightVBox = new VBox( {
      spacing: 7.5,
      stretch: true,
      children: [
        timePanel,
        visibilityControlPanel
      ]
    } );

    const topRightAlignBox = new AlignBox( this.topRightVBox, {
      alignBoundsProperty: this.interfaceBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'right',
      yAlign: 'top'
    } );

    // Panel and associated controls at the bottom-left of the screen ==================================================

    const valuesPanelTandem = this.panelsTandem.createTandem( 'valuesPanel' );

    this.valuesPanel = new ValuesPanel( model, this.visibleProperties.moreDataVisibleProperty, valuesPanelTandem );

    const moreDataCheckbox = MySolarSystemCheckbox.createMoreDataCheckbox( this.visibleProperties.moreDataVisibleProperty,
      model.isLab ? valuesPanelTandem.createTandem( 'moreDataCheckbox' ) : Tandem.OPT_OUT );

    const infoDialog = new UnitsInformationDialog(
      model.isLab ? valuesPanelTandem.createTandem( 'infoDialog' ) : Tandem.OPT_OUT );

    const infoButton = new InfoButton( {
      accessibleName: MySolarSystemStrings.a11y.infoStringProperty,
      scale: 0.5,
      iconFill: 'rgb( 41, 106, 163 )',
      touchAreaDilation: 20,
      listener: () => infoDialog.show(),
      tandem: model.isLab ? valuesPanelTandem.createTandem( 'infoButton' ) : Tandem.OPT_OUT
    } );

    this.hboxAboveValuesPanel = new HBox( {
      stretch: true,
      spacing: 20,
      align: 'bottom',

      // to keep infoButton right justified with valuesPanel when moreDataCheckbox is made invisible
      excludeInvisibleChildrenFromBounds: false,
      children: [ moreDataCheckbox, infoButton ],

      // Controls above valuesPanel are visible only when valuesPanel is visible, in Lab screen.
      visibleProperty: new DerivedProperty( [ this.valuesPanel.visibleProperty ],
        valuesPanelVisible => valuesPanelVisible && model.isLab )
    } );

    this.numberOfBodiesControl = new NumberOfBodiesControl( model.numberOfActiveBodiesProperty, {
      visible: model.isLab,
      tandem: model.isLab ? options.tandem.createTandem( 'numberOfBodiesControl' ) : Tandem.OPT_OUT
    } );

    this.followCenterOfMassButton = new TextPushButton( MySolarSystemStrings.followCenterOfMassStringProperty, {
      visibleProperty: DerivedProperty.not( model.followingCenterOfMassProperty ),
      listener: () => {
        model.followAndCenterCenterOfMass();
      },
      touchAreaXDilation: 2,
      touchAreaYDilation: SolarSystemCommonConstants.VBOX_SPACING,
      font: SolarSystemCommonConstants.BUTTON_FONT,
      maxTextWidth: 200,
      baseColor: 'orange',
      tandem: options.tandem.createTandem( 'followCenterOfMassButton' ),
      phetioEnabledPropertyInstrumented: false // there's no reason to disable this button
    } );

    const bottomLeftHBox = new HBox( {
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Data Panel',
      align: 'bottom',
      spacing: 10,
      children: [
        new VBox( {
          spacing: 5,
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
            this.numberOfBodiesControl,
            this.followCenterOfMassButton
          ]
        } )
      ]
    } );

    const bottomLeftAlignBox = new AlignBox( bottomLeftHBox, {
      alignBoundsProperty: this.interfaceBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'left',
      yAlign: 'bottom'
    } );

    // Zoom button group ====================================================================================================

    this.zoomButtonGroup = new MagnifyingGlassZoomButtonGroup( model.zoomLevelProperty, {
      spacing: 8,
      magnifyingGlassNodeOptions: {
        glassRadius: 8
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      tandem: options.tandem.createTandem( 'zoomButtonGroup' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    const zoomButtonGroupAlignBox = new AlignBox( this.zoomButtonGroup, {
      alignBoundsProperty: this.interfaceBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      xAlign: 'left',
      yAlign: 'top'
    } );

    // Button and message that appear at top-center ====================================================================

    const offScaleMessage = new Text( SolarSystemCommonStrings.offscaleMessageStringProperty, {
      visibleProperty: DerivedProperty.and( [ this.visibleProperties.gravityVisibleProperty, model.isAnyGravityForceOffscaleProperty ] ),
      font: new PhetFont( 16 ),
      fill: SolarSystemCommonColors.foregroundProperty,
      maxWidth: 320
    } );

    const returnBodiesButton = new TextPushButton( MySolarSystemStrings.returnBodiesStringProperty, {
      visibleProperty: model.bodiesAreReturnableProperty,
      listener: () => {
        model.restart();
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      font: SolarSystemCommonConstants.BUTTON_FONT,
      maxTextWidth: 190,
      containerTagName: 'div',
      tandem: options.tandem.createTandem( 'returnBodiesButton' ),
      phetioEnabledPropertyInstrumented: false // there's no reason to disable this button
    } );

    const topCenterAlignBox = new AlignBox( new HBox( {
      spacing: 20,
      heightSizable: false,
      preferredHeight: returnBodiesButton.height,
      children: [ returnBodiesButton, offScaleMessage ]
    } ), {
      alignBoundsProperty: this.interfaceBoundsProperty,
      xMargin: SolarSystemCommonConstants.SCREEN_VIEW_X_MARGIN,
      yMargin: SolarSystemCommonConstants.SCREEN_VIEW_Y_MARGIN,
      centerX: -visibilityControlPanel.width / 2,
      xAlign: 'center',
      yAlign: 'top'
    } );

    this.interfaceLayer.addChild( topCenterAlignBox );
    this.interfaceLayer.addChild( this.resetAllButton );
    this.interfaceLayer.addChild( bottomLeftAlignBox );
    this.interfaceLayer.addChild( topRightAlignBox );
    this.interfaceLayer.addChild( zoomButtonGroupAlignBox );

    this.interfaceLayer.pdomOrder = [
      timePanel,
      topCenterAlignBox,
      bottomLeftHBox,
      visibilityControlPanel,
      this.zoomButtonGroup,
      this.resetAllButton
    ];

    this.bottomLayer.addChild( new PathsCanvasNode( model.activeBodies, this.modelViewTransformProperty, this.visibleBoundsProperty, {
      visibleProperty: this.visibleProperties.pathVisibleProperty
    } ) );

    model.interruptBodiesSubtreeEmitter.addListener( () => {
      this.bodyNodes.forEach( bodyNode => {
        bodyNode.interruptSubtreeInput();
      } );
    } );
  }

  public override step( dt: number ): void {
    super.step( dt );
  }

  protected override getDragBoundsItems(): DragBoundsItem[] {
    return [
      ...super.getDragBoundsItems(),
      {
        node: this.topRightVBox,
        expandX: 'right',
        expandY: 'top'
      },
      {
        node: this.zoomButtonGroup,
        expandX: 'left',
        expandY: 'top'
      },

      // All of these Nodes are aligned at left-bottom
      ...[ this.hboxAboveValuesPanel, this.valuesPanel, this.numberOfBodiesControl, this.followCenterOfMassButton ].map( ( node: Node ): DragBoundsItem => {
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