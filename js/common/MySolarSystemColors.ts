// Copyright 2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../mySolarSystem.js';
import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import solarSystemCommon from '../../../solar-system-common/js/solarSystemCommon.js';
import Tandem from '../../../tandem/js/Tandem.js';

const MySolarSystemColors = {
  body1ColorProperty: new ProfileColorProperty( solarSystemCommon, 'body1Color', {
    default: 'yellow',
    projector: '#FFAE00'
  }, {
    tandem: Tandem.COLORS.createTandem( 'body1ColorProperty' ),
    phetioFeatured: true
  } ),

  body2ColorProperty: new ProfileColorProperty( solarSystemCommon, 'body2Color', {
    default: 'magenta'
  }, {
    tandem: Tandem.COLORS.createTandem( 'body2ColorProperty' ),
    phetioFeatured: true
  } ),

  body3ColorProperty: new ProfileColorProperty( solarSystemCommon, 'body3Color', {
    default: 'cyan',
    projector: '#0055FF'
  }, {
    tandem: Tandem.COLORS.createTandem( 'body3ColorProperty' ),
    phetioFeatured: true
  } ),

  body4ColorProperty: new ProfileColorProperty( solarSystemCommon, 'body4Color', {
    default: 'green'
  }, {
    tandem: Tandem.COLORS.createTandem( 'body4ColorProperty' ),
    phetioFeatured: true
  } )
};

mySolarSystem.register( 'MySolarSystemColors', MySolarSystemColors );
export default MySolarSystemColors;