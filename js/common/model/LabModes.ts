// Copyright 2021-2022, University of Colorado Boulder

/**
 * Enumerates the presets and custom settings for the bodies in the Lab Screen.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

/**
 * The possible pre-sets for the lab are:
    Sun and planet
    Sun, planet, moon
    Sun, planet, comet
    Trojan asteroid 
    Ellipses
    Hyperbolic
    Slingshot
    Double Slingshot
    Binary star, planet 
    Four-star ballet
    Double double
    Custom
 */

export default class LabModes extends EnumerationValue {
  static SUN_PLANET = new LabModes();
  static SUN_PLANET_MOON = new LabModes();
  static SUN_PLANET_COMET = new LabModes();
  static TROJAN_ASTEROIDS = new LabModes();
  static ELLIPSES = new LabModes();
  static HYPERBOLIC = new LabModes();
  static SLINGSHOT = new LabModes();
  static DOUBLE_SLINGSHOT = new LabModes();
  static BINARY_STAR_PLANET = new LabModes();
  static FOUR_STAR_BALLET = new LabModes();
  static DOUBLE_DOUBLE = new LabModes();
  static CUSTOM = new LabModes();

  static enumeration = new Enumeration( LabModes );
}

mySolarSystem.register( 'LabModes', LabModes );