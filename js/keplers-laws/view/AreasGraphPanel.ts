// Copyright 2022, University of Colorado Boulder

/**
 * Panel that shows the graph of the swept area under the curve of the orbit.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { Color, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import BarPlot from '../../../../bamboo/js/BarPlot.js';

const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

export default class AreasGraphPanel extends Panel {

  public constructor( public model: KeplersLawsModel ) {

    const options = combineOptions<PanelOptions>( {
      visibleProperty: DerivedProperty.and( [ model.areasVisibleProperty, model.areaGraphVisibleProperty ] )
    }, MySolarSystemConstants.CONTROL_PANEL_OPTIONS );

    const xAxisLength = 120;
    const yAxisLength = 180;

    const title = new Text( MySolarSystemStrings.areaGraph.titleStringProperty, TITLE_OPTIONS );

    const xAxis = new ArrowNode( 0, 0, xAxisLength, 0, {
      fill: 'white',
      stroke: 'white',
      tailWidth: 1
    } );
    const yAxis = new ArrowNode( 0, 0, 0, -yAxisLength, {
      fill: 'white',
      stroke: 'white',
      tailWidth: 1
    } );

    const barPlot = new AreasBarPlot( model, { viewWidth: xAxisLength, viewHeight: yAxisLength } );
    barPlot.y = -yAxisLength;

    super( new VBox(
      {
        children: [
          title,
          new Node( {
            children: [
              barPlot,
              xAxis,
              yAxis
            ]
          } )
        ]
      }
    ), options );
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
      const modelYRange = new Range( 0, 1 );

      // one data point for each integer point in the model, y values interpolated along the x range from min to max
      let dataSet: Vector2[] = [];

      const chartTransform = new ChartTransform( {
        viewWidth: options.viewWidth,
        viewHeight: options.viewHeight,
        modelXRange: modelXRange,
        modelYRange: modelYRange
      } );

      const chartRectangle = new ChartRectangle( chartTransform );

      const barPlot = new BarPlot( chartTransform, dataSet.map( vector => new Vector2( vector.x, vector.y ) ), {
        pointToPaintableFields: ( point: Vector2 ) => {
          return { fill: new Color( 'fuchsia' ).darkerColor( point.y ) }; // TODO: How to set the opacity based on area.completion?
        }
      } );

      // anything you want clipped goes in here
      const chartClip = new Node( {
        clipArea: chartRectangle.getShape(),
        children: [
          barPlot
        ]
      } );

      this.children = [ chartRectangle, chartClip ];

      const orbitChangedListener = () => {
        const activeAreas = model.engine.orbitalAreas.filter( area => area.active );
        dataSet = [];
        modelXRange = new Range( -1, activeAreas.length );
        activeAreas.forEach( ( area, index ) => {
          const height = ( area.entered === 1 ) && !area.insideProperty.value ? 1 : area.completion;
          dataSet.push( new Vector2( index, height ) );
        } );
        barPlot.setDataSet( dataSet );
      };
      model.engine.changedEmitter.addListener( orbitChangedListener );
    }
}

mySolarSystem.register( 'AreasGraphPanel', AreasGraphPanel );