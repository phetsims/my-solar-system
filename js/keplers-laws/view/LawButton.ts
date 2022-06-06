// Copyright 2020-2022, University of Colorado Boulder

/**
 * Provides a specific class for handling the buttons that 
 * coordinate the specific Kepler's Law being seen in the screen.
 * 
 * @author Agustín Vallejo
 */

 import optionize from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import mySolarSystem from '../../mySolarSystem.js';

type LawButtonOptions = RectangularPushButtonOptions;

export default class LawButton extends RectangularPushButton {
  constructor( content: Node, providedOptions?: LawButtonOptions ) {
    const options = optionize<LawButtonOptions, {}, RectangularPushButtonOptions>()( {
      content: content,
      minHeight: 100,
      baseColor: 'white'
    }, providedOptions );
    super( options );
  }
}

mySolarSystem.register( 'LawButton', LawButton );
