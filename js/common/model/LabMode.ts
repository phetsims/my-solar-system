// Copyright 2022-2023, University of Colorado Boulder

/**
 * Enumerates the presets and custom settings for the bodies in the Lab Screen.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export default class LabMode extends EnumerationValue {
  public static readonly SUN_PLANET = new LabMode();
  public static readonly SUN_PLANET_MOON = new LabMode();
  public static readonly SUN_PLANET_COMET = new LabMode();
  public static readonly TROJAN_ASTEROIDS = new LabMode();
  public static readonly ELLIPSES = new LabMode();
  public static readonly HYPERBOLIC = new LabMode();
  public static readonly SLINGSHOT = new LabMode();
  public static readonly DOUBLE_SLINGSHOT = new LabMode();
  public static readonly BINARY_STAR_PLANET = new LabMode();
  public static readonly FOUR_STAR_BALLET = new LabMode();
  public static readonly DOUBLE_DOUBLE = new LabMode();
  public static readonly CUSTOM = new LabMode();

  public static readonly enumeration = new Enumeration( LabMode );
}

mySolarSystem.register( 'LabMode', LabMode );