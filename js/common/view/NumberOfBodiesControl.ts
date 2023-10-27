// Copyright 2023, University of Colorado Boulder

/**
 * NumberOfBodiesControl is a labeled NumberSpinner, for changing the number of bodies in the orbital system.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import mySolarSystem from '../../mySolarSystem.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type NumberOfBodiesControlOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem' | 'visible'>;

export default class NumberOfBodiesControl extends VBox {

  public constructor( numberOfActiveBodiesProperty: NumberProperty, providedOptions: NumberOfBodiesControlOptions ) {

    const options = optionize<NumberOfBodiesControlOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      spacing: 5,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    const bodiesText = new Text( MySolarSystemStrings.dataPanel.bodiesStringProperty, {
      font: new PhetFont( 16 ),
      fill: SolarSystemCommonColors.foregroundProperty,
      maxWidth: 70
    } );

    const spinner = new NumberSpinner( numberOfActiveBodiesProperty, numberOfActiveBodiesProperty.rangeProperty, {
      deltaValue: 1,
      touchAreaXDilation: 20,
      touchAreaYDilation: 10,
      mouseAreaXDilation: 10,
      mouseAreaYDilation: 5,
      arrowsPosition: 'bothRight',
      arrowsSoundPlayer: nullSoundPlayer,
      numberDisplayOptions: {
        decimalPlaces: 0,
        align: 'center',
        xMargin: 10,
        yMargin: 3,
        textOptions: {
          font: new PhetFont( 28 )
        }
      },
      accessibleName: MySolarSystemStrings.a11y.numberOfBodiesStringProperty
      // Do not instrument for PhET-iO.
    } );

    options.children = [ bodiesText, spinner ];

    super( options );
  }
}

mySolarSystem.register( 'NumberOfBodiesControl', NumberOfBodiesControl );