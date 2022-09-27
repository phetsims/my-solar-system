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

//REVIEW: Perhaps note these are text options for within the combo box.
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT
};

/**
 * The possible pre-sets for the lab are:
 Sun and planet
 Sun, planet, moon
 Sun, planet, comet
 Trojan asteroid
 Ellipses
 Hyperbolic
 Slingshot
 Double Slingshot
 Binary star, planet
 Four-star ballet
 Double double
 Custom
 */

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
                { value: LabModes.SUN_PLANET, node: new Text( MySolarSystemStrings.mode.sunAndPlanetStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.SUN_PLANET_MOON, node: new Text( MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.SUN_PLANET_COMET, node: new Text( MySolarSystemStrings.mode.sunPlanetAndCometStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.TROJAN_ASTEROIDS, node: new Text( MySolarSystemStrings.mode.trojanAsteroidsStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.ELLIPSES, node: new Text( MySolarSystemStrings.mode.ellipsesStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.HYPERBOLIC, node: new Text( MySolarSystemStrings.mode.hyperbolicStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.SLINGSHOT, node: new Text( MySolarSystemStrings.mode.slingshotStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.DOUBLE_SLINGSHOT, node: new Text( MySolarSystemStrings.mode.doubleSlingshotStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.BINARY_STAR_PLANET, node: new Text( MySolarSystemStrings.mode.binaryStarPlanetStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.FOUR_STAR_BALLET, node: new Text( MySolarSystemStrings.mode.fourStarBalletStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.DOUBLE_DOUBLE, node: new Text( MySolarSystemStrings.mode.doubleDoubleStringProperty, TEXT_OPTIONS ) },
                { value: LabModes.CUSTOM, node: new Text( MySolarSystemStrings.mode.customStringProperty, TEXT_OPTIONS ) }
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
      spacing: 5,
      align: 'left',
      stretch: true
    } );
  }
}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );
