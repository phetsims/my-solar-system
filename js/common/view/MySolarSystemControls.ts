// Copyright 2022-2023, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, HSeparator, Node, RichText, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import createOrbitalInformationCheckboxes from './createOrbitalInformationCheckboxes.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';

type SelfOptions = EmptySelfOptions;

export type MySolarSystemControlsOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class MySolarSystemControls extends VBox {

  public constructor(
    model: MySolarSystemModel,
    topLayer: Node,
    providedOptions: MySolarSystemControlsOptions
  ) {

    super( {
      children: [
        ...createOrbitalInformationCheckboxes( model, providedOptions.tandem ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( model, providedOptions.tandem ),
        new HBox( {
          maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH,
          leftMargin: 20,
          spacing: 0,
          enabledProperty: model.gravityVisibleProperty,
          children: [
            new Text( SolarSystemCommonStrings.scaleStringProperty, SolarSystemCommonConstants.TEXT_OPTIONS ),
            new NumberControl( SolarSystemCommonStrings.scaleStringProperty, model.forceScaleProperty, model.forceScaleProperty.range, {
              arrowButtonOptions: { visible: false },
              sliderOptions: {
                constrainValue: ( power: number ) => Math.abs( power ) < 0.5 ? 0 : power,
                shiftKeyboardStep: 0.5,
                keyboardStep: 1,
                pageKeyboardStep: 2,
                majorTickStroke: SolarSystemCommonColors.foregroundProperty,
                majorTickLength: 8,
                trackFillEnabled: SolarSystemCommonColors.foregroundProperty,
                majorTicks: [
                  { value: -2, label: new RichText( 'x10<sup>-2</sup', SolarSystemCommonConstants.TEXT_OPTIONS ) },
                  { value: 8, label: new RichText( 'x10<sup>8</sup', SolarSystemCommonConstants.TEXT_OPTIONS ) }
                ],

              accessibleName: SolarSystemCommonStrings.a11y.scaleSliderStringProperty
              }
            } )
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

