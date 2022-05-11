// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 * 
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { AlignBox, FlowBox, Node } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Body from '../../common/model/Body.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import BodyNode from '../../common/view/BodyNode.js';
import MySolarSystemControls from '../../common/view/MySolarSystemControls.js';
import MySolarSystemGridNode from '../../common/view/MySolarSystemGridNode.js';
import MySolarSystemTimeControlNode from '../../common/view/MySolarSystemTimeControlNode.js';
import mySolarSystem from '../../mySolarSystem.js';
import IntroModel from '../model/IntroModel.js';
import VectorNode from '../../common/view/VectorNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import NodeTracker from '../../common/view/NodeTracker.js';
import CenterOfMassNode from '../../common/view/CenterOfMassNode.js';

// constants
const MARGIN = 5;

class IntroScreenView extends ScreenView {
  bodiesLayerNode: Node;
  ComponentsLayerNode: Node;
  UILayerNode: Node;

  constructor( model: IntroModel, tandem: Tandem ) {
    super( {
      tandem: tandem
    } );
    this.bodiesLayerNode = new Node();
    this.ComponentsLayerNode = new Node();
    this.UILayerNode = new Node();

    this.addChild( this.bodiesLayerNode );
    this.addChild( this.ComponentsLayerNode );
    this.addChild( this.UILayerNode );

    // Add the node for the overlay grid, setting its visibility based on the model.showGridProperty
    // const gridNode = new MySolarSystemGridNode( scene.transformProperty, scene.gridSpacing, scene.gridCenter, 28 );
    const gridNode = new MySolarSystemGridNode( new Property( ModelViewTransform2.createIdentity() ), 50, this.layoutBounds.center, 28, {
      stroke: MySolarSystemColors.gridIconStrokeColorProperty,
      lineWidth: 1.5
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
      return new VectorNode(
        body, new Property( modelViewTransform ), model.velocityVisibleProperty, body.velocityProperty,
        1, PhetColorScheme.VELOCITY
        );
    };
    const forceVectorFactory = ( body: Body ) => {
      return new VectorNode(
        body, new Property( modelViewTransform ), model.gravityVisibleProperty, body.forceProperty,
        0.05, PhetColorScheme.GRAVITATIONAL_FORCE
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

    const centerOfMassNode = new CenterOfMassNode( model.centerOfMassPositionProperty, modelViewTransform );
    this.ComponentsLayerNode.addChild( centerOfMassNode );

    // UI ----------------------------------------------------------------------------------
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - MySolarSystemConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MySolarSystemConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Add play/pause, rewind, and step buttons
    const timeControlNode = new MySolarSystemTimeControlNode( model,
      {
        restartListener: () => model.restart(),
        stepForwardListener: () => model.stepForward(),
        tandem: tandem.createTandem( 'timeControlNode' )
      } );
    timeControlNode.setPlayPauseButtonCenter( new Vector2( this.layoutBounds.centerX - 117, this.layoutBounds.bottom - timeControlNode.height / 2 - MARGIN ) );

    this.UILayerNode.addChild( new AlignBox( new FlowBox( {
      children: [
        timeControlNode,
        resetAllButton
      ],
      orientation: 'horizontal',
      spacing: 20
    } ),
    {
      alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'bottom'
    } ) );
    // spacing to put the SpeedRadioButtonGroup at the edge of the layout bounds - current spacing
    // plus distance from the left of the TimeControlNode to left edge of layout bounds
    // timeControlNode.setButtonGroupXSpacing( timeControlNode.getButtonGroupXSpacing() + timeControlNode.left - this.layoutBounds.left - MARGIN );

    const controlPanel = new MySolarSystemControls( model );

    // add the control panel on top of the canvases
    this.UILayerNode.addChild( new AlignBox( new Panel( controlPanel, MySolarSystemConstants.CONTROL_PANEL_OPTIONS ),
      {
     alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top'
    } ) );
  }


  /**
   * Resets the view.
   */
  reset(): void {
    //TODO
  }

  override step( dt: number ): void {
    //TODO
  }
}

mySolarSystem.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;