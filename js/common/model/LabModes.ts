// Copyright 2022, University of Colorado Boulder

/**
 * Enumerates the presets and custom settings for the bodies in the Lab Screen.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export default class LabModes extends EnumerationValue {
  public static SUN_PLANET = new LabModes();
  public static SUN_PLANET_MOON = new LabModes();
  public static SUN_PLANET_COMET = new LabModes();
  public static TROJAN_ASTEROIDS = new LabModes();
  public static ELLIPSES = new LabModes();
  public static HYPERBOLIC = new LabModes();
  public static SLINGSHOT = new LabModes();
  public static DOUBLE_SLINGSHOT = new LabModes();
  public static BINARY_STAR_PLANET = new LabModes();
  public static FOUR_STAR_BALLET = new LabModes();
  public static DOUBLE_DOUBLE = new LabModes();
  public static CUSTOM = new LabModes();

  public static enumeration = new Enumeration( LabModes );
}

mySolarSystem.register( 'LabModes', LabModes );