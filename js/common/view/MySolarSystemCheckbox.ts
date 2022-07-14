// Copyright 2022, University of Colorado Boulder

/**
 * Checkbox with common options for the my-solar-system sim
 *
 * @author Agustín Vallejo
 */

import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import { Node } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';

export type MySolarSystemCheckboxOptions = CheckboxOptions;

export default class MySolarSystemCheckbox extends Checkbox {

  public constructor( property: Property<boolean>, content: Node, providedOptions?: MySolarSystemCheckboxOptions ) {

    const options = optionize<MySolarSystemCheckboxOptions, EmptyObjectType, CheckboxOptions>()( {
      boxWidth: 14,
      checkboxColor: MySolarSystemColors.foregroundProperty,
      checkboxColorBackground: MySolarSystemColors.backgroundProperty,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
    }, providedOptions );

    super( property, content, options );
  }
}

mySolarSystem.register( 'MySolarSystemCheckbox', MySolarSystemCheckbox );
