// Copyright 2020-2022, University of Colorado Boulder

/**
 * Provides a specific class for handling the buttons that 
 * coordinate the specific Kepler's Law being seen in the screen.
 * 
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT
};

type LawButtonOptions = RectangularPushButtonOptions;

class LawButton extends RectangularPushButton {
  public constructor( property: Property<boolean>, content: Node, providedOptions?: LawButtonOptions ) {
    const options = optionize<LawButtonOptions, EmptyObjectType, RectangularPushButtonOptions>()( {
      content: content,
      listener: () => { property.value = !property.value; },
      stroke: property.value ? 'skyblue' : 'black',
      lineWidth: property.value ? 5 : 1,
      enabledProperty: property,
      minHeight: 100,
      baseColor: 'white'
    }, providedOptions );
    super( options );


  }
}

export default class LawsButtons extends HBox {
  public constructor( model: KeplersLawsModel ) {

    const LawsButton12 = new LawButton( model.secondLawSelectedProperty, new Text( '1st & 2nd Laws', TEXT_OPTIONS ) );
    const LawsButton3 = new LawButton( model.thirdLawSelectedProperty, new Text( '3rd Law', TEXT_OPTIONS ) );
    
    super( {
      xMargin: 5,
      children: [
        LawsButton12,
        LawsButton3
      ]
    } );

  }
}

mySolarSystem.register( 'LawsButtons', LawsButtons );
