// Copyright 2022-2023, University of Colorado Boulder

/**
 * Enumerates the types of Value Columns the panel will display.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export default class ValuesColumnTypes extends EnumerationValue {
  public static readonly BODY_ICONS = new ValuesColumnTypes();
  public static readonly MASS = new ValuesColumnTypes();
  public static readonly MASS_SLIDER = new ValuesColumnTypes();
  public static readonly POSITION_X = new ValuesColumnTypes();
  public static readonly POSITION_Y = new ValuesColumnTypes();
  public static readonly VELOCITY_X = new ValuesColumnTypes();
  public static readonly VELOCITY_Y = new ValuesColumnTypes();

  public static readonly enumeration = new Enumeration( ValuesColumnTypes );
}

mySolarSystem.register( 'ValuesColumnTypes', ValuesColumnTypes );