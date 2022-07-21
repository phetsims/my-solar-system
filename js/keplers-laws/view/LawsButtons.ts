// Copyright 2022, University of Colorado Boulder

/**
 * Provides a specific class for handling the buttons that
 * coordinate the specific Kepler's Law being seen in the screen.
 *
 * @author Agustín Vallejo
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { Text, TextOptions } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import LawMode from '../model/LawMode.js';

const TEXT_OPTIONS: TextOptions = {
  font: MySolarSystemConstants.PANEL_FONT
};

type LawsButtonsOptions = RectangularRadioButtonGroupOptions;
export default class LawsButtons extends RectangularRadioButtonGroup<LawMode> {
  public constructor( model: KeplersLawsModel, providedOptions?: LawsButtonsOptions ) {
    const options = combineOptions<LawsButtonsOptions>( {
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 10,
        yMargin: 30,
        buttonAppearanceStrategyOptions: {
          selectedStroke: '#60a9dd',
          selectedLineWidth: 4
        }
      }
    }, providedOptions );

    super( model.selectedLawProperty, [
      {
        value: LawMode.SECOND_LAW,
        node: new Text( '2nd Law', TEXT_OPTIONS ),
        tandemName: 'secondLawButton'
      },
      {
        value: LawMode.THIRD_LAW,
        node: new Text( '3rd Law', TEXT_OPTIONS ),
        tandemName: 'thirdLawButton'
      }
    ], options );
  }
}

mySolarSystem.register( 'LawsButtons', LawsButtons );
