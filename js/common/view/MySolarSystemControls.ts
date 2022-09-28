// Copyright 2022, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HSeparator, Node, Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import mySolarSystem from '../../mySolarSystem.js';
import LabModes from '../model/LabModes.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import CommonModel from '../model/CommonModel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import createVisibilityInformationCheckboxes from './createVisibilityInformationCheckboxes.js';
import createArrowsVisibilityCheckboxes from './createArrowsVisibilityCheckboxes.js';
import createOrbitalInformationCheckboxes from './createOrbitalInformationCheckboxes.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';

const COMBO_BOX_TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT
};

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
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
                { value: LabModes.SUN_PLANET, node: new Text( MySolarSystemStrings.mode.sunAndPlanetStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.SUN_PLANET_MOON, node: new Text( MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.SUN_PLANET_COMET, node: new Text( MySolarSystemStrings.mode.sunPlanetAndCometStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.TROJAN_ASTEROIDS, node: new Text( MySolarSystemStrings.mode.trojanAsteroidsStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.ELLIPSES, node: new Text( MySolarSystemStrings.mode.ellipsesStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.HYPERBOLIC, node: new Text( MySolarSystemStrings.mode.hyperbolicStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.SLINGSHOT, node: new Text( MySolarSystemStrings.mode.slingshotStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.DOUBLE_SLINGSHOT, node: new Text( MySolarSystemStrings.mode.doubleSlingshotStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.BINARY_STAR_PLANET, node: new Text( MySolarSystemStrings.mode.binaryStarPlanetStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.FOUR_STAR_BALLET, node: new Text( MySolarSystemStrings.mode.fourStarBalletStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.DOUBLE_DOUBLE, node: new Text( MySolarSystemStrings.mode.doubleDoubleStringProperty, COMBO_BOX_TEXT_OPTIONS ) },
                { value: LabModes.CUSTOM, node: new Text( MySolarSystemStrings.mode.customStringProperty, COMBO_BOX_TEXT_OPTIONS ) }
              ], topLayer, {
                tandem: providedOptions.tandem.createTandem( 'labModeComboBox' )
              } )
            ]
          : [] ),
        ...createOrbitalInformationCheckboxes( model, providedOptions.tandem ),
        new HSeparator( MySolarSystemConstants.HSEPARATOR_OPTIONS ),
        ...createArrowsVisibilityCheckboxes( model, providedOptions.tandem ),
        new HSeparator( MySolarSystemConstants.HSEPARATOR_OPTIONS ),
        ...createVisibilityInformationCheckboxes( model, providedOptions.tandem ),
        // add a Units title and a Switch between Arbitrary and Real
        new VBox( {
          children: [
            new Text( MySolarSystemStrings.units.unitsStringProperty, combineOptions<TextOptions>( {
              layoutOptions: {
                align: 'left'
              }
            }, TEXT_OPTIONS ) ),
            new ABSwitch(
              model.realUnitsProperty,
              true,
              new Text( MySolarSystemStrings.units.realStringProperty, TEXT_OPTIONS ),
              false,
              new Text( MySolarSystemStrings.units.arbitraryStringProperty, TEXT_OPTIONS ),
              {
                scale: 0.8,
                tandem: providedOptions.tandem.createTandem( 'unitsSwitch' )
              }
            )
          ]
        } )
      ],
      spacing: 5,
      align: 'left',
      stretch: true
    } );
  }
}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );
