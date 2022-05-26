// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 * 
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { AlignBox, FlowBox, Node } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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
import NodeTracker from './NodeTracker.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import MassesControls from './MassesControls.js';
import { optionize3 } from '../../../../phet-core/js/optionize.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import CommonModel from '../model/CommonModel.js';
import DraggableVectorNode from './DraggableVectorNode.js';

// constants
const MARGIN = 5;

type SelfOptions = {
  tandem: Tandem;
  controlsOptions?: {
    orbitalInformation?: FlowBox;
    visibilityInformation?: FlowBox;
  };
};

export type CommonScreenViewOptions = SelfOptions;

class CommonScreenView extends ScreenView {
  bodiesLayerNode: Node;
  ComponentsLayerNode: Node;
  UILayerNode: Node;
  topLayer: Node;

  constructor( model: CommonModel, providedOptions: CommonScreenViewOptions ) {
    super( {
      tandem: providedOptions.tandem
    } );

    this.topLayer = new Node();
    this.bodiesLayerNode = new Node();
    this.ComponentsLayerNode = new Node();
    this.UILayerNode = new Node();

    this.addChild( this.bodiesLayerNode );
    this.addChild( this.ComponentsLayerNode );
    this.addChild( this.UILayerNode );
    this.addChild( this.topLayer );

    // Add the node for the overlay grid, setting its visibility based on the model.showGridProperty
    // const gridNode = new MySolarSystemGridNode( scene.transformProperty, scene.gridSpacing, scene.gridCenter, 28 );
    const gridNode = new MySolarSystemGridNode(
      new Property( ModelViewTransform2.createIdentity() ),
      MySolarSystemConstants.GRID.spacing,
      this.layoutBounds.center,
      28, {
      stroke: MySolarSystemColors.gridIconStrokeColorProperty,
      lineWidth: 1
      } );
     model.gridVisibleProperty.linkAttribute( gridNode, 'visible' );
     this.UILayerNode.addChild( gridNode );

    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      this.layoutBounds.center,
      1
    );

    // Setting the Factory functions that will create the necessary Nodes
    const bodyNodeFactory = ( body: Body ) => {
      return new BodyNode( body, modelViewTransform );
    };
    const velocityVectorFactory = ( body: Body ) => {
      return new DraggableVectorNode(
        body, new Property( modelViewTransform ), model.velocityVisibleProperty, body.velocityProperty,
        1, 'V', { fill: PhetColorScheme.VELOCITY }
        );
    };
    const forceVectorFactory = ( body: Body ) => {
      return new VectorNode(
        body, new Property( modelViewTransform ), model.gravityVisibleProperty, body.forceProperty,
        0.05, { fill: PhetColorScheme.GRAVITATIONAL_FORCE }
        );
    };

    // The NodeTrackers handle the creation and disposal of Model-View pairs
    const trackers: NodeTracker<any, Node>[] = [
      new NodeTracker<Body, BodyNode>( this.bodiesLayerNode, bodyNodeFactory ),
      new NodeTracker<Body, VectorNode>( this.ComponentsLayerNode, velocityVectorFactory ),
      new NodeTracker<Body, VectorNode>( this.ComponentsLayerNode, forceVectorFactory )
    ];

    model.bodies.forEach( body => {
      trackers.forEach( tracker => { tracker.add( body );} );
    } );

    // Set up listeners for object creation and disposal
    model.bodies.elementAddedEmitter.addListener( body => {
      trackers.forEach( tracker => { tracker.add( body );} );
    } );
    model.bodies.elementRemovedEmitter.addListener( body => {
      trackers.forEach( tracker => { tracker.remove( body );} );
    } );

    const centerOfMassNode = new CenterOfMassNode( model.centerOfMass, modelViewTransform );
    this.ComponentsLayerNode.addChild( centerOfMassNode );

    // UI ----------------------------------------------------------------------------------
    // Zoom Buttons
    this.UILayerNode.addChild( new AlignBox( new MagnifyingGlassZoomButtonGroup(
      model.zoomLevelProperty,
      {
        spacing: 8, magnifyingGlassNodeOptions: { glassRadius: 8 }
      } ),
      {
        alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'left', yAlign: 'top'
      }
      ) );

    const timeControlNode = new MySolarSystemTimeControlNode( model,
      {
        restartListener: () => model.restart(),
        stepForwardListener: () => model.stepForward(),
        tandem: providedOptions.tandem.createTandem( 'timeControlNode' )
      } );
    timeControlNode.setPlayPauseButtonCenter( new Vector2( this.layoutBounds.centerX - 117, this.layoutBounds.bottom - timeControlNode.height / 2 - MARGIN ) );

    const clockNode = new FlowBox( {
      children: [
        new NumberDisplay( model.timeProperty, model.timeRange ),
        new TextPushButton( 'Clear', {
          font: new PhetFont( 16 ),
          listener: () => { model.timeProperty.value = 0; },
          maxWidth: 200
        } )
      ],
      orientation: 'vertical',
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

    this.UILayerNode.addChild( new AlignBox( new FlowBox( {
      children: [
        timeControlNode,
        clockNode,
        resetAllButton
      ],
      orientation: 'horizontal',
      spacing: 20
    } ),
    {
      alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'bottom'
    } ) );

    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    this.UILayerNode.addChild( new AlignBox( new Panel(
      new MySolarSystemControls( model, this.topLayer ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS ),
      {
     alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top'
    } ) );

    // Slider that controls the bodies mass
    this.UILayerNode.addChild( new AlignBox( new Panel(
      new MassesControls( model ),
      optionize3<PanelOptions, {}, PanelOptions>()(
        {},
        MySolarSystemConstants.CONTROL_PANEL_OPTIONS,
        { fill: 'white' }
        ) ),
      {
     alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'left', yAlign: 'bottom'
    } ) );
  }
}

mySolarSystem.register( 'CommonScreenView', CommonScreenView );
export default CommonScreenView;