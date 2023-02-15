// Copyright 2020-2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Jonathan Olson
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import mySolarSystem from '../mySolarSystem.js';
import MySolarSystemColors from './MySolarSystemColors.js';

const MySolarSystemConstants = {

  MARGIN: 15,
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  CONTROL_PANEL_OPTIONS: {
    stroke: null,
    fill: MySolarSystemColors.controlPanelFillProperty,
    cornerRadius: 5,
    xMargin: 10,
    yMargin: 10,
    maxWidth: 200,
    layoutOptions: {
      stretch: true
    }
  },
  CHECKBOX_OPTIONS: {
    boxWidth: 14,
    checkboxColor: MySolarSystemColors.foregroundProperty,
    checkboxColorBackground: MySolarSystemColors.backgroundProperty
  },
  HSEPARATOR_OPTIONS: {
    lineWidth: 2,
    stroke: '#8E9097',
    layoutOptions: {
      yMargin: 5
    }
  },
  PANEL_FONT: new PhetFont( 16 ),
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  TEXT_OPTIONS: {
    font: new PhetFont( 16 ),
    fill: MySolarSystemColors.foregroundProperty,
    lineWidth: 0.1
  },
  TITLE_OPTIONS: {
    font: new PhetFont( { size: 18, weight: 'bold' } ),
    fill: MySolarSystemColors.foregroundProperty
  },
  GRID: {
    spacing: 100
  },

  // Multipliers that modify the numeric value shown in Number Displays
  POSITION_MULTIPLIER: 0.01,
  VELOCITY_MULTIPLIER: 0.2109,
  TIME_MULTIPLIER: 0.218,

  MAX_ORBITAL_DIVISIONS: 6,
  MIN_ORBITAL_DIVISIONS: 2
};

mySolarSystem.register( 'MySolarSystemConstants', MySolarSystemConstants );
export default MySolarSystemConstants;