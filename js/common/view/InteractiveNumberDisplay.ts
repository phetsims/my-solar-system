// Copyright 2022-2023, University of Colorado Boulder
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
import Utils from '../../../../dot/js/Utils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';

type SelfOptions = {
  useExponential?: boolean;
  hideSmallValues?: boolean;
  onEditCallback?: () => void;
};

export type InteractiveNumberDisplayOptions = SelfOptions & NumberDisplayOptions;

export default class InteractiveNumberDisplay extends NumberDisplay {

  public readonly isKeypadActiveProperty: TProperty<boolean>;

  public constructor(
    property: TProperty<number>,
    range: RangeWithValue,
    units: TReadOnlyProperty<string>,
    userControlledProperty: TProperty<boolean>,
    bodyColorProperty: TReadOnlyProperty<Color>,
    isPlayingProperty: TProperty<boolean>,
    providedOptions?: InteractiveNumberDisplayOptions
  ) {

    const isKeypadActiveProperty = new BooleanProperty( false );

    // Keypad dialog
    const keypadDialog = new KeypadDialog( {
      useRichTextRange: true,
      keypadOptions: {
        accumulatorOptions: {
          //REVIEW: Why is there documentation on this here?
          // {number} - maximum number of digits that can be entered on the keypad.x
          maxDigits: 8,

          maxDigitsRightOfMantissa: 1
        }
      }
    } );

    const options = optionize<InteractiveNumberDisplayOptions, SelfOptions, NumberDisplayOptions>()( {
      cursor: 'pointer',
      hideSmallValues: false,
      onEditCallback: _.noop,
      numberFormatter: ( n: number ) => {
        if ( providedOptions?.hideSmallValues && Math.abs( n ) <= 0.1 ) {
          return `${MathSymbols.LESS_THAN_OR_EQUAL} 0.1`;
        }
        else {
          return Utils.toFixed( n, 1 );
        }
      },
      useExponential: false,
      textOptions: {
        font: MySolarSystemConstants.PANEL_FONT
      },
      backgroundFill: new DerivedProperty( [
        userControlledProperty,
        isKeypadActiveProperty,
        bodyColorProperty
      ], ( isUserControlled, isKeypadActive, backgroundColor ) => {
        return isUserControlled || isKeypadActive ? backgroundColor.colorUtilsBrighter( 0.7 ) : Color.WHITE;
      } ),
      backgroundStroke: Color.BLACK
    }, providedOptions );

    super( property, range, options );

    this.isKeypadActiveProperty = isKeypadActiveProperty;

    this.addInputListener( new FireListener( {
      fire: () => {
        if ( !userControlledProperty.value ) {
          isKeypadActiveProperty.value = true;

          const wasPlaying = isPlayingProperty.value;
          isPlayingProperty.value = false;

          let changed = false;

          keypadDialog.beginEdit( value => {
            changed = true;
            property.value = value;
            userControlledProperty.value = true;
            options.onEditCallback();
          }, range, new PatternStringProperty( MySolarSystemStrings.pattern.rangeStringProperty, {
            min: range.min,
            max: range.max,
            units: units
          } ), () => {
            isKeypadActiveProperty.value = false;
            userControlledProperty.value = false;
            if ( !changed ) {
              isPlayingProperty.value = wasPlaying;
            }
          } );
        }
      },
      fireOnDown: true
    } ) );
  }
}

mySolarSystem.register( 'InteractiveNumberDisplay', InteractiveNumberDisplay );