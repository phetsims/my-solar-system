// Copyright 2023, University of Colorado Boulder

/**
 * Shows a graph of a vs. T with the data from the orbit
 *
 * @author Agustín Vallejo
 */

import KeplersLawsModel from '../model/KeplersLawsModel.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import { Circle, Node, NodeOptions, Path, RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Multilink from '../../../../axon/js/Multilink.js';
import mySolarSystem from '../../mySolarSystem.js';
import { Shape } from '../../../../kite/js/imports.js';

export default class ThirdLawGraph extends Node {
  public constructor( model: KeplersLawsModel, orbit: EllipticalOrbitEngine, providedOptions?: NodeOptions ) {
    super( providedOptions );

    const semimajorAxisToPeriod = ( axis: number ) => {
      return Math.pow( axis, 3 / 2 );
    };

    const axisLength = 120;

    const semimajorAxisToViewPoint = ( semimajorAxis: number ) => {
      const period = semimajorAxisToPeriod( semimajorAxis );
      const periodPower = model.selectedPeriodPowerProperty.value;
      const axisPower = model.selectedAxisPowerProperty.value;

      return new Vector2(
        axisLength * Math.pow( Utils.linear(
                     0, maxSemimajorAxis,
                     0, 1,
                     semimajorAxis ), axisPower ),
        -axisLength * Math.pow( Utils.linear(
                      0, maxPeriod,
                      0, 1,
                      period
                    ), periodPower )
      );
    };

    let xAxisLabel = new RichText( '' );
    let yAxisLabel = new RichText( '' );


    const xAxis = new ArrowNode( 0, 0, axisLength, 0, {
      fill: 'white',
      stroke: 'white',
      tailWidth: 1
    } );
    const yAxis = new ArrowNode( 0, 0, 0, -axisLength, {
      fill: 'white',
      stroke: 'white',
      tailWidth: 1
    } );

    const maxSemimajorAxis = 500;
    const maxPeriod = semimajorAxisToPeriod( maxSemimajorAxis );

    const dataPoint = new Circle( 5, {
      fill: 'red'
    } );

    const linePath = new Path( null, {
      stroke: 'white'
    } );

    const orbitUpdated = () => {
      dataPoint.translation = semimajorAxisToViewPoint( orbit.a );
      dataPoint.visible = orbit.a < maxSemimajorAxis;

      const periodPower = model.selectedPeriodPowerProperty.value;
      const axisPower = model.selectedAxisPowerProperty.value;

      const axisText = axisPower === 1 ? 'a' : 'a<sup>' + axisPower + '</sup>';
      const periodText = periodPower === 1 ? 'T' : 'T<sup>' + periodPower + '</sup>';

      //REVIEW: Why creating new RichText, instead of reusing the existing ones? Reusing would be more efficient.
      xAxisLabel = new RichText(
        axisText,
        combineOptions<RichTextOptions>( {
          x: axisLength * 0.4, y: 30
        }, MySolarSystemConstants.TITLE_OPTIONS ) );
      yAxisLabel = new RichText(
        periodText,
        combineOptions<RichTextOptions>( {
          x: -30, y: -axisLength * 0.4
        }, MySolarSystemConstants.TITLE_OPTIONS ) );
      this.children = [
        xAxis,
        yAxis,
        xAxisLabel,
        yAxisLabel,
        linePath,
        dataPoint
      ];
    };

    Multilink.multilink( [ model.selectedAxisPowerProperty, model.selectedPeriodPowerProperty ], () => {
      orbitUpdated();

      const shape = new Shape().moveTo( 0, 0 );
      for ( let axis = 0; axis <= maxSemimajorAxis; axis += maxSemimajorAxis / 100 ) {
        shape.lineToPoint( semimajorAxisToViewPoint( axis ) );
      }
      shape.makeImmutable();

      linePath.shape = shape;
    } );

    orbit.changedEmitter.addListener( orbitUpdated );
  }
}

mySolarSystem.register( 'ThirdLawGraph', ThirdLawGraph );