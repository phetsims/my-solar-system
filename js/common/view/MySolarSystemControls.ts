// Copyright 2022-2023, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HSeparator, Node, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import createOrbitalInformationCheckboxes from './createOrbitalInformationCheckboxes.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';

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
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( model, providedOptions.tandem )
      ],
      spacing: SolarSystemCommonConstants.CHECKBOX_SPACING,
      align: 'left',
      stretch: true,

      //pdom
      containerTagName: 'h1',
      accessibleName: 'Controls Checkboxes'
    } );
  }
}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );

