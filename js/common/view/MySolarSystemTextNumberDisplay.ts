// Copyright 2023, University of Colorado Boulder

/**
 * A combination of a Rich Text node and a Number Display node.
 * TODO: Is there an easier way?
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions, optionize3 } from '../../../../phet-core/js/optionize.js';
import Range from '../../../../dot/js/Range.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';

const STRING_PATTERN_OPTIONS: NumberDisplayOptions = {
  backgroundFill: null,
  backgroundStroke: null,
  textOptions: MySolarSystemConstants.TEXT_OPTIONS,
  decimalPlaces: 1,
  useRichText: true,
  layoutOptions: {
    align: 'left'
  }
};

export default class MySolarSystemTextNumberDisplay extends NumberDisplay {
  public constructor( numberProperty: TReadOnlyProperty<number | null>, displayRange: Range, providedOptions?: NumberDisplayOptions ) {
    super(
      numberProperty,
      displayRange,
      optionize3<NumberDisplayOptions, EmptySelfOptions, NumberDisplayOptions>()( {}, STRING_PATTERN_OPTIONS, providedOptions )
    );
  }
}

mySolarSystem.register( 'MySolarSystemTextNumberDisplay', MySolarSystemTextNumberDisplay );