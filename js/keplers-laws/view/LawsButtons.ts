// Copyright 2022, University of Colorado Boulder

/**
 * Provides a specific class for handling the buttons that
 * coordinate the specific Kepler's Law being seen in the screen.
 *
 * @author Agustín Vallejo
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { Image, ImageOptions } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import LawMode from '../model/LawMode.js';
import iconFirstLaw_png from '../../../images/iconFirstLaw_png.js';
import iconSecondLaw_png from '../../../images/iconSecondLaw_png.js';
import iconThirdLaw_png from '../../../images/iconThirdLaw_png.js';

const IMAGE_OPTIONS: ImageOptions = {
  scale: 0.5
};

export type LawsButtonsOptions = RectangularRadioButtonGroupOptions;

export default class LawsButtons extends RectangularRadioButtonGroup<LawMode> {
  public constructor( model: KeplersLawsModel, providedOptions?: LawsButtonsOptions ) {
    const options = combineOptions<LawsButtonsOptions>( {
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: '#555',
        buttonAppearanceStrategyOptions: {
          selectedStroke: '#60a9dd',
          selectedLineWidth: 4
        }
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 10
    }, providedOptions );


    // Intentionally left without MySolarSystemStrings because this buttons will have icons
    super( model.selectedLawProperty, [
      {
        value: LawMode.FIRST_LAW,
        createNode: tandem => new Image( iconFirstLaw_png, IMAGE_OPTIONS ),
        tandemName: 'firstLawButton'
      },
      {
        value: LawMode.SECOND_LAW,
        createNode: tandem => new Image( iconSecondLaw_png, IMAGE_OPTIONS ),
        tandemName: 'secondLawButton'
      },
      {
        value: LawMode.THIRD_LAW,
        createNode: tandem => new Image( iconThirdLaw_png, IMAGE_OPTIONS ),
        tandemName: 'thirdLawButton'
      }
    ], options );
  }
}

mySolarSystem.register( 'LawsButtons', LawsButtons );
