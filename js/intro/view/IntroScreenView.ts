// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Jonathan Olson
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { AlignBox, FlowBox } from '../../../../scenery/js/imports.js';
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

// constants
const MARGIN = 5;

class IntroScreenView extends ScreenView {

  constructor( model: IntroModel, tandem: Tandem ) {
    super( {
      tandem: tandem
    } );

    // Add the node for the overlay grid, setting its visibility based on the model.showGridProperty
    // const gridNode = new MySolarSystemGridNode( scene.transformProperty, scene.gridSpacing, scene.gridCenter, 28 );
    const gridNode = new MySolarSystemGridNode( new Property( ModelViewTransform2.createIdentity() ), 50, this.layoutBounds.center, 28, {
      stroke: MySolarSystemColors.gridIconStrokeColorProperty,
      lineWidth: 1.5
    } );
    model.gridVisibleProperty.linkAttribute( gridNode, 'visible' );
    this.addChild( gridNode );

    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      this.layoutBounds.center,
      1
    );

    const bodyNodesMap = new Map<Body, BodyNode>();

    const addBodyNode = ( body: Body ) => {
      const bodyNode = new BodyNode( body, modelViewTransform );
      bodyNodesMap.set( body, bodyNode );
      this.addChild( bodyNode );
    };

    const removeBodyNode = ( body: Body ) => {
      const bodyNode = bodyNodesMap.get( body )!;
      bodyNodesMap.delete( body );
      this.removeChild( bodyNode );
      bodyNode.dispose();
    };

    model.bodies.forEach( addBodyNode );
    model.bodies.elementAddedEmitter.addListener( addBodyNode );
    model.bodies.elementRemovedEmitter.addListener( removeBodyNode );

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

    this.addChild( new AlignBox( new FlowBox( {
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
    this.addChild( new AlignBox( new Panel( controlPanel, MySolarSystemConstants.CONTROL_PANEL_OPTIONS ),
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