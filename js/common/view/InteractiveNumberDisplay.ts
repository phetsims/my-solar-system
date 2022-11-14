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
import optionize from '../../../../phet-core/js/optionize.js';
import KeypadDialog from '../../../../scenery-phet/js/keypad/KeypadDialog.js';
import { Color, FireListener } from '../../../../scenery/js/imports.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MySolarSystemColors from '../MySolarSystemColors.js';


type SelfOptions = {
  useExponential?: boolean;
};

export type InteractiveNumberDisplayOptions = SelfOptions & NumberDisplayOptions;

export default class InteractiveNumberDisplay extends NumberDisplay {
  public constructor(
    property: TProperty<number>,
    range: RangeWithValue,
    units: TReadOnlyProperty<string>,
    userControlledProperty: TReadOnlyProperty<boolean>,
    providedOptions?: InteractiveNumberDisplayOptions
  ) {

    // Keypad dialog
    const keypadDialog = new KeypadDialog( {
      useRichTextRange: true,
      keypadOptions: {
        accumulatorOptions: {
          // {number} - maximum number of digits that can be entered on the keypad.x
          maxDigits: 8
        }
      }
    } );

    const isKeypadActiveProperty = new BooleanProperty( false );

    const options = optionize<InteractiveNumberDisplayOptions, SelfOptions, NumberDisplayOptions>()( {
      cursor: 'pointer',
      decimalPlaces: 1,
      useExponential: false,
      textOptions: {
        font: MySolarSystemConstants.PANEL_FONT
      },
      backgroundFill: new DerivedProperty( [
        userControlledProperty,
        isKeypadActiveProperty,
        MySolarSystemColors.userControlledBackgroundColorProperty
      ], ( isUserControlled, isKeypadActive, backgroundColor ) => {
        return isUserControlled || isKeypadActive ? backgroundColor : Color.WHITE;
      } ),
      backgroundStroke: Color.BLACK
    }, providedOptions );

    super( property, range, options );

    const patternStringProperty = options.useExponential
                                  ? MySolarSystemStrings.pattern.rangeWithExponentialUnitsStringProperty
                                  : MySolarSystemStrings.pattern.rangeWithUnitsStringProperty;

    this.addInputListener( new FireListener( {
      fire: () => {
        if ( !userControlledProperty.value ) {
          isKeypadActiveProperty.value = true;
          keypadDialog.beginEdit( value => {
            property.value = value;
          }, range, new PatternStringProperty( patternStringProperty, {
            min: range.min,
            max: range.max,
            units: units // TODO: How to add RichText here??
          } ), () => {
            isKeypadActiveProperty.value = false;
          } );
        }
      },
      fireOnDown: true
    } ) );
  }
}

mySolarSystem.register( 'InteractiveNumberDisplay', InteractiveNumberDisplay );