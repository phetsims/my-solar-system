// Copyright 2022-2025, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import mySolarSystem from '../mySolarSystem.js';

const MySolarSystemQueryParameters = QueryStringMachine.getAll( {

  // Likely will add query parameters in the future
} );

mySolarSystem.register( 'MySolarSystemQueryParameters', MySolarSystemQueryParameters );

export default MySolarSystemQueryParameters;