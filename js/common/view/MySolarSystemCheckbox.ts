// Copyright 2022, University of Colorado Boulder

/**
 * Checkbox with common options for the my-solar-system sim
 *
 * @author Agustín Vallejo
 */

import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';

export type MySolarSystemCheckboxOptions = CheckboxOptions;

export default class MySolarSystemCheckbox extends Checkbox {

  public constructor( property: Property<boolean>, content: Node, providedOptions?: MySolarSystemCheckboxOptions ) {

    //REVIEW: in cases like this, I like to inline options (I'm fine either way, just want to point that out)
    const options = optionize<MySolarSystemCheckboxOptions, EmptySelfOptions, CheckboxOptions>()( {
      boxWidth: 14,
      checkboxColor: MySolarSystemColors.foregroundProperty,
      checkboxColorBackground: MySolarSystemColors.backgroundProperty,
      touchAreaXDilation: 5,
      touchAreaYDilation: 2.5 //REVIEW: Have this be half of the spacing between the checkboxes (programmatically)
    }, providedOptions );

    super( property, content, options );
  }
}

mySolarSystem.register( 'MySolarSystemCheckbox', MySolarSystemCheckbox );
