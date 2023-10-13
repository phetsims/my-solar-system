// Copyright 2023, University of Colorado Boulder

/**
 * Enumerates the presets and custom settings for the bodies in the Lab Screen.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import solarSystemCommon from '../../../../solar-system-common/js/solarSystemCommon.js';

export default class OrbitalSystem extends EnumerationValue {

  public static readonly SUN_PLANET = new OrbitalSystem();
  public static readonly SUN_PLANET_MOON = new OrbitalSystem();
  public static readonly SUN_PLANET_COMET = new OrbitalSystem();
  public static readonly TROJAN_ASTEROIDS = new OrbitalSystem();
  public static readonly ELLIPSES = new OrbitalSystem();
  public static readonly HYPERBOLIC = new OrbitalSystem();
  public static readonly SLINGSHOT = new OrbitalSystem();
  public static readonly DOUBLE_SLINGSHOT = new OrbitalSystem();
  public static readonly BINARY_STAR_PLANET = new OrbitalSystem();
  public static readonly FOUR_STAR_BALLET = new OrbitalSystem();
  public static readonly DOUBLE_DOUBLE = new OrbitalSystem();
  public static readonly CUSTOM = new OrbitalSystem();

  public static readonly enumeration = new Enumeration( OrbitalSystem );
}

solarSystemCommon.register( 'OrbitalSystem', OrbitalSystem );