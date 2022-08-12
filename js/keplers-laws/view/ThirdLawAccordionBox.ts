// Copyright 2022, University of Colorado Boulder

/**
 * Kepler's third law accordion box
 * Shows a graph of a vs. T with the data from the orbit
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { Circle, GridBox, Node, RichText, RichTextOptions, Text } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import EllipticalOrbit from '../model/EllipticalOrbit.js';
import Utils from '../../../../dot/js/Utils.js';
// import Multilink from '../../../../axon/js/Multilink.js';

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
            layoutOptions: { column: 0, row: 0 }
          }
        ),
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

    let yAxis = new RichText( '' );
    const maxSemimajorAxis = 4000;

    let xAxis = new RichText( '' );
    const maxPeriod = semimajorAxisToPeriod( maxSemimajorAxis );

    const dataPoint = new Circle( 5, {
      fill: 'red'
    } );

    // const linePath = new Path( null, {
    //   stroke: 'white'
    // } );

    const orbitUpdated = () => {
      const periodPower = model.selectedAxisPowerProperty.value;
      const axisPower = model.selectedPeriodPowerProperty.value;

      dataPoint.x = axisLength * Math.pow( Utils.linear(
        0, maxPeriod,
        0, 1,
        semimajorAxisToPeriod( orbit.a )
      ), periodPower );
      dataPoint.y = -axisLength * Math.pow( Utils.linear(
        0, maxSemimajorAxis,
        0, 1,
        orbit.a ), axisPower );
      dataPoint.visible = orbit.a < maxSemimajorAxis;

      const periodText = periodPower === 1 ? 'T' : 'T<sup>' + periodPower + '</sup>';
      const axisText = axisPower === 1 ? 'a' : 'a<sup>' + axisPower + '</sup>';
      xAxis = new RichText(
        periodText,
        combineOptions<RichTextOptions>( {
          x: axisLength * 0.4, y: 30
        }, TITLE_OPTIONS ) );
      yAxis = new RichText(
        axisText,
        combineOptions<RichTextOptions>( {
          x: -30, y: -axisLength * 0.4
        }, TITLE_OPTIONS ) );
      this.children = [
        // Y axis
        new ArrowNode( 0, 0, 0, -axisLength, {
          fill: 'white',
          stroke: 'white',
          tailWidth: 1
        } ),
        // X axis
        new ArrowNode( 0, 0, axisLength, 0, {
          fill: 'white',
          stroke: 'white',
          tailWidth: 1
        } ),
        xAxis,
        yAxis,
        dataPoint
      ];
    };

    model.selectedAxisPowerProperty.link( orbitUpdated );
    model.selectedPeriodPowerProperty.link( orbitUpdated );
    orbit.changedEmitter.addListener( orbitUpdated );
  }
}

mySolarSystem.register( 'ThirdLawAccordionBox', ThirdLawAccordionBox );