// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 * 
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { AlignBox, HBox, Node, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Body from '../model/Body.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import BodyNode from './BodyNode.js';
import MySolarSystemControls from './MySolarSystemControls.js';
import MySolarSystemGridNode from './MySolarSystemGridNode.js';
import MySolarSystemTimeControlNode from './MySolarSystemTimeControlNode.js';
import mySolarSystem from '../../mySolarSystem.js';
import VectorNode from './VectorNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import ViewSynchronizer from './ViewSynchronizer.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import CommonModel from '../model/CommonModel.js';
import DraggableVectorNode from './DraggableVectorNode.js';
import PathsWebGLNode from './PathsWebGLNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type CommonScreenViewOptions = SelfOptions & ScreenViewOptions;

class CommonScreenView extends ScreenView {
  protected readonly bodiesLayer = new Node();
  protected readonly componentsLayer = new Node();
  protected readonly interfaceLayer = new Node();
  protected readonly topLayer = new Node();
  protected readonly bottomLayer = new Node();

  public constructor( model: CommonModel, providedOptions: CommonScreenViewOptions ) {
    super( providedOptions );

    this.addChild( this.bottomLayer );
    this.addChild( this.bodiesLayer );
    this.addChild( this.componentsLayer );
    this.addChild( this.interfaceLayer );
    this.addChild( this.topLayer );

    const modelViewTransformProperty = new DerivedProperty( [ model.zoomProperty ], zoom => {
      return ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        Vector2.ZERO,
        new Vector2( this.layoutBounds.center.x, this.layoutBounds.center.y - MySolarSystemConstants.GRID.spacing ),
        zoom );
      } );

    // Add the node for the overlay grid, setting its visibility based on the model.showGridProperty
    // const gridNode = new MySolarSystemGridNode( scene.transformProperty, scene.gridSpacing, scene.gridCenter, 28 );
    const gridNode = new MySolarSystemGridNode(
      modelViewTransformProperty,
      MySolarSystemConstants.GRID.spacing,
      Vector2.ZERO,
      28,
      {
        stroke: MySolarSystemColors.gridIconStrokeColorProperty,
        lineWidth: 1
     } );
     model.gridVisibleProperty.linkAttribute( gridNode, 'visible' );
     this.interfaceLayer.addChild( gridNode );

    // Body and Arrows Creation =================================================================================================
    // Setting the Factory functions that will create the necessary Nodes

    const bodyNodeSynchronizer = new ViewSynchronizer( this.bodiesLayer, ( body: Body ) => {
      return new BodyNode( body, modelViewTransformProperty, {
        mainColor: MySolarSystemColors.bodiesPalette[ this.bodiesLayer.getChildrenCount() ]
      } );
    } );

    const velocityVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, ( body: Body ) => {
      return new DraggableVectorNode(
        body, modelViewTransformProperty, model.velocityVisibleProperty, body.velocityProperty,
        1, 'V', { fill: PhetColorScheme.VELOCITY }
        );
    } );

    const forceVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, ( body: Body ) => {
      return new VectorNode(
        body, modelViewTransformProperty, model.gravityVisibleProperty, body.forceProperty,
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

    const centerOfMassNode = new CenterOfMassNode( model.centerOfMass, modelViewTransformProperty );
    this.componentsLayer.addChild( centerOfMassNode );

    // UI Elements ===================================================================================================
    // Zoom Buttons
    this.interfaceLayer.addChild( new AlignBox( new MagnifyingGlassZoomButtonGroup(
      model.zoomLevelProperty,
      {
        spacing: 8, magnifyingGlassNodeOptions: { glassRadius: 8 }
      } ),
      {
        alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'left', yAlign: 'top'
      } ) );

    const timeControlNode = new MySolarSystemTimeControlNode( model,
      {
        restartListener: () => model.restart(),
        stepForwardListener: () => model.stepForward(),
        tandem: providedOptions.tandem.createTandem( 'timeControlNode' )
      } );
    timeControlNode.setPlayPauseButtonCenter( new Vector2(
      this.layoutBounds.centerX - 117,
      this.layoutBounds.bottom - timeControlNode.height / 2 - MySolarSystemConstants.MARGIN
    ) );

    const clockNode = new VBox( {
      children: [
        new NumberDisplay( model.timeProperty, model.timeRange ),
        new TextPushButton( mySolarSystemStrings.clearProperty, {
          font: new PhetFont( 16 ),
          listener: () => { model.timeProperty.value = 0; },
          maxTextWidth: 130
        } )
      ],
      spacing: 8
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        
      },
      right: this.layoutBounds.maxX - MySolarSystemConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MySolarSystemConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: providedOptions.tandem.createTandem( 'resetAllButton' )
    } );

    this.interfaceLayer.addChild( new AlignBox( new HBox( {
      children: [
        timeControlNode,
        clockNode,
        resetAllButton
      ],
      spacing: 20
    } ),
    {
      alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'right', yAlign: 'bottom'
    } ) );

    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    this.interfaceLayer.addChild( new AlignBox( new Panel(
      new MySolarSystemControls( model, this.topLayer ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS ),
      {
     alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'right', yAlign: 'top'
    } ) );

    //REVIEW: use visibleProperty
    const pathsWebGLNode = new PathsWebGLNode( model, modelViewTransformProperty, { visible: false } );
    model.pathVisibleProperty.link( visible => {
      pathsWebGLNode.visible = visible;
      model.clearPaths();
    } );
    this.bottomLayer.addChild( pathsWebGLNode );
  }

  public update(): void {
    // See subclass for implementation
  }
}

mySolarSystem.register( 'CommonScreenView', CommonScreenView );
export default CommonScreenView;