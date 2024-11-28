// Copyright 2022-2024, University of Colorado Boulder

/**
 * Enumerates the types of Value Columns the panel will display.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import mySolarSystem from '../../mySolarSystem.js';

export default class ValuesColumnTypes extends EnumerationValue {
  public static readonly BODY_ICONS = new ValuesColumnTypes();
  public static readonly MASS = new ValuesColumnTypes();
  public static readonly MASS_NUMBER_CONTROL = new ValuesColumnTypes();
  public static readonly POSITION_X = new ValuesColumnTypes();
  public static readonly POSITION_Y = new ValuesColumnTypes();
  public static readonly VELOCITY_X = new ValuesColumnTypes();
  public static readonly VELOCITY_Y = new ValuesColumnTypes();

  public static readonly enumeration = new Enumeration( ValuesColumnTypes );
}

mySolarSystem.register( 'ValuesColumnTypes', ValuesColumnTypes );