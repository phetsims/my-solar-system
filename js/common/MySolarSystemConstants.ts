// Copyright 2020-2022, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Jonathan Olson
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import mySolarSystem from '../mySolarSystem.js';
import MySolarSystemColors from './MySolarSystemColors.js';

// constants
const CONTROL_PANEL_STROKE = '#8E9097';
const PANEL_X_MARGIN = 5;

const MySolarSystemConstants = {

  MARGIN: 15,
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  CONTROL_PANEL_STROKE: CONTROL_PANEL_STROKE,
  PANEL_X_MARGIN: PANEL_X_MARGIN,
  CONTROL_PANEL_OPTIONS: {
    stroke: CONTROL_PANEL_STROKE,
    lineWidth: 2,
    cornerRadius: 5,
    xMargin: PANEL_X_MARGIN,
    fill: MySolarSystemColors.controlPanelFillProperty
  },
  CHECKBOX_OPTIONS: {
    boxWidth: 14,
    checkboxColor: MySolarSystemColors.foregroundProperty,
    checkboxColorBackground: MySolarSystemColors.backgroundProperty
  },
  HSEPARATOR_OPTIONS: {
    lineWidth: 2,
    stroke: CONTROL_PANEL_STROKE,
    layoutOptions: {
      yMargin: 5
    }
  },
  PANEL_FONT: new PhetFont( 16 ),
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  TEXT_OPTIONS: {
    font: new PhetFont( 16 ),
    fill: MySolarSystemColors.foregroundProperty
  },
  GRID: {
    spacing: 100
  },

  // Multipliers that modify the numeric value shown in Number Displays
  POSITION_MULTIPLIER: 0.01,
  VELOCITY_MULTIPLIER: 0.20,
  TIME_MULTIPLIER: 0.21,

  MAX_ORBITAL_DIVISIONS: 6
};

mySolarSystem.register( 'MySolarSystemConstants', MySolarSystemConstants );
export default MySolarSystemConstants;