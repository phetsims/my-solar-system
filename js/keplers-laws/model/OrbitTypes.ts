// Copyright 2022-2023, University of Colorado Boulder
/**
 * EnumerationValue to keep track of the Law that's currently selected
 *
 * @author Agustín Vallejo
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import mySolarSystem from '../../mySolarSystem.js';

export default class OrbitTypes extends EnumerationValue {
  public static readonly STABLE_ORBIT = new OrbitTypes();
  public static readonly ESCAPE_ORBIT = new OrbitTypes();
  public static readonly CRASH_ORBIT = new OrbitTypes();
  public static readonly TOO_BIG = new OrbitTypes();

  public static readonly enumeration = new Enumeration( OrbitTypes, {
    phetioDocumentation: 'The reason this orbit is unstable'
  } );
}

mySolarSystem.register( 'OrbitTypes', OrbitTypes );
