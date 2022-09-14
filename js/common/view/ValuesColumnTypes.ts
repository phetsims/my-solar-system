// Copyright 2022, University of Colorado Boulder

/**
 * Enumerates the types of Value Columns the panel will display.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export default class ValuesColumnTypes extends EnumerationValue {
  public static BODY_ICONS = new ValuesColumnTypes();
  public static MASS = new ValuesColumnTypes();
  public static MASS_SLIDER = new ValuesColumnTypes();
  public static POSITION_X = new ValuesColumnTypes();
  public static POSITION_Y = new ValuesColumnTypes();
  public static VELOCITY_X = new ValuesColumnTypes();
  public static VELOCITY_Y = new ValuesColumnTypes();

  public static enumeration = new Enumeration( ValuesColumnTypes );
}

mySolarSystem.register( 'ValuesColumnTypes', ValuesColumnTypes );