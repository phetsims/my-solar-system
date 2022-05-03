// Copyright 2020-2022, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Jonathan Olson
 */

import Property from '../../../axon/js/Property.js';
import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import mySolarSystem from '../mySolarSystem.js';

const MySolarSystemColors = {

  SCREEN_VIEW_BACKGROUND: new Property( 'black' ),

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
  } )
};

mySolarSystem.register( 'MySolarSystemColors', MySolarSystemColors );
export default MySolarSystemColors;