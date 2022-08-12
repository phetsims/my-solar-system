// Copyright 2022, University of Colorado Boulder

/**
 * Kepler's third law accordion box
 * Shows a graph of a vs. T with the data from the orbit
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { Circle, GridBox, Node, Path, RichText, RichTextOptions, Text } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import EllipticalOrbit from '../model/EllipticalOrbit.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

type ThirdLawAccordionBoxOptions = AccordionBoxOptions;

export default class ThirdLawAccordionBox extends AccordionBox {
  public constructor(
    model: KeplersLawsModel,
    providedOptions?: ThirdLawAccordionBoxOptions
  ) {
    const options = combineOptions<ThirdLawAccordionBoxOptions>( {
      titleNode: new Text( mySolarSystemStrings.graph.title, TITLE_OPTIONS ),
      expandedProperty: model.areasVisibleProperty,
      buttonXMargin: 5,
      buttonYMargin: 5,
      fill: MySolarSystemColors.backgroundProperty,
      stroke: MySolarSystemColors.gridIconStrokeColorProperty
    }, providedOptions );

    super( new GridBox( {
      children: [
        new RectangularRadioButtonGroup(
          model.selectedPeriodPowerProperty,
          [
            {
              value: 1,
              node: new RichText( 'T', TEXT_OPTIONS )
            },
            {
              value: 2,
              node: new RichText( 'T<sup>2</sup>', TEXT_OPTIONS )
            },
            {
              value: 3,
              node: new RichText( 'T<sup>3</sup>', TEXT_OPTIONS )
            }
          ],
          {
            layoutOptions: { column: 0, row: 0 }
          }
        ),
        new RectangularRadioButtonGroup(
          model.selectedAxisPowerProperty,
          [
            {
              value: 1,
              node: new RichText( 'a', TEXT_OPTIONS )
            },
            {
              value: 2,
              node: new RichText( 'a<sup>2</sup>', TEXT_OPTIONS )
            },
            {
              value: 3,
              node: new RichText( 'a<sup>3</sup>', TEXT_OPTIONS )
            }
          ],
          {
            layoutOptions: { column: 1, row: 1 },
            orientation: 'horizontal'
          }
        ),
        new KeplerLawsGraph( model, model.engine )
      ],
      spacing: 10
    } ), options );
  }
}

class KeplerLawsGraph extends Node {
  public constructor( model: KeplersLawsModel, orbit: EllipticalOrbit ) {
    super( {
      layoutOptions: { column: 1, row: 0 },
      excludeInvisibleChildrenFromBounds: true
    } );

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

mySolarSystem.register( 'ThirdLawAccordionBox', ThirdLawAccordionBox );