// Copyright 2021-2022, University of Colorado Boulder

/**
 * Enumerates the presets and custom settings for the bodies in the Lab Screen.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export default class LabModes extends EnumerationValue {
  static TWO_BODY_MODE = new LabModes();
  static THREE_BODY_MODE = new LabModes();
  static FOUR_BODY_MODE = new LabModes();

  static enumeration = new Enumeration( LabModes );
}

mySolarSystem.register( 'LabModes', LabModes );