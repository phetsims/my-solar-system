// Copyright 2022-2025, University of Colorado Boulder

/**
 * InteractiveNumberDisplay is a NumberDisplay that allows the user to enter a value using a kepad. Clicking
 * on the NumberDisplay pops up the keypad. It is used in this sim to set Mass, Position and Velocity.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import KeypadDialog from '../../../../scenery-phet/js/keypad/KeypadDialog.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import FireListener from '../../../../scenery/js/listeners/FireListener.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Color from '../../../../scenery/js/util/Color.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';

type SelfOptions = {
  // Use exponential notation e.g. 1x10^4 instead of 10000
  useExponential?: boolean;

  // Values <= this will be displayed as "<= ${minDisplayedValue}". Defaults to range.min.
  minDisplayedValue?: number;
  onEditCallback?: () => void;
};

type InteractiveNumberDisplayOptions = SelfOptions & PickRequired<NumberDisplayOptions, 'tandem'>;

export default class InteractiveNumberDisplay extends InteractiveHighlighting( NumberDisplay ) {

  public constructor(
    property: TProperty<number>,
    range: Range,
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
      attach: false, // Don't be greedy with the pointer, it would prevent the fire listener from activating
      tandem: Tandem.OPT_OUT
    } );

    const options = optionize<InteractiveNumberDisplayOptions, SelfOptions, NumberDisplayOptions>()( {

      // SelfOptions
      useExponential: false,
      minDisplayedValue: range.min,
      onEditCallback: _.noop,

      // NumberDisplayOptions
      cursor: 'pointer',
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
      phetioFeatured: true,
      phetioVisiblePropertyInstrumented: false,
      phetioInputEnabledPropertyInstrumented: true,
      inputEnabledPropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    options.numberFormatter = value => {
      if ( Math.abs( value ) <= options.minDisplayedValue ) {
        return `${MathSymbols.LESS_THAN_OR_EQUAL} ${Utils.toFixed( options.minDisplayedValue, decimalPlaces )}`;
      }
      else {
        return Utils.toFixed( value, decimalPlaces );
      }
    };

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
      fireOnDown: true,
      tandem: Tandem.OPT_OUT
    } ) );
  }
}

mySolarSystem.register( 'InteractiveNumberDisplay', InteractiveNumberDisplay );