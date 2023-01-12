// Copyright 2022, University of Colorado Boulder

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
import LabModes from '../model/LabModes.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import CommonModel from '../model/CommonModel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import createVisibilityInformationCheckboxes from './createVisibilityInformationCheckboxes.js';
import createArrowsVisibilityCheckboxes from './createArrowsVisibilityCheckboxes.js';
import createOrbitalInformationCheckboxes from './createOrbitalInformationCheckboxes.js';

const COMBO_BOX_TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  maxWidth: 200
};

type SelfOptions = EmptySelfOptions;

export type MySolarSystemControlsOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class MySolarSystemControls extends VBox {

  public constructor(
    model: CommonModel,
    topLayer: Node,
    providedOptions: MySolarSystemControlsOptions
  ) {

    super( {
      children: [
        ...(
          model.isLab
          ? [
              new ComboBox( model.labModeProperty, [
                { value: LabModes.SUN_PLANET, createNode: tandem => new Text( MySolarSystemStrings.mode.sunAndPlanetStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.SUN_PLANET_MOON, createNode: tandem => new Text( MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.SUN_PLANET_COMET, createNode: tandem => new Text( MySolarSystemStrings.mode.sunPlanetAndCometStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.TROJAN_ASTEROIDS, createNode: tandem => new Text( MySolarSystemStrings.mode.trojanAsteroidsStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.ELLIPSES, createNode: tandem => new Text( MySolarSystemStrings.mode.ellipsesStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.HYPERBOLIC, createNode: tandem => new Text( MySolarSystemStrings.mode.hyperbolicStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.SLINGSHOT, createNode: tandem => new Text( MySolarSystemStrings.mode.slingshotStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.DOUBLE_SLINGSHOT, createNode: tandem => new Text( MySolarSystemStrings.mode.doubleSlingshotStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.BINARY_STAR_PLANET, createNode: tandem => new Text( MySolarSystemStrings.mode.binaryStarPlanetStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.FOUR_STAR_BALLET, createNode: tandem => new Text( MySolarSystemStrings.mode.fourStarBalletStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.DOUBLE_DOUBLE, createNode: tandem => new Text( MySolarSystemStrings.mode.doubleDoubleStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.CUSTOM, createNode: tandem => new Text( MySolarSystemStrings.mode.customStringProperty, COMBO_BOX_TEXT_OPTIONS ) }
              ], topLayer, {
                tandem: providedOptions.tandem.createTandem( 'labModeComboBox' )
              } )
            ]
          : [] ),
        ...createOrbitalInformationCheckboxes( model, providedOptions.tandem ),
        new HSeparator( MySolarSystemConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( model, providedOptions.tandem ),
        new HSeparator( MySolarSystemConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( model, providedOptions.tandem )
      ],
      spacing: 7,
      align: 'left',
      stretch: true
    } );
  }
}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );

