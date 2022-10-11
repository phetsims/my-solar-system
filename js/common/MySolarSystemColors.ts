// Copyright 2020-2022, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Jonathan Olson
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import mySolarSystem from '../mySolarSystem.js';

const MySolarSystemColors = {

  // Color mainly used for foreground things like text
  foregroundProperty: new ProfileColorProperty( mySolarSystem, 'foreground', {
    default: 'white',
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'foregroundColorProperty' )
  } ),
  backgroundProperty: new ProfileColorProperty( mySolarSystem, 'background', {
    default: 'black',
    projector: 'white'
  }, {
    tandem: Tandem.COLORS.createTandem( 'backgroundColorProperty' )
  } ),
  controlPanelFillProperty: new ProfileColorProperty( mySolarSystem, 'control panel fill', {
    default: 'black',
    projector: new Color( 222, 234, 255 )
  } ),
  gridIconStrokeColorProperty: new ProfileColorProperty( mySolarSystem, 'grid icon stroke', {
    default: 'gray',
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'gridIconStrokeColorProperty' )
  } ),
  HIGHLIGHTED_NUMBER_DISPLAY_FILL: PhetColorScheme.BUTTON_YELLOW,

  firstBodyColorProperty: new ProfileColorProperty( mySolarSystem, 'first body color', {
    default: 'yellow'
  }, {
    tandem: Tandem.COLORS.createTandem( 'firstBodyColorProperty' )
  } ),

  secondBodyColorProperty: new ProfileColorProperty( mySolarSystem, 'second body color', {
    default: 'magenta'
  }, {
    tandem: Tandem.COLORS.createTandem( 'secondBodyColorProperty' )
  } ),

  thirdBodyColorProperty: new ProfileColorProperty( mySolarSystem, 'third body color', {
    default: 'cyan'
  }, {
    tandem: Tandem.COLORS.createTandem( 'thirdBodyColorProperty' )
  } ),

  fourthBodyColorProperty: new ProfileColorProperty( mySolarSystem, 'fourth body color', {
    default: 'green'
  }, {
    tandem: Tandem.COLORS.createTandem( 'fourthBodyColorProperty' )
  } )
};

mySolarSystem.register( 'MySolarSystemColors', MySolarSystemColors );
export default MySolarSystemColors;