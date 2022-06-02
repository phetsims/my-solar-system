// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 * 
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { AlignBox, FlowBox, Node, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import MySolarSystemGridNode from '../../common/view/MySolarSystemGridNode.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemTimeControlNode from '../../common/view/MySolarSystemTimeControlNode.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import KeplersLawsControls from './KeplersLawsControls.js';
import AreasAccordionBox from './AreasAccordionBox.js';
import KeplersLawsSliders from './KeplersLawsSliders.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';

// constants
const MARGIN = 5;

type SelfOptions = {
tandem: Tandem;
controlsOptions?: {
  orbitalInformation?: FlowBox;
  visibilityInformation?: FlowBox;
  };
};

export type KeplersLawsScreenViewOptions = SelfOptions;

class KeplersLawsScreenView extends ScreenView {
bodiesLayerNode: Node;
ComponentsLayerNode: Node;
UILayerNode: Node;
topLayer: Node;

constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {
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

//  const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
//    Vector2.ZERO,
//    this.layoutBounds.center,
//    1
//  );

  // UI ----------------------------------------------------------------------------------
  // Zoom Buttons
  this.UILayerNode.addChild( new AlignBox( new FlowBox( {
    children: [
    new AreasAccordionBox( model ),
    new MagnifyingGlassZoomButtonGroup(
      model.zoomLevelProperty, { spacing: 8, magnifyingGlassNodeOptions: { glassRadius: 8 } } )
    ],
    orientation: 'horizontal',
    spacing: 10,
    align: 'top'
  } ),
    { alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'left', yAlign: 'top' }
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
  this.UILayerNode.addChild( new AlignBox( new KeplersLawsControls( model, this.topLayer ),
    {
      alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top'
    } ) );

  // Slider that controls the small's body mass and its separation to the star
  this.UILayerNode.addChild( new AlignBox( new FlowBox( {
    children: [
      new RectangularPushButton( { content: new Text( '1st and 2nd Laws' ), minHeight: 100 } ),
      new RectangularPushButton( { content: new Text( '3rd Law' ), minHeight: 100 } ),
      new KeplersLawsSliders( model )
    ],
    orientation: 'horizontal',
    align: 'bottom',
    spacing: 20
  } ),
    {
      alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'left', yAlign: 'bottom'
    } ) );
}
}

mySolarSystem.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;