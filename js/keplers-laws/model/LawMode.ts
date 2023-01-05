// Copyright 2022-2023, University of Colorado Boulder
/**
 * EnumerationValue to keep track of the Law that's currently selected
 * 
 * @author Agustín Vallejo
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import mySolarSystem from '../../mySolarSystem.js';

export default class LawMode extends EnumerationValue {
  public static readonly FIRST_LAW = new LawMode();
  public static readonly SECOND_LAW = new LawMode();
  public static readonly THIRD_LAW = new LawMode();

  public static readonly enumeration = new Enumeration( LawMode, {
    phetioDocumentation: 'Whether the second or third law are selected'
  } );
}
 
 mySolarSystem.register( 'LawMode', LawMode );
 