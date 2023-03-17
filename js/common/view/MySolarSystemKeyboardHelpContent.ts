// Copyright 2023, University of Colorado Boulder

/**
 * Keyboard help content for My Solar System.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimeControlKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlKeyboardHelpSection.js';

export default class MySolarSystemKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    const sliderHelpSection = new SliderControlsKeyboardHelpSection();
    const timeControlsHelpSection = new TimeControlKeyboardHelpSection();
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true,
      withKeypadContent: true
    } );

    super( [ timeControlsHelpSection, sliderHelpSection ], [ basicActionsHelpSection ] );
  }
}

mySolarSystem.register( 'MySolarSystemKeyboardHelpContent', MySolarSystemKeyboardHelpContent );