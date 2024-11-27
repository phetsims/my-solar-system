// Copyright 2023-2024, University of Colorado Boulder

/**
 * Keyboard help content for My Solar System.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimeControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';

export default class MySolarSystemKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor( hasComboBoxHelp = false ) {

    const draggableHelpSection = new MoveDraggableItemsKeyboardHelpSection();
    const sliderHelpSection = new SliderControlsKeyboardHelpSection();
    const timeControlsHelpSection = new TimeControlsKeyboardHelpSection();
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true,
      withKeypadContent: true
    } );

    // optional 'Choose a Target Orbit' for combo box
    const comboBoxHelpSection = hasComboBoxHelp ? new ComboBoxKeyboardHelpSection( {
      headingString: MySolarSystemStrings.keyboardHelpDialog.chooseAnOrbitalSystemStringProperty,
      thingAsLowerCaseSingular: MySolarSystemStrings.keyboardHelpDialog.orbitalSystemStringProperty,
      thingAsLowerCasePlural: MySolarSystemStrings.keyboardHelpDialog.orbitalSystemsStringProperty
    } ) : null;

    const leftSection = comboBoxHelpSection ?
      [ draggableHelpSection, sliderHelpSection, comboBoxHelpSection ] :
      [ draggableHelpSection, sliderHelpSection ];
    const rightSection = [ timeControlsHelpSection, basicActionsHelpSection ];

    super( leftSection, rightSection );
  }
}

mySolarSystem.register( 'MySolarSystemKeyboardHelpContent', MySolarSystemKeyboardHelpContent );