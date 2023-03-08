// Copyright 2022-2023, University of Colorado Boulder
/**
 * NumberDisplay used in the panel to control Masses, Position and Velocity
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
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
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';

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
        font: SolarSystemCommonConstants.PANEL_FONT
      },
      backgroundFill: new DerivedProperty( [
        userControlledProperty,
        isKeypadActiveProperty,
        bodyColorProperty
      ], ( isUserControlled, isKeypadActive, backgroundColor ) => {
        return isUserControlled || isKeypadActive ? backgroundColor.colorUtilsBrighter( 0.7 ) : Color.WHITE;
      } ),
      backgroundStroke: Color.BLACK,

      // a11y
      // innerContent to support dynamic changes
      innerContent: new DerivedProperty( [ property, units ], ( value, units ) => {
        return `${Utils.toFixed( value, 2 )} ${units}`;
      } ),
      tagName: 'button',
      containerTagName: 'div'
    }, providedOptions );

    super( property, range, options );

    this.isKeypadActiveProperty = isKeypadActiveProperty;

    let patternStringProperty: ReadOnlyProperty<string> | null = null;

    this.addInputListener( new FireListener( {
      fire: () => {
        if ( !userControlledProperty.value ) {
          isKeypadActiveProperty.value = true;

          const wasPlaying = isPlayingProperty.value;
          isPlayingProperty.value = false;

          let changed = false;

          const stringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.rangeStringProperty, {
            min: range.min,
            max: range.max,

            //REVIEW: units... isn't used? Why isn't it used? It isn't in the pattern.range string.
            units: units

            //REVIEW: Since the units don't change, actually... can we just create this PatternStringProperty once?
            //REVIEW: Having to recreate it leads to the otherwise-added code needed to properly dispose of it.
          } );

          keypadDialog.beginEdit( value => {
            changed = true;
            property.value = value;
            userControlledProperty.value = true;
            options.onEditCallback();
          }, range, stringProperty, () => {
            isKeypadActiveProperty.value = false;
            userControlledProperty.value = false;
            if ( !changed ) {
              isPlayingProperty.value = wasPlaying;
            }
          } );

          if ( patternStringProperty ) {
            patternStringProperty.dispose();
          }
          patternStringProperty = stringProperty;
        }
      },
      fireOnDown: true
    } ) );
  }
}

mySolarSystem.register( 'InteractiveNumberDisplay', InteractiveNumberDisplay );