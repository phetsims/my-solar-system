// Copyright 2020-2022, University of Colorado Boulder

/**
 * Provides a specific class for handling the buttons that 
 * coordinate the specific Kepler's Law being seen in the screen.
 * 
 * @author Agustín Vallejo
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import LawMode from '../model/LawMode.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT
};

type LawButtonOptions = RectangularPushButtonOptions;

class LawButton extends RectangularPushButton {
  public constructor( content: Node, providedOptions?: LawButtonOptions ) {
    const options = optionize<LawButtonOptions, EmptyObjectType, RectangularPushButtonOptions>()( {
      content: content,
      minHeight: 100,
      baseColor: 'white'
    }, providedOptions );
    super( options );


  }
}

type LawsButtonsOptions = RectangularRadioButtonGroupOptions;
export default class LawsButtons extends RectangularRadioButtonGroup<LawMode> {
  public constructor( model: KeplersLawsModel, providedOptions?: LawsButtonsOptions ) {
    const options = combineOptions<LawsButtonsOptions>( {
      orientation: 'horizontal'
    }, providedOptions );
    
    super( model.selectedLawProperty, [
      {
        value: LawMode.SECOND_LAW,
        node: new LawButton( new Text( '2nd Law', TEXT_OPTIONS ) ),
        tandemName: 'secondLawButton'
      },
      {
        value: LawMode.THIRD_LAW,
        node: new LawButton( new Text( '3rd Law', TEXT_OPTIONS ) ),
        tandemName: 'thirdLawButton'
      }
    ], options );
  }
}

mySolarSystem.register( 'LawsButtons', LawsButtons );
