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
import MySolarSystemColors from '../MySolarSystemColors.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import MySolarSystemGridNode from './MySolarSystemGridNode.js';
import MySolarSystemTimeControlNode from './MySolarSystemTimeControlNode.js';
import mySolarSystem from '../../mySolarSystem.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CommonModel from '../model/CommonModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import Property from '../../../../axon/js/Property.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;

export type CommonScreenViewOptions = SelfOptions & ScreenViewOptions;

class CommonScreenView extends ScreenView {
  protected readonly bodiesLayer = new Node();
  protected readonly componentsLayer = new Node();
  protected readonly interfaceLayer = new Node();
  protected readonly topLayer = new Node();
  protected readonly bottomLayer = new Node();

  protected readonly timeBox: HBox;

  protected readonly modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2>;

  public constructor( model: CommonModel, providedOptions: CommonScreenViewOptions ) {
    super( providedOptions );

    this.addChild( this.bottomLayer );
    this.addChild( this.bodiesLayer );
    this.addChild( this.componentsLayer );
    this.addChild( this.interfaceLayer );
    this.addChild( this.topLayer );

    this.modelViewTransformProperty = new DerivedProperty( [ model.zoomProperty ], zoom => {
      return ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        Vector2.ZERO,
        new Vector2( this.layoutBounds.center.x, this.layoutBounds.center.y - MySolarSystemConstants.GRID.spacing * 0.5 ),
        zoom );
      } );

    // Add the node for the overlay grid, setting its visibility based on the model.showGridProperty
    // const gridNode = new MySolarSystemGridNode( scene.transformProperty, scene.gridSpacing, scene.gridCenter, 28 );
    this.interfaceLayer.addChild( new MySolarSystemGridNode(
      this.modelViewTransformProperty,
      MySolarSystemConstants.GRID.spacing,
      Vector2.ZERO,
      28,
      {
        stroke: MySolarSystemColors.gridIconStrokeColorProperty,
        visibleProperty: model.gridVisibleProperty
     } ) );

    // Center of Mass Node =====================================================================================================

    const centerOfMassNode = new CenterOfMassNode( model.centerOfMass, this.modelViewTransformProperty );
    this.componentsLayer.addChild( centerOfMassNode );

    // UI Elements ===================================================================================================

    const measuringTapeUnitsProperty = new Property( { name: 'AU', multiplier: 0.01 } );

    // Add the MeasuringTapeNode
    const measuringTapeNode = new MeasuringTapeNode( measuringTapeUnitsProperty, {
      visibleProperty: model.measuringTapeVisibleProperty,
      textColor: 'black',
      textBackgroundColor: 'rgba( 255, 255, 255, 0.5 )', // translucent red
      textBackgroundXMargin: 10,
      textBackgroundYMargin: 3,
      textBackgroundCornerRadius: 5,
      basePositionProperty: new Vector2Property( new Vector2( 0, 100 ) ),
      tipPositionProperty: new Vector2Property( new Vector2( 100, 100 ) ),
      tandem: providedOptions.tandem.createTandem( 'measuringTapeNode' )
    } );
    this.modelViewTransformProperty.link( modelViewTransform => {
      measuringTapeNode.modelViewTransformProperty.value = modelViewTransform;
    } );
    this.topLayer.addChild( measuringTapeNode );


    const timeControlNode = new MySolarSystemTimeControlNode( model,
      {
        restartListener: () => model.restart(),
        stepForwardListener: () => model.stepOnce( 1 / 4 ),
        tandem: providedOptions.tandem.createTandem( 'timeControlNode' )
      } );
    timeControlNode.setPlayPauseButtonCenter( new Vector2(
      this.layoutBounds.centerX - 117,
      this.layoutBounds.bottom - timeControlNode.height / 2 - MySolarSystemConstants.MARGIN
    ) );

    const clockNode = new VBox( {
      children: [
        new NumberDisplay( model.timeProperty, model.timeRange ),
        new TextPushButton( MySolarSystemStrings.clearStringProperty, {
          font: new PhetFont( 16 ),
          listener: () => { model.timeProperty.value = 0; },
          maxTextWidth: 130,
          tandem: providedOptions.tandem.createTandem( 'clearButton' )
        } )
      ],
      spacing: 8
    } );

    this.timeBox = new HBox( {
      children: [ timeControlNode, clockNode ],
      layoutOptions: { yAlign: 'bottom', column: 1 },
      spacing: 10
      } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        measuringTapeNode.reset();
      },
      tandem: providedOptions.tandem.createTandem( 'resetAllButton' )
    } );

    const resetAllButtonBox = new AlignBox( resetAllButton,
      {
        margin: MySolarSystemConstants.MARGIN,
        xAlign: 'right',
        yAlign: 'bottom'
      } );

    this.visibleBoundsProperty.link( visibleBounds => {
      resetAllButtonBox.alignBounds = visibleBounds;
    } );

    this.interfaceLayer.addChild( resetAllButtonBox );
  }

  //REVIEW: Perhaps making CommonScreenView an abstract class (and making this method abstract) would be appropriate
  public update(): void {
    // See subclass for implementation
  }
}

mySolarSystem.register( 'CommonScreenView', CommonScreenView );
export default CommonScreenView;