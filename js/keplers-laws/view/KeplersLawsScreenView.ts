// Copyright 2022, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { AlignBox, HBox, Node, VBox } from '../../../../scenery/js/imports.js';
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
import BodyNode from '../../common/view/BodyNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EllipticalOrbitNode from './EllipticalOrbitNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import DraggableVectorNode from '../../common/view/DraggableVectorNode.js';
import LawsButtons from './LawsButtons.js';
import ThirdLawAccordionBox from './ThirdLawAccordionBox.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AreasGraphPanel from './AreasGraphPanel.js';

// constants
const MARGIN = 5;

type SelfOptions = EmptySelfOptions;

export type KeplersLawsScreenViewOptions = SelfOptions & ScreenViewOptions;

class KeplersLawsScreenView extends ScreenView {
  private readonly bodiesLayer = new Node();
  private readonly componentsLayer = new Node();
  private readonly interfaceLayer = new Node();
  private readonly topLayer = new Node();
  private readonly bottomLayer = new Node();

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {
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
      28, {
        stroke: MySolarSystemColors.gridIconStrokeColorProperty,
        lineWidth: 1
      } );
    model.gridVisibleProperty.linkAttribute( gridNode, 'visible' );
    this.interfaceLayer.addChild( gridNode );

    const sun = model.bodies[ 0 ];
    const planet = model.bodies[ 1 ];

    this.bodiesLayer.addChild( new BodyNode(
      sun,
      modelViewTransformProperty,
      {
        mainColor: MySolarSystemColors.bodiesPalette[ 0 ],
        draggable: false
      }
    ) );
    this.bodiesLayer.addChild( new BodyNode(
      planet,
      modelViewTransformProperty,
      {
        mainColor: MySolarSystemColors.bodiesPalette[ 1 ]
      }
    ) );
    this.componentsLayer.addChild( new DraggableVectorNode(
      planet, modelViewTransformProperty, model.velocityVisibleProperty, planet.velocityProperty,
      1, 'V', { fill: PhetColorScheme.VELOCITY, zeroAllowed: false }
    ) );

    this.bottomLayer.addChild( new EllipticalOrbitNode( model, modelViewTransformProperty ) );

    // UI ----------------------------------------------------------------------------------
    // Zoom Buttons
    this.interfaceLayer.addChild( new AlignBox( new HBox( {
        children: [
          new VBox( {
            margin: 5,
            children: [
              new AreasAccordionBox( model ),
              new AreasGraphPanel( model )
            ]
          } ),
          new ThirdLawAccordionBox( model ),
          new MagnifyingGlassZoomButtonGroup(
            model.zoomLevelProperty, { spacing: 8, magnifyingGlassNodeOptions: { glassRadius: 8 } } )
        ],
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

    const clockNode = new VBox( {
      children: [
        new NumberDisplay( model.timeProperty, model.timeRange ),
        new TextPushButton( 'Clear', {
          font: new PhetFont( 16 ),
          listener: () => { model.timeProperty.value = 0; },
          maxWidth: 200
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
          new LawsButtons( model ),
          timeControlNode,
          clockNode,
          resetAllButton
        ],
        spacing: 20
      } ),
      {
        alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'center', yAlign: 'bottom'
      } ) );

    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    this.interfaceLayer.addChild( new AlignBox( new KeplersLawsControls( model ),
      {
        alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top'
      } ) );
  }
}

mySolarSystem.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;