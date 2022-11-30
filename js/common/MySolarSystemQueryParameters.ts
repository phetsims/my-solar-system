// Copyright 2022, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author
 */

import mySolarSystem from '../mySolarSystem.js';

const MySolarSystemQueryParameters = QueryStringMachine.getAll( {

  pathRenderer: {
    type: 'string',
    validValues: [ 'canvas', 'webgl' ],
    defaultValue: 'canvas'
  }
} );

mySolarSystem.register( 'MySolarSystemQueryParameters', MySolarSystemQueryParameters );

export default MySolarSystemQueryParameters;