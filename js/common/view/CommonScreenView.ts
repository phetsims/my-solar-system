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
import Body from '../model/Body.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import BodyNode from './BodyNode.js';
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
import CommonModel from '../model/CommonModel.js';
import DraggableVectorNode from './DraggableVectorNode.js';
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
    const gridNode = new MySolarSystemGridNode(
      this.modelViewTransformProperty,
      MySolarSystemConstants.GRID.spacing,
      Vector2.ZERO,
      28,
      {
        stroke: MySolarSystemColors.gridIconStrokeColorProperty,
        //REVIEW: lineWidth: 1 is the default, it can generally be ignored (and it's also specified in the type)
        lineWidth: 1
        //REVIEW: indentation is wonky after this line, we shouldn't have the extra spaces
     } );

    //REVIEW: pass this in as { visibleProperty: model.gridVisibleProperty }, so this extra linkAttribute isn't needed
    //REVIEW: Then we don't need a local variable for gridNode either
     model.gridVisibleProperty.linkAttribute( gridNode, 'visible' );
     this.interfaceLayer.addChild( gridNode );

    // Body and Arrows Creation =================================================================================================
    // Setting the Factory functions that will create the necessary Nodes

    const bodyNodeSynchronizer = new ViewSynchronizer( this.bodiesLayer, ( body: Body ) => {
      return new BodyNode( body, this.modelViewTransformProperty, {
        mainColor: MySolarSystemColors.bodiesPalette[ this.bodiesLayer.getChildrenCount() ]
      } );
    } );

    const velocityVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, ( body: Body ) => {
      return new DraggableVectorNode(
        body, this.modelViewTransformProperty, model.velocityVisibleProperty, body.velocityProperty,
        //REVIEW: translatable label! Also factor this out with the kepler's law version
        1, 'V', { fill: PhetColorScheme.VELOCITY }
        );
    } );

    const forceVectorSynchronizer = new ViewSynchronizer( this.componentsLayer, ( body: Body ) => {
      return new VectorNode(
        body, this.modelViewTransformProperty, model.gravityVisibleProperty, body.forceProperty,
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

    const centerOfMassNode = new CenterOfMassNode( model.centerOfMass, this.modelViewTransformProperty );
    this.componentsLayer.addChild( centerOfMassNode );

    // UI Elements ===================================================================================================

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
          maxTextWidth: 130
        } )
      ],
      spacing: 8
    } );


    const measuringTapeUnitsProperty = new Property( { name: '', multiplier: 1.0 } );

    // Add the MeasuringTapeNode
    const measuringTapeNode = new MeasuringTapeNode( measuringTapeUnitsProperty, {
      visibleProperty: model.measuringTapeVisibleProperty,
      textColor: 'black',
      textBackgroundColor: 'rgba( 255, 255, 255, 0.5 )', // translucent red
      textBackgroundXMargin: 10,
      textBackgroundYMargin: 3,
      textBackgroundCornerRadius: 5,
      //REVIEW: commented-out code, can this be deleted?
      // dragBounds: this.layoutBounds,
      basePositionProperty: new Vector2Property( new Vector2( 0, 100 ) ),
      tipPositionProperty: new Vector2Property( new Vector2( 100, 100 ) )
    } );
    // this.visibleBoundsProperty.link( visibleBounds => measuringTapeNode.setDragBounds( visibleBounds.eroded( 20 ) ) );
    this.modelViewTransformProperty.link( modelViewTransform => {
      measuringTapeNode.modelViewTransformProperty.value = modelViewTransform;
    } );
    this.topLayer.addChild( measuringTapeNode );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        measuringTapeNode.reset();
      },
      //REVIEW: AlignBox it?
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
  }

  //REVIEW: Perhaps making CommonScreenView an abstract class (and making this method abstract) would be appropriate
  public update(): void {
    // See subclass for implementation
  }
}

mySolarSystem.register( 'CommonScreenView', CommonScreenView );
export default CommonScreenView;