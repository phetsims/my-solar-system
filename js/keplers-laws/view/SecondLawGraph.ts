// Copyright 2023, University of Colorado Boulder

/**
 * Panel that shows the graph of the swept area under the curve of the orbit.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { Color, Node, PaintableOptions, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import BarPlot from '../../../../bamboo/js/BarPlot.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';


const FOREGROUND_COLOR_PROPERTY = MySolarSystemColors.foregroundProperty;

// How much bigger is the top of the graph compared to the total area
const UPSCALE = 1.3;

const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: FOREGROUND_COLOR_PROPERTY
};

export default class SecondLawGraph extends Panel {

  public constructor( public model: KeplersLawsModel ) {

    const options = combineOptions<PanelOptions>( {
      visibleProperty: model.isSecondLawProperty
    }, MySolarSystemConstants.CONTROL_PANEL_OPTIONS );

    const xAxisLength = 180;
    const yAxisLength = 180;

    const title = new Text( MySolarSystemStrings.areaGraph.titleStringProperty, TITLE_OPTIONS );

    const xAxis = new ArrowNode( 0, 0, xAxisLength, 0, {
      fill: FOREGROUND_COLOR_PROPERTY,
      stroke: FOREGROUND_COLOR_PROPERTY,
      tailWidth: 1
    } );
    const yAxis = new ArrowNode( 0, 0, 0, -yAxisLength, {
      fill: FOREGROUND_COLOR_PROPERTY,
      stroke: FOREGROUND_COLOR_PROPERTY,
      tailWidth: 1
    } );

    const barPlot = new AreasBarPlot( model, { viewWidth: xAxisLength, viewHeight: yAxisLength } );
    barPlot.y = -yAxisLength;

    const xAxisLabel = new Text( MySolarSystemStrings.area.periodDivisionStringProperty, TITLE_OPTIONS );
    const yAxisLabel = new RichText(
      MySolarSystemStrings.area.areaUnitsStringProperty,
      combineOptions<RichTextOptions>( {
        x: -25, centerY: -yAxisLength * 0.5, rotation: -Math.PI / 2
      }, MySolarSystemConstants.TITLE_OPTIONS ) );

    super( new VBox(
      {
        spacing: 10,
        children: [
          title,
          new Node( {
            children: [
              barPlot,
              xAxis,
              yAxis,
              yAxisLabel
            ]
          } ),
          xAxisLabel,
          new DivisionSlider( model )
        ]
      }
    ), options );
  }
}

class DivisionSlider extends HSlider {
  public constructor( model: KeplersLawsModel ) {
    const divisionsRange = new RangeWithValue( 2, model.maxDivisionValue, 4 );
    super( model.periodDivisionProperty, divisionsRange, {
      trackSize: new Dimension2( 150, 2 ),
      thumbSize: new Dimension2( 15, 25 ),
      thumbCenterLineStroke: FOREGROUND_COLOR_PROPERTY,
      trackFillEnabled: FOREGROUND_COLOR_PROPERTY,
      majorTickStroke: FOREGROUND_COLOR_PROPERTY,
      majorTickLength: 10,
      minorTickStroke: FOREGROUND_COLOR_PROPERTY,
      minorTickLength: 6,

      // Demonstrate larger x dilation.
      thumbTouchAreaXDilation: 30,
      thumbTouchAreaYDilation: 15,
      thumbMouseAreaXDilation: 10,
      thumbMouseAreaYDilation: 5,

      constrainValue: value => Utils.roundSymmetric( value )
    } );

    this.addMajorTick( divisionsRange.min, new Text( divisionsRange.min, MySolarSystemConstants.TEXT_OPTIONS ) );
    this.addMajorTick( divisionsRange.min + 0.50 * divisionsRange.getLength() );
    this.addMajorTick( divisionsRange.max, new Text( divisionsRange.max, MySolarSystemConstants.TEXT_OPTIONS ) );

    // minor ticks
    this.addMinorTick( divisionsRange.min + 0.25 * divisionsRange.getLength() );
    this.addMinorTick( divisionsRange.min + 0.75 * divisionsRange.getLength() );
  }
}

type AreasBarPlotOptions = {
  viewWidth?: number;
  viewHeight?: number;
};

class AreasBarPlot extends Node {

  public constructor( public model: KeplersLawsModel, providedOptions?: AreasBarPlotOptions ) {
    super();

    const options = combineOptions<AreasBarPlotOptions>( {
      viewWidth: 120,
      viewHeight: 180
    }, providedOptions );

    let modelXRange = new Range( -1, 6 );
    let modelYRange = new Range( 0, 1 );

    // one data point for each integer point in the model, y values interpolated along the x range from min to max
    let dataSet: Vector2[] = [];

    const chartTransform = new ChartTransform( {
      viewWidth: options.viewWidth,
      viewHeight: options.viewHeight,
      modelXRange: modelXRange,
      modelYRange: modelYRange
    } );

    const chartRectangle = new ChartRectangle( chartTransform );

    const barPlot = new BarPlot( chartTransform, dataSet.map( vector => new Vector2( vector.x, vector.y ) ) );

    // x Labels of each area bar
    const XTickLabelSet = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 1, {
      edge: 'min'
    } );

    // y tick marks
    // TODO: Based on this, is there an easier way to make iterable smaller (x1/10) or larger (x10) tick marks?
    const YSpacing = 2e4;
    const YTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, YSpacing, {
      edge: 'min',
      stroke: FOREGROUND_COLOR_PROPERTY
    } );
    const YTickMarkSetSecondary = new TickMarkSet( chartTransform, Orientation.VERTICAL, YSpacing * 10, {
      edge: 'min',
      stroke: FOREGROUND_COLOR_PROPERTY,
      lineWidth: 3
    } );

    const updateYRange = () => {
      modelYRange = new Range( 0, UPSCALE * this.model.engine.totalArea / 2 );
      chartTransform.setModelYRange( modelYRange );
      const ratio = modelYRange.max / YSpacing;
      if ( ratio > 15 ) {
        YTickMarkSet.opacity = Math.max( 0, 1 - ( ratio - 15 ) / 20 );
        YTickMarkSetSecondary.opacity = Math.min( 1, ( ratio - 15 ) / 20 );
      }
    };

    // Linking the period division to modify the chart ranges and labels
    this.model.periodDivisionProperty.link( periodDivision => {
      modelXRange = new Range( -1, periodDivision );
      chartTransform.setModelXRange( modelXRange );
      barPlot.barWidth = 15 * ( this.model.maxDivisionValue / periodDivision );
      barPlot.update();
      XTickLabelSet.setCreateLabel( ( value: number ) => {
        return ( value >= 0 && value < periodDivision ) ?
               new Text( ( value + 1 ).toString(), TITLE_OPTIONS ) : null;
      } );
      // updateYRange();
    } );

    this.model.engine.changedEmitter.addListener( () => {
      updateYRange();
    } );

    updateYRange();

    // anything you want clipped goes in here
    const chartClip = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [
        barPlot
      ]
    } );


    this.children = [
      chartRectangle,
      chartClip,
      XTickLabelSet,
      YTickMarkSet,
      YTickMarkSetSecondary
    ];

    const orbitChangedListener = () => {
      const activeAreas = model.engine.orbitalAreas.filter( area => area.active );
      dataSet = [];

      // First forEach is for updating the dataset, which will create the rectangles
      // Second forEach is for updating the color of the rectangles
      activeAreas.forEach( ( area, index ) => {
        // Setting all the bar's height and pushing them to the dataSet
        const height = area.alreadyEntered && !area.insideProperty.value ? model.engine.segmentArea : area.sweptArea;
        const realIndex = this.model.engine.retrograde ? this.model.periodDivisionProperty.value - index - 1 : index;
        dataSet.push( new Vector2( realIndex, height ) );
      } );
      barPlot.setDataSet( dataSet );

      activeAreas.forEach( ( area, index ) => {
        // Setting the color of the bar
        const alpha = area.insideProperty.value ? 1 : area.completion;
        const paintableFields: PaintableOptions = {
          fill: new Color( 'fuchsia' ).setAlpha( alpha )
        };
        // @ts-expect-error - mutate needs to know about the suboptions, see https://github.com/phetsims/scenery/issues/1428
        barPlot.rectangles[ index ].mutate( paintableFields );
      } );
    };
    model.engine.changedEmitter.addListener( orbitChangedListener );
  }
}

mySolarSystem.register( 'SecondLawGraph', SecondLawGraph );