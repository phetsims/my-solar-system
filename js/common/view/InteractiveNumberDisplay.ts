// Copyright 2022-2023, University of Colorado Boulder

/**
 * InteractiveNumberDisplay is a NumberDisplay that allows the user to enter a value using a kepad. Clicking
 * on the NumberDisplay pops up the keypad. It is used in this sim to set Mass, Position and Velocity.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
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
import { Color, FireListener, InteractiveHighlighting, PressListener } from '../../../../scenery/js/imports.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  // Use exponential notation e.g. 1x10^4 instead of 10000
  useExponential?: boolean;

  // Small numeric values show as <0.1
  hideSmallValues?: boolean;
  onEditCallback?: () => void;
};

type InteractiveNumberDisplayOptions = SelfOptions & PickRequired<NumberDisplayOptions, 'tandem'>;

export default class InteractiveNumberDisplay extends InteractiveHighlighting( NumberDisplay ) {

  public constructor(
    property: TProperty<number>,
    range: RangeWithValue,
    decimalPlaces: number,
    unitsProperty: TReadOnlyProperty<string>,
    userIsControllingProperty: TProperty<boolean>, // true if the user is controlling property
    bodyColorProperty: TReadOnlyProperty<Color>,
    isPlayingProperty: TProperty<boolean>,
    keypadDialog: KeypadDialog,
    providedOptions: InteractiveNumberDisplayOptions
  ) {

    // Keeps track of whether we're in the middle of a beginEdit/endEdit sequence with keypadDialog.
    const isEditingProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isEditingProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'True while the value is being editing using the keypad'
    } );

    const hoverListener = new PressListener( {
      tandem: Tandem.OPT_OUT,
      attach: false // Don't be greedy with the pointer, it would prevent the fire listener from activating
    } );

    const options = optionize<InteractiveNumberDisplayOptions, SelfOptions, NumberDisplayOptions>()( {

      // SelfOptions
      useExponential: false,
      hideSmallValues: false,
      onEditCallback: _.noop,

      // NumberDisplayOptions
      cursor: 'pointer',
      numberFormatter: ( n: number ) => {
        if ( providedOptions?.hideSmallValues && Math.abs( n ) <= 0.1 ) {
          return `${MathSymbols.LESS_THAN_OR_EQUAL} 0.1`;
        }
        else {
          return Utils.toFixed( n, decimalPlaces );
        }
      },
      textOptions: {
        font: SolarSystemCommonConstants.NUMBER_DISPLAY_FONT,
        tandem: Tandem.OPT_OUT
      },
      backgroundFill: new DerivedProperty(
        [ userIsControllingProperty, isEditingProperty, hoverListener.looksOverProperty, bodyColorProperty ],
        ( userControlled, isEditing, looksOver, bodyColor ) => {
          return userControlled || isEditing || looksOver ? bodyColor.colorUtilsBrighter( 0.7 ) : Color.WHITE;
        } ),
      backgroundStroke: Color.BLACK,

      // a11y
      // innerContent to support dynamic changes
      innerContent: new DerivedProperty( [ property, unitsProperty ], ( value, units ) => {
        return `${Utils.toFixed( value, 2 )} ${units}`;
      } ),
      tagName: 'button',
      containerTagName: 'div',

      // phet-io
      phetioVisiblePropertyInstrumented: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( property, range, options );

    this.localBoundsProperty.link( localBounds => {
      this.touchArea = localBounds.dilatedXY( 5, 3.5 );
    } );

    this.addInputListener( hoverListener );

    this.addInputListener( new FireListener( {
      fire: () => {
        if ( !userIsControllingProperty.value ) {
          isEditingProperty.value = true;

          const wasPlaying = isPlayingProperty.value;
          isPlayingProperty.value = false;

          let changed = false;
          const editValue = ( value: number ) => {
            changed = true;
            property.value = value;
            userIsControllingProperty.value = true;
            options.onEditCallback();
          };
          const endEdit = () => {
            isEditingProperty.value = false;
            userIsControllingProperty.value = false;
            if ( !changed ) {
              isPlayingProperty.value = wasPlaying;
            }
          };

          keypadDialog.beginEdit( editValue, range, MySolarSystemStrings.pattern.rangeStringProperty, endEdit );
        }
      },
      fireOnDown: true
    } ) );
  }
}

mySolarSystem.register( 'InteractiveNumberDisplay', InteractiveNumberDisplay );