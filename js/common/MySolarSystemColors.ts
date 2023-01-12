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
    default: 'rgb( 40, 40, 40 )',
    projector: new Color( 222, 234, 255 )
  } ),
  gridIconStrokeColorProperty: new ProfileColorProperty( mySolarSystem, 'grid icon stroke', {
    default: 'gray',
    projector: 'black'
  }, {
    tandem: Tandem.COLORS.createTandem( 'gridIconStrokeColorProperty' )
  } ),

  userControlledBackgroundColorProperty: new ProfileColorProperty( mySolarSystem, 'user controlled background', {
    default: PhetColorScheme.BUTTON_YELLOW
  }, {
    tandem: Tandem.COLORS.createTandem( 'userControlledBackgroundColorProperty' )
  } ),

  firstBodyColorProperty: new ProfileColorProperty( mySolarSystem, 'first body color', {
    default: 'yellow',
    projector: '#FFAE00'
  }, {
    tandem: Tandem.COLORS.createTandem( 'firstBodyColorProperty' )
  } ),

  secondBodyColorProperty: new ProfileColorProperty( mySolarSystem, 'second body color', {
    default: 'magenta'
  }, {
    tandem: Tandem.COLORS.createTandem( 'secondBodyColorProperty' )
  } ),

  thirdBodyColorProperty: new ProfileColorProperty( mySolarSystem, 'third body color', {
    default: 'cyan',
    projector: '#0055FF'
  }, {
    tandem: Tandem.COLORS.createTandem( 'thirdBodyColorProperty' )
  } ),

  fourthBodyColorProperty: new ProfileColorProperty( mySolarSystem, 'fourth body color', {
    default: 'green'
  }, {
    tandem: Tandem.COLORS.createTandem( 'fourthBodyColorProperty' )
  } ),

  explosionColorProperty: new ProfileColorProperty( mySolarSystem, 'explosion color', {
    default: 'yellow'
  }, {
    tandem: Tandem.COLORS.createTandem( 'explosionColorProperty' )
  } ),

  orbitColorProperty: new ProfileColorProperty( mySolarSystem, 'orbit color', {
    default: 'fuchsia'
  }, {
    tandem: Tandem.COLORS.createTandem( 'orbitColorProperty' )
  } )
};

mySolarSystem.register( 'MySolarSystemColors', MySolarSystemColors );
export default MySolarSystemColors;