// Copyright 2022-2023, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { HBox, HSeparator, Node, RichText, Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import createOrbitalInformationCheckboxes from './createOrbitalInformationCheckboxes.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import HSlider from '../../../../sun/js/HSlider.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';

type SelfOptions = EmptySelfOptions;

export type MySolarSystemControlsOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class MySolarSystemControls extends VBox {

  public constructor(
    model: MySolarSystemModel,
    topLayer: Node,
    providedOptions: MySolarSystemControlsOptions
  ) {

    const rangeMin = model.forceScaleProperty.range.min;
    const rangeMax = model.forceScaleProperty.range.max;
    const rangeStep = 2;

    // This slider controles the zoom level of the vector arrows
    const slider = new HSlider( model.forceScaleProperty, model.forceScaleProperty.range, {
      trackSize: new Dimension2( 100, 4 ),
      thumbSize: new Dimension2( 14, 28 ),
      tickLabelSpacing: 3,
      constrainValue: ( power: number ) => Math.abs( power ) < 0.5 ? 0 : power,
      shiftKeyboardStep: 0.5,
      keyboardStep: 1,
      pageKeyboardStep: 2,
      trackFillEnabled: SolarSystemCommonColors.foregroundProperty,
      majorTickStroke: SolarSystemCommonColors.foregroundProperty,
      majorTickLength: 8,
      minorTickLength: 8,
      minorTickStroke: SolarSystemCommonColors.foregroundProperty,

      accessibleName: SolarSystemCommonStrings.a11y.scaleSliderStringProperty,

      valueChangeSoundGeneratorOptions: {
        numberOfMiddleThresholds: ( rangeMax - rangeMin ) / rangeStep - 1
      }
    } );

    slider.addMajorTick( rangeMin, new RichText( MathSymbols.TIMES + `10<sup>${rangeMin}</sup`, SolarSystemCommonConstants.TEXT_OPTIONS ) );
    slider.addMajorTick( rangeMax, new RichText( MathSymbols.TIMES + `10<sup>${rangeMax}</sup`, SolarSystemCommonConstants.TEXT_OPTIONS ) );

    for ( let i = 0; i <= 6; i += 2 ) {
      slider.addMinorTick( i );
    }

    super( {
      children: [
        ...createOrbitalInformationCheckboxes( model, providedOptions.tandem ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( model, providedOptions.tandem ),
        new HBox( {
          spacing: 0,
          enabledProperty: model.gravityVisibleProperty,
          children: [
            new Text( SolarSystemCommonStrings.zoomStringProperty, combineOptions<TextOptions>( {
              maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH / 2,
              layoutOptions: { leftMargin: 20 }
            }, SolarSystemCommonConstants.TEXT_OPTIONS ) ),
            slider
          ]
        } ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( model, providedOptions.tandem )
      ],
      spacing: SolarSystemCommonConstants.CHECKBOX_SPACING,
      align: 'left',
      stretch: true,

      //pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Control Panel'
    } );
  }
}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );

