// Copyright 2022-2023, University of Colorado Boulder

/**
 * Kepler's third law accordion box
 * Shows a graph of a vs. T with the data from the orbit
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { Circle, GridBox, HBox, Node, NodeOptions, Path, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import EllipticalOrbit from '../model/EllipticalOrbit.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';

//REVIEW: Try factoring this out from the places it's seen (it's a few)
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

//REVIEW: Try factoring this out from the places it's seen (it's a few)
const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

export type ThirdLawPanelOptions = PanelOptions;

export default class ThirdLawPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const options = combineOptions<ThirdLawPanelOptions>( {
      visibleProperty: model.isThirdLawProperty,
      fill: MySolarSystemColors.backgroundProperty,
      stroke: MySolarSystemColors.gridIconStrokeColorProperty
    }, MySolarSystemConstants.CONTROL_PANEL_OPTIONS );

    const semiMajorAxisValueRange = new RangeWithValue( 1, 10000, model.engine.a );
    const periodValueRange = new RangeWithValue( 1, 10000, model.engine.T );

    super( new VBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.graph.titleStringProperty, TITLE_OPTIONS ),
        new GridBox( {
          children: [
            // Period power buttons
            new RectangularRadioButtonGroup(
              model.selectedPeriodPowerProperty,
              [
                {
                  value: 1,
                  //REVIEW: We should probably make these terms translatable
                  createNode: tandem => new RichText( 'T', TEXT_OPTIONS )
                },
                {
                  value: 2,
                  //REVIEW: And this should probably include string composition (e.g. combining the translated string for
                  //REVIEW: T with the superscript somehow?)
                  createNode: tandem => new RichText( 'T<sup>2</sup>', TEXT_OPTIONS )
                },
                {
                  value: 3,
                  createNode: tandem => new RichText( 'T<sup>3</sup>', TEXT_OPTIONS )
                }
              ],
              {
                layoutOptions: { column: 0, row: 0 }
              }
            ),
            // Semi-major axis power buttons
            new RectangularRadioButtonGroup(
              model.selectedAxisPowerProperty,
              [
                {
                  value: 1,
                  //REVIEW: We should probably make these terms translatable
                  createNode: tandem => new RichText( 'a', TEXT_OPTIONS )
                },
                {
                  value: 2,
                  createNode: tandem => new RichText( 'a<sup>2</sup>', TEXT_OPTIONS )
                },
                {
                  value: 3,
                  createNode: tandem => new RichText( 'a<sup>3</sup>', TEXT_OPTIONS )
                }
              ],
              {
                layoutOptions: { column: 1, row: 1 },
                orientation: 'horizontal'
              }
            ),
            new KeplerLawsGraph( model, model.engine, {
              layoutOptions: { column: 1, row: 0 },
              excludeInvisibleChildrenFromBounds: true
            } )
          ],
          spacing: 10
        } ),
        new HBox( {
          spacing: 10,
          layoutOptions: {
            align: 'right'
          },
          // visibleProperty: model.valuesVisibleProperty,
          children: [
            new Text( MySolarSystemStrings.graph.aStringProperty, TEXT_OPTIONS ),
            new NumberDisplay( model.engine.semimajorAxisProperty, semiMajorAxisValueRange, {
              decimalPlaces: 2
            } )
            ]
        } ),
        new HBox( {
          spacing: 10,
          layoutOptions: {
            align: 'right'
          },
          // visibleProperty: model.valuesVisibleProperty,
          children: [
            new Text( MySolarSystemStrings.graph.tStringProperty, TEXT_OPTIONS ),
            new NumberDisplay( model.engine.periodProperty, periodValueRange, {
              decimalPlaces: 2
            } )
          ]
        } )
      ]
    } ), options );
  }
}

class KeplerLawsGraph extends Node {
  public constructor( model: KeplersLawsModel, orbit: EllipticalOrbit, providedOptions?: NodeOptions ) {
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
        }, TITLE_OPTIONS ) );
      yAxisLabel = new RichText(
        periodText,
        combineOptions<RichTextOptions>( {
          x: -30, y: -axisLength * 0.4
        }, TITLE_OPTIONS ) );
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

mySolarSystem.register( 'ThirdLawPanel', ThirdLawPanel );