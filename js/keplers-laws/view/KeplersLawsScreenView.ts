// Copyright 2022, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { AlignBox, FlowBox, Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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
import BodyNode from '../../common/view/BodyNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EllipticalOrbitNode from './EllipticalOrbitNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import DraggableVectorNode from '../../common/view/DraggableVectorNode.js';
import LawsButtons from './LawsButtons.js';
import LawMode from '../model/LawMode.js';

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
private readonly bodiesLayerNode: Node;
private readonly ComponentsLayerNode: Node;
private readonly UILayerNode: Node;
private readonly topLayer: Node;
private readonly bottomLayer: Node;

public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {
  super( {
    tandem: providedOptions.tandem
  } );

  this.topLayer = new Node();
  this.bottomLayer = new Node();
  this.bodiesLayerNode = new Node();
  this.ComponentsLayerNode = new Node();
  this.UILayerNode = new Node();

  this.addChild( this.bottomLayer );
  this.addChild( this.bodiesLayerNode );
  this.addChild( this.ComponentsLayerNode );
  this.addChild( this.UILayerNode );
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
    28, {
    stroke: MySolarSystemColors.gridIconStrokeColorProperty,
    lineWidth: 1
    } );
  model.gridVisibleProperty.linkAttribute( gridNode, 'visible' );
  this.UILayerNode.addChild( gridNode );

  const sun = model.bodies[ 0 ];
  const planet = model.bodies[ 1 ];

  this.bodiesLayerNode.addChild(
      new BodyNode(
        sun,
        modelViewTransformProperty,
        {
          mainColor: MySolarSystemColors.bodiesPalette[ 0 ],
          draggable: false
        }
        )
      );
  this.bodiesLayerNode.addChild(
      new BodyNode(
        planet,
        modelViewTransformProperty,
        { mainColor: MySolarSystemColors.bodiesPalette[ 1 ] }
        )
      );
  this.ComponentsLayerNode.addChild( new DraggableVectorNode(
    planet, modelViewTransformProperty, model.velocityVisibleProperty, planet.velocityProperty,
    1, 'V', { fill: PhetColorScheme.VELOCITY }
    ) );

  this.bottomLayer.addChild( new EllipticalOrbitNode( model, modelViewTransformProperty ) );

  // UI ----------------------------------------------------------------------------------
  // Zoom Buttons
  this.UILayerNode.addChild( new AlignBox( new FlowBox( {
    children: [
    new AreasAccordionBox( model, {
      visibleProperty: new DerivedProperty( [ model.selectedLawProperty ], selectedLaw => {
        return selectedLaw === LawMode.SECOND_LAW;
      } )
    } ),
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
  this.UILayerNode.addChild( new AlignBox( new KeplersLawsControls( model ),
    {
      alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top'
    } ) );

  // Slider that controls the small's body mass and its separation to the star
  this.UILayerNode.addChild( new AlignBox( new FlowBox( {
    children: [
      new LawsButtons( model ),
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