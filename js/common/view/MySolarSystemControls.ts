// Copyright 2022-2023, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HSeparator, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import mySolarSystem from '../../mySolarSystem.js';
import LabMode from '../../../../solar-system-common/js/model/LabMode.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import createVisibilityInformationCheckboxes from '../../../../solar-system-common/js/view/createVisibilityInformationCheckboxes.js';
import createArrowsVisibilityCheckboxes from '../../../../solar-system-common/js/view/createArrowsVisibilityCheckboxes.js';
import createOrbitalInformationCheckboxes from './createOrbitalInformationCheckboxes.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';

const COMBO_BOX_TEXT_OPTIONS = {
  font: SolarSystemCommonConstants.PANEL_FONT,
  maxWidth: SolarSystemCommonConstants.MAX_WIDTH
};

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
        ...(
          model.isLab
          ? [
              new ComboBox( model.labModeProperty, [
                { value: LabMode.SUN_PLANET, createNode: () => new Text( MySolarSystemStrings.mode.sunAndPlanetStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.SUN_PLANET_MOON, createNode: () => new Text( MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.SUN_PLANET_COMET, createNode: () => new Text( MySolarSystemStrings.mode.sunPlanetAndCometStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.TROJAN_ASTEROIDS, createNode: () => new Text( MySolarSystemStrings.mode.trojanAsteroidsStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.ELLIPSES, createNode: () => new Text( MySolarSystemStrings.mode.ellipsesStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.HYPERBOLIC, createNode: () => new Text( MySolarSystemStrings.mode.hyperbolicStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.SLINGSHOT, createNode: () => new Text( MySolarSystemStrings.mode.slingshotStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.DOUBLE_SLINGSHOT, createNode: () => new Text( MySolarSystemStrings.mode.doubleSlingshotStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.BINARY_STAR_PLANET, createNode: () => new Text( MySolarSystemStrings.mode.binaryStarPlanetStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.FOUR_STAR_BALLET, createNode: () => new Text( MySolarSystemStrings.mode.fourStarBalletStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.DOUBLE_DOUBLE, createNode: () => new Text( MySolarSystemStrings.mode.doubleDoubleStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabMode.CUSTOM, createNode: () => new Text( MySolarSystemStrings.mode.customStringProperty, COMBO_BOX_TEXT_OPTIONS ) }
              ], topLayer, {
                tandem: providedOptions.tandem.createTandem( 'labModeComboBox' )
              } )
            ]
          : [] ),
        ...createOrbitalInformationCheckboxes( model, providedOptions.tandem ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( model, providedOptions.tandem ),
        new HSeparator( SolarSystemCommonConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( model, providedOptions.tandem )
      ],
      spacing: SolarSystemCommonConstants.CHECKBOX_SPACING,
      align: 'left',
      stretch: true
    } );
  }
}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );

