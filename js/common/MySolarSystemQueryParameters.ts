// Copyright 2022-2023, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../mySolarSystem.js';

const MySolarSystemQueryParameters = QueryStringMachine.getAll( {

  // Likely will add query parameters in the future
} );

mySolarSystem.register( 'MySolarSystemQueryParameters', MySolarSystemQueryParameters );

export default MySolarSystemQueryParameters;