// Copyright 2023, University of Colorado Boulder

/**
 * Panel that shows the graph of the Ecceentricity of the orbit. Compared to other
 * orbits of the Solar System.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { AlignBox, HBox, Node, Path, Text, TextOptions } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import Range from '../../../../dot/js/Range.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import { Shape } from '../../../../kite/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

const FOREGROUND_COLOR_PROPERTY = MySolarSystemColors.foregroundProperty;

export default class FirstLawGraph extends AlignBox {

  public constructor( public model: KeplersLawsModel ) {

    const yAxisLength = 180;

    const modelYRange = new Range( 0, 1 );

    const yAxis = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, yAxisLength ), {
      fill: FOREGROUND_COLOR_PROPERTY,
      stroke: FOREGROUND_COLOR_PROPERTY
    } );

    const eccentricities = {
      Mercury: 0.2056,
      // Venus: 0.0068,
      Earth: 0.0167,
      // Mars: 0.0934,
      // Jupiter: 0.0484,
      // Saturn: 0.0542,
      // Uranus: 0.0472,
      // Neptune: 0.0086,
      // Pluto: 0.2488,
      Nereid: 0.75,
      Eris: 0.44,
      Halley: 0.967
    };

    const orbitAndValues = [];

    for ( const eccentricitiesKey in eccentricities ) {
      const orbit = eccentricitiesKey;
      // @ts-expect-error
      const value = eccentricities[ eccentricitiesKey ];
      const title = new Text( orbit, MySolarSystemConstants.TEXT_OPTIONS );
      orbitAndValues.push( new HBox( {
        y: yAxisLength * ( value - 0.05 ),
        x: -title.width - 30,
        spacing: 5,
        children: [
          title,
          new ArrowNode( 0, 0, 20, 0, { stroke: FOREGROUND_COLOR_PROPERTY, fill: FOREGROUND_COLOR_PROPERTY, tailWidth: 1 } )
        ]
      } ) );
    }

    const actualEccentricity = new HBox( {
      x: 10,
      children: [
        new ArrowNode( 0, 0, -20, 0, { stroke: 'fuchsia', fill: 'fuchsia', tailWidth: 1 } ),
        new NumberDisplay( model.engine.eccentricityProperty, modelYRange, {
          decimalPlaces: 2,
          textOptions: combineOptions<TextOptions>( {
            fill: 'fuchsia'
          }, MySolarSystemConstants.TEXT_OPTIONS ),
          backgroundFill: null,
          backgroundStroke: null
        } )
      ]
    } );

    model.engine.eccentricityProperty.link( ( eccentricity: number ) => {
      actualEccentricity.y = yAxisLength * ( eccentricity - 0.05 );
    } );

    const chartTransform = new ChartTransform( {
      viewHeight: yAxisLength,
      modelYRange: modelYRange
    } );

    // y tick marks
    const YSpacing = 0.1;
    const YTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, YSpacing, {
      edge: 'min',
      stroke: MySolarSystemColors.foregroundProperty
    } );

    super( new Node( {
      children: [
        ...orbitAndValues,
        yAxis,
        YTickMarkSet,
        actualEccentricity
      ]
    } ), {
      layoutOptions: {
        align: 'center'
      }
    } );
  }
}

mySolarSystem.register( 'FirstLawGraph', FirstLawGraph );