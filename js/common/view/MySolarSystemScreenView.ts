// Copyright 2022-2023, University of Colorado Boulder

/**
 * MySolarSystemScreenView is the base class for ScreenViews in the My Solar System sim.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { AlignBox, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import VisibilityControlPanel from './VisibilityControlPanel.js';
import mySolarSystem from '../../mySolarSystem.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonScreenView, { BodyBoundsItem, SolarSystemCommonScreenViewOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonScreenView.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import ValuesPanel from './ValuesPanel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import BodyNode from '../../../../solar-system-common/js/view/BodyNode.js';
import VectorNode from '../../../../solar-system-common/js/view/VectorNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import PathsCanvasNode from './PathsCanvasNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import TimePanel from './TimePanel.js';
import UnitsInformationDialog from './UnitsInformationDialog.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';
import MySolarSystemVisibleProperties from './MySolarSystemVisibleProperties.js';
import DraggableVelocityVectorNode from '../../../../solar-system-common/js/view/DraggableVelocityVectorNode.js';
import NumberOfBodiesControl from './NumberOfBodiesControl.js';

type SelfOptions = EmptySelfOptions;

export type MySolarSystemScreenViewOptions = SelfOptions &
  PickRequired<SolarSystemCommonScreenViewOptions, 'tandem' | 'screenSummaryContent'>;

export default class MySolarSystemScreenView extends SolarSystemCommonScreenView<MySolarSystemVisibleProperties> {

  // VBox that contains the control panels in the top-right corner of the screen.
  protected readonly topRightVBox: Node;

  // HBox that contains controls that appear above the ValuesPanel.
  private readonly hboxAboveValuesPanel: Node;

  private readonly zoomButtons: Node;
  private readonly valuesPanel: Node;
  private readonly numberOfBodiesControl: Node;
  private readonly followCenterOfMassButton: Node;

  private readonly bodyNodes: BodyNode[];

  protected constructor( model: MySolarSystemModel, providedOptions: MySolarSystemScreenViewOptions ) {

    const options = optionize<MySolarSystemScreenViewOptions, SelfOptions, SolarSystemCommonScreenViewOptions>()( {

      // SolarSystemCommonScreenViewOptions
      centerOrbitOffset: new Vector2( SolarSystemCommonConstants.GRID_SPACING, SolarSystemCommonConstants.GRID_SPACING )
    }, providedOptions );

    super( model, new MySolarSystemVisibleProperties( options.tandem.createTandem( 'visibleProperties' ) ), options );

    // Create visibleProperty instances for Nodes in the view.
    this.visibleProperties.pathVisibleProperty.link( visible => {
      this.model.clearPaths();
      this.model.addingPathPoints = visible;
    } );

    // Creation of Nodes associates with each Body =====================================================================

    this.bodyNodes = [];
    const bodyNodesTandem = options.tandem.createTandem( 'bodyNodes' );
    const velocityVectorsTandem = options.tandem.createTandem( 'velocityVectorNodes' );
    const forceVectorsTandem = options.tandem.createTandem( 'forceVectorNodes' );

    model.availableBodies.forEach( body => {

      const bodyNode = new BodyNode( body, this.modelViewTransformProperty, {
        speedVisibleProperty: this.visibleProperties.speedVisibleProperty,
        mapPosition: this.constrainBoundaryViewPoint.bind( this ),
        soundViewNode: this,
        visibleProperty: body.isActiveProperty, // visible when the associated Body is active
        tandem: bodyNodesTandem.createTandem( `body${body.index}Node` )
      } );
      this.bodiesLayer.addChild( bodyNode );
      this.bodyNodes.push( bodyNode );

      const velocityVectorNode = new DraggableVelocityVectorNode( body, this.modelViewTransformProperty, {
        mapPosition: this.constrainBoundaryViewPoint.bind( this ),
        soundViewNode: this,
        visibleProperty: DerivedProperty.and( [ body.isActiveProperty, this.visibleProperties.velocityVisibleProperty ] ),
        tandem: velocityVectorsTandem.createTandem( `velocityVector${body.index}Node` )
      } );
      this.componentsLayer.addChild( velocityVectorNode );

      const forceVectorNode = new VectorNode( body, this.modelViewTransformProperty, body.forceProperty, model.forceScaleProperty, {
        fill: SolarSystemCommonColors.gravityColorProperty,
        constrainSize: true,
        visibleProperty: DerivedProperty.and( [ body.isActiveProperty, this.visibleProperties.gravityVisibleProperty ] ),
        tandem: forceVectorsTandem.createTandem( `forceVector${body.index}Node` )
      } );
      this.componentsLayer.addChild( forceVectorNode );
    } );

    // Center of Mass Node
    const centerOfMassNode = new CenterOfMassNode( model.centerOfMass, this.visibleProperties.centerOfMassVisibleProperty,
      this.modelViewTransformProperty, options.tandem.createTandem( 'centerOfMassNode' ) );
    this.componentsLayer.addChild( centerOfMassNode );

    // Panels in the top-right of the screen ===========================================================================

    const timePanel = new TimePanel( model, options.playingAllowedProperty, options.tandem.createTandem( 'timePanel' ) );

    const visibilityControlPanel = new VisibilityControlPanel( model, this.visibleProperties,
      options.tandem.createTandem( 'visibilityControlPanel' ) );

    this.topRightVBox = new VBox( {
      spacing: 7.5,
      stretch: true,
      children: [
        timePanel,
        visibilityControlPanel
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
        model.followAndCenterCenterOfMass();
        model.userControlledProperty.value = false;
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: SolarSystemCommonConstants.VBOX_SPACING / 2,
      font: SolarSystemCommonConstants.BUTTON_FONT,
      maxTextWidth: 200,
      baseColor: 'orange',
      tandem: options.tandem.createTandem( 'followCenterOfMassButton' )
    } );

    this.numberOfBodiesControl = new NumberOfBodiesControl( model.numberOfActiveBodiesProperty, {
      visible: model.isLab,
      tandem: model.isLab ? options.tandem.createTandem( 'numberOfBodiesControl' ) : Tandem.OPT_OUT
    } );
    
    const moreDataCheckbox = MySolarSystemCheckbox.createMoreDataCheckbox( model.moreDataProperty,
      model.isLab ? options.tandem.createTandem( 'moreDataCheckbox' ) : Tandem.OPT_OUT );

    const unitsInformationDialog = new UnitsInformationDialog(
      model.isLab ? options.tandem.createTandem( 'unitsInformationDialog' ) : Tandem.OPT_OUT );

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
            this.numberOfBodiesControl,
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

    const offScaleMessage = new Text( SolarSystemCommonStrings.offscaleMessageStringProperty, {
      visibleProperty: DerivedProperty.and( [ this.visibleProperties.gravityVisibleProperty, model.isAnyForceOffscaleProperty ] ),
      font: new PhetFont( 16 ),
      fill: SolarSystemCommonColors.foregroundProperty,
      maxWidth: 320
    } );

    const returnBodiesButton = new TextPushButton( MySolarSystemStrings.returnBodiesStringProperty, {
      visibleProperty: model.isAnyBodyEscapedProperty,
      listener: () => {
        model.restart();
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      font: SolarSystemCommonConstants.BUTTON_FONT,
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
      centerX: -visibilityControlPanel.width / 2,
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
      timePanel,
      topCenterAlignBox,
      bottomLeftHBox,
      visibilityControlPanel,
      this.zoomButtons,
      this.resetAllButton
    ];

    this.bottomLayer.addChild( new PathsCanvasNode( model.bodies, this.modelViewTransformProperty, this.visibleBoundsProperty, {
      visibleProperty: this.visibleProperties.pathVisibleProperty
    } ) );
  }

  public override step( dt: number ): void {
    super.step( dt );

    //TODO https://github.com/phetsims/my-solar-system/issues/237 does this really belong in step?
    this.bodyNodes.forEach( bodyNode => {
      if ( bodyNode.body.isActiveProperty.value ) {
        if ( this.model.isPlayingProperty.value ) {
          bodyNode.playSound();
        }
        else {
          bodyNode.stopSound();
        }
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
      ...[ this.hboxAboveValuesPanel, this.valuesPanel, this.numberOfBodiesControl, this.followCenterOfMassButton ].map( ( node: Node ): BodyBoundsItem => {
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