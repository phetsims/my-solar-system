// Copyright 2022, University of Colorado Boulder
/**
 * NumberDisplay used in the panel to control Masses, Position and Velocity
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import TProperty from '../../../../axon/js/TProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import KeypadDialog from '../../../../scenery-phet/js/keypad/KeypadDialog.js';
import { FireListener } from '../../../../scenery/js/imports.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';


type SelfOptions = EmptySelfOptions;

export type InteractiveNumberDisplayOptions = SelfOptions & NumberDisplayOptions;

export default class InteractiveNumberDisplay extends NumberDisplay {
  public constructor(
    property: TProperty<number>,
    range: RangeWithValue,
    units: TReadOnlyProperty<string>,
    providedOptions?: InteractiveNumberDisplayOptions
  ) {

    // Keypad dialog
    const keypadDialog = new KeypadDialog( {
      keypadOptions: {
        accumulatorOptions: {
          // {number} - maximum number of digits that can be entered on the keypad.x
          maxDigits: 8
        }
      }
    } );

    const options = optionize<InteractiveNumberDisplayOptions, SelfOptions, NumberDisplayOptions>()( {
      cursor: 'pointer',
      decimalPlaces: 1,
      textOptions: {
        font: MySolarSystemConstants.PANEL_FONT
      }
    }, providedOptions );

    super( property, range, options );

    this.addInputListener( new FireListener( {
      fire: () => {
        keypadDialog.beginEdit( value => {
          property.value = value;
        }, range, new PatternStringProperty( MySolarSystemStrings.pattern.rangeWithUnitsStringProperty, {
          min: range.min,
          max: range.max,
          units: units // TODO: How to add RichText here??
        } ), () => {
          // no-op
        } );
      },
      fireOnDown: true
    } ) );
  }
}

mySolarSystem.register( 'InteractiveNumberDisplay', InteractiveNumberDisplay );