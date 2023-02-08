// Copyright 2020-2023, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { AlignBox, HBox, Node, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import GridNode from '../../../../scenery-phet/js/GridNode.js';
import MySolarSystemTimeControlNode from './MySolarSystemTimeControlNode.js';
import mySolarSystem from '../../mySolarSystem.js';
import CenterOfMassNode from './CenterOfMassNode.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CommonModel from '../model/CommonModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import Property from '../../../../axon/js/Property.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Body from '../model/Body.js';
import DraggableVectorNode, { DraggableVectorNodeOptions } from './DraggableVectorNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Panel from '../../../../sun/js/Panel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';


type SelfOptions = {
  playingAllowedProperty?: TReadOnlyProperty<boolean>;
};

export type CommonScreenViewOptions = SelfOptions & ScreenViewOptions;

class CommonScreenView extends ScreenView {
  protected readonly bodiesLayer = new Node();
  protected readonly componentsLayer = new Node();
  protected readonly interfaceLayer = new Node();
  protected readonly topLayer = new Node();
  protected readonly bottomLayer = new Node();

  protected readonly timeBox: Panel;

  protected readonly createDraggableVectorNode: ( body: Body, options?: DraggableVectorNodeOptions ) => DraggableVectorNode;

  // View position of where the geometrical center of the orbit is located
  protected readonly orbitalCenterProperty: Property<Vector2>;

  protected readonly modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2>;

  public constructor( model: CommonModel, providedOptions: CommonScreenViewOptions ) {
    super( providedOptions );

    this.addChild( this.bottomLayer );
    this.addChild( this.bodiesLayer );
    this.addChild( this.componentsLayer );
    this.addChild( this.interfaceLayer );
    this.addChild( this.topLayer );

    model.bodySoundManager.bodySoundClips.forEach( sound => soundManager.addSoundGenerator( sound, {
      associatedViewNode: this
    } ) );

    this.orbitalCenterProperty = new Vector2Property( this.layoutBounds.center );

    this.modelViewTransformProperty = new DerivedProperty(
      [ model.zoomProperty, this.orbitalCenterProperty ],
      ( zoom, orbitalCenter ) => {
        return ModelViewTransform2.createSinglePointScaleInvertedYMapping(
          Vector2.ZERO,
          new Vector2( orbitalCenter.x, orbitalCenter.y - MySolarSystemConstants.GRID.spacing * 0.5 ),
          zoom );
      } );

    // Add the node for the overlay grid, setting its visibility based on the model.showGridProperty
    this.interfaceLayer.addChild( new GridNode(
      this.modelViewTransformProperty,
      MySolarSystemConstants.GRID.spacing,
      Vector2.ZERO,
      28,
      {
        stroke: MySolarSystemColors.gridIconStrokeColorProperty,
        visibleProperty: model.gridVisibleProperty
      } ) );

    this.createDraggableVectorNode = ( body: Body, options?: DraggableVectorNodeOptions ) => {
      return new DraggableVectorNode(
        body,
        this.modelViewTransformProperty,
        model.velocityVisibleProperty,
        body.velocityProperty,
        1,
        MySolarSystemStrings.VStringProperty,
        combineOptions<DraggableVectorNodeOptions>( { fill: PhetColorScheme.VELOCITY }, options )
      );
    };

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
      tandem: providedOptions.tandem.createTandem( 'measuringTapeNode' ),
      significantFigures: 2
    } );
    this.topLayer.addChild( measuringTapeNode );


    const timeControlNode = new MySolarSystemTimeControlNode( model,
    {
      //REVIEW: Seems a bit weird to pass `undefined` through here. Should we || null it?
      enabledProperty: providedOptions.playingAllowedProperty,
      restartListener: () => model.restart(),
      stepForwardListener: () => model.stepOnce( 1 / 4 ),
      tandem: providedOptions.tandem.createTandem( 'timeControlNode' )
    } );

    const timeStringPatternProperty = new PatternStringProperty( MySolarSystemStrings.pattern.labelUnitsStringProperty, {
      units: MySolarSystemStrings.units.yearsStringProperty
    } );

    const clockNode = new HBox( {
      children: [
        new NumberDisplay( model.timeProperty, new Range( 0, 1000 ), {
          backgroundFill: null,
          backgroundStroke: null,
          textOptions: combineOptions<TextOptions>( {
            maxWidth: 80
          }, MySolarSystemConstants.TEXT_OPTIONS ),
          xMargin: 0,
          yMargin: 0,
          valuePattern: timeStringPatternProperty,
          decimalPlaces: 1
        } ),
        new TextPushButton( MySolarSystemStrings.clearStringProperty, {
          font: new PhetFont( 16 ),
          listener: model.timeProperty.reset,
          maxTextWidth: 65,
          tandem: providedOptions.tandem.createTandem( 'clearButton' ),
          touchAreaXDilation: 10,
          touchAreaYDilation: 10
        } )
      ],
      spacing: 8
    } );

    this.timeBox = new Panel( new VBox( {
      children: [ clockNode, timeControlNode ],
      //REVIEW: Why is this commented out?
      // layoutOptions: { yAlign: 'bottom', column: 1 },
      spacing: 10
    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        measuringTapeNode.reset();
        this.orbitalCenterProperty.reset();
      },
      touchAreaDilation: 10,
      tandem: providedOptions.tandem.createTandem( 'resetAllButton' )
    } );

    const resetAllButtonBox = new AlignBox( resetAllButton,
    {
      margin: MySolarSystemConstants.MARGIN,
      xAlign: 'right',
      yAlign: 'bottom'
    } );

    Multilink.multilink(
      [ this.visibleBoundsProperty, this.modelViewTransformProperty ],
      ( visibleBounds, modelViewTransform ) => {
        resetAllButtonBox.alignBounds = visibleBounds;
        measuringTapeNode.setDragBounds( modelViewTransform.viewToModelBounds( visibleBounds.eroded( 50 ) ) );
        measuringTapeNode.modelViewTransformProperty.value = modelViewTransform;
      }
    );

    this.interfaceLayer.addChild( resetAllButtonBox );
  }

  //REVIEW: Perhaps making CommonScreenView an abstract class (and making this method abstract) would be appropriate
  public update(): void {
    // See subclass for implementation
  }
}

mySolarSystem.register( 'CommonScreenView', CommonScreenView );
export default CommonScreenView;