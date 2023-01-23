// Copyright 2022-2023, University of Colorado Boulder

/**
 * Slider that controls the main body mass for the Third Law.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Panel from '../../../../sun/js/Panel.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import MySolarSystemSlider from '../../common/view/MySolarSystemSlider.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';

// constants
const SNAP_TOLERANCE = 0.05;
const THUMB_SIZE = new Dimension2( 14, 24 );
const NUM_TICKS = 4;
const WIDTH = 150;
const SPACING = ( WIDTH - NUM_TICKS ) / ( NUM_TICKS - 1 );

export default class ThirdLawSliderPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const defaultLabelValue = model.bodies[ 0 ].massProperty.value;
    const massRange = new RangeWithValue( defaultLabelValue / 2, 2 * defaultLabelValue, defaultLabelValue );
    const slider = new MySolarSystemSlider(
      model.bodies[ 0 ].massProperty,
      massRange,
      {
        trackSize: new Dimension2( WIDTH, 1 ),
        thumbSize: THUMB_SIZE,
        thumbTouchAreaXDilation: THUMB_SIZE.width,
        thumbTouchAreaYDilation: THUMB_SIZE.height,
        trackStroke: MySolarSystemColors.foregroundProperty,

        // ticks
        tickLabelSpacing: 3,
        majorTickLength: 13,
        majorTickStroke: MySolarSystemColors.foregroundProperty,

        // custom thumb
        thumbFill: '#98BECF',
        thumbFillHighlighted: '#B3D3E2',

        // snap to default value if close
        constrainValue: ( mass: number ) => Math.abs( mass - defaultLabelValue ) / defaultLabelValue < SNAP_TOLERANCE ? defaultLabelValue : mass,
        startDrag: () => { model.bodies[ 0 ].userControlledMassProperty.value = true; },
        endDrag: () => { model.bodies[ 0 ].userControlledMassProperty.value = false; }
        // tandem: tandem
      }
    );
    super( new VBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.starMassStringProperty, MySolarSystemConstants.TITLE_OPTIONS ),
        slider
      ]
    } ), {
      fill: MySolarSystemColors.controlPanelFillProperty,
      stroke: null
    } );

    // add ticks and labels
    // const defaultLabel = new Text( valueLabel, {
    const defaultLabel = new Text( MySolarSystemStrings.ourSunStringProperty, {
      top: 10,
      centerX: SPACING,
      font: new PhetFont( 13 ),
      fill: MySolarSystemColors.foregroundProperty,
      maxWidth: 80
    } );

    // create a label for the default value
    // @param - string for the label text
    const createNumberLabel = ( value: string ) => new Text( value, {
      font: new PhetFont( 13 ),
      fill: MySolarSystemColors.foregroundProperty,
      maxWidth: 110
    } );

    const labels = [ createNumberLabel( '0.5' ), defaultLabel, createNumberLabel( '1.5' ), createNumberLabel( '2.0' ) ];
    for ( let i = 0; i < labels.length; i++ ) {
      const tickValue = ( i + 1 ) / labels.length * massRange.max;
      slider.addMajorTick( tickValue, labels[ i ] );
    }
  }
}

mySolarSystem.register( 'ThirdLawSliderPanel', ThirdLawSliderPanel );