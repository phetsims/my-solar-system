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
  public static readonly SUN_PLANET = new LabModes();
  public static readonly SUN_PLANET_MOON = new LabModes();
  public static readonly SUN_PLANET_COMET = new LabModes();
  public static readonly TROJAN_ASTEROIDS = new LabModes();
  public static readonly ELLIPSES = new LabModes();
  public static readonly HYPERBOLIC = new LabModes();
  public static readonly SLINGSHOT = new LabModes();
  public static readonly DOUBLE_SLINGSHOT = new LabModes();
  public static readonly BINARY_STAR_PLANET = new LabModes();
  public static readonly FOUR_STAR_BALLET = new LabModes();
  public static readonly DOUBLE_DOUBLE = new LabModes();
  public static readonly CUSTOM = new LabModes();

  public static readonly enumeration = new Enumeration( LabModes );
}

mySolarSystem.register( 'LabModes', LabModes );