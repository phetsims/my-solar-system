// Copyright 2023, University of Colorado Boulder

/**
 * Combo Box that keeps track of the Lab Modes and their proper string mapping.
 * Creates the ComboBoxItems with tandems and a11y view.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LabMode from '../../../../solar-system-common/js/model/LabMode.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import ComboBox, { ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

export default class LabModeComboBox extends ComboBox<LabMode> {
  public constructor( model: MySolarSystemModel, listParent: Node, providedOptions?: ComboBoxOptions ) {

    const options = optionize<ComboBoxOptions, EmptySelfOptions, ComboBoxOptions>()( {
      buttonTouchAreaXDilation: 10,
      buttonTouchAreaYDilation: 10,

      // pdom
      accessibleName: MySolarSystemStrings.a11y.labScreen.modeSelectorStringProperty
    }, providedOptions );

    const createItem = ( mode: LabMode, nameProperty: TReadOnlyProperty<string> ) => {
      return {
        value: mode,
        createNode: () => new Text( nameProperty, {
          font: SolarSystemCommonConstants.PANEL_FONT,
          maxWidth: SolarSystemCommonConstants.TEXT_MAX_WIDTH
        } ),
        a11yName: nameProperty
      };
    };

    super( model.labModeProperty, [
      createItem( LabMode.SUN_PLANET, MySolarSystemStrings.mode.sunAndPlanetStringProperty ),
      createItem( LabMode.SUN_PLANET_MOON, MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty ),
      createItem( LabMode.SUN_PLANET_COMET, MySolarSystemStrings.mode.sunPlanetAndCometStringProperty ),
      createItem( LabMode.TROJAN_ASTEROIDS, MySolarSystemStrings.mode.trojanAsteroidsStringProperty ),
      createItem( LabMode.ELLIPSES, MySolarSystemStrings.mode.ellipsesStringProperty ),
      createItem( LabMode.HYPERBOLIC, MySolarSystemStrings.mode.hyperbolicStringProperty ),
      createItem( LabMode.SLINGSHOT, MySolarSystemStrings.mode.slingshotStringProperty ),
      createItem( LabMode.DOUBLE_SLINGSHOT, MySolarSystemStrings.mode.doubleSlingshotStringProperty ),
      createItem( LabMode.BINARY_STAR_PLANET, MySolarSystemStrings.mode.binaryStarPlanetStringProperty ),
      createItem( LabMode.FOUR_STAR_BALLET, MySolarSystemStrings.mode.fourStarBalletStringProperty ),
      createItem( LabMode.DOUBLE_DOUBLE, MySolarSystemStrings.mode.doubleDoubleStringProperty ),
      createItem( LabMode.CUSTOM, MySolarSystemStrings.mode.customStringProperty )
    ], listParent, options );
  }
}

mySolarSystem.register( 'LabModeComboBox', LabModeComboBox );