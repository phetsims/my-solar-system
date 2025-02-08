// Copyright 2023-2025, University of Colorado Boulder

/**
 * UnitsInformationDialog is the dialog titled 'Units Information' that displays notes about the units used in the sim.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';

export default class UnitsInformationDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const unitsInformationStringProperty = new DerivedProperty( [
        MySolarSystemStrings.unitsInfo.contentStringProperty,
        MySolarSystemStrings.unitsInfo.content2StringProperty,
        MySolarSystemStrings.unitsInfo.content3StringProperty
      ],
      ( content, content2, content3 ) => {
        return content + '<br><br>' + content2 + '<br><br>' + content3;
      } );

    const titleText = new Text( MySolarSystemStrings.unitsInfo.titleStringProperty, {
      font: new PhetFont( 32 )
    } );

    const content = new RichText( unitsInformationStringProperty, {
      lineWrap: 600
    } );

    super( content, {

      // DialogOptions
      title: titleText,
      titleAlign: 'center',
      tandem: tandem
    } );
  }
}

mySolarSystem.register( 'UnitsInformationDialog', UnitsInformationDialog );