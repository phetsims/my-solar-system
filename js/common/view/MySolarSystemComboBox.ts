// Copyright 2023, University of Colorado Boulder

/**
 * Combo Box that keeps track of the Lab Modes and their proper string mapping.
 * Creates the ComboBoxItems with tandems and a11y view.
 * REVIEW: Can this name note something more specific about lab modes? This doesn't seem like a general "supertype for
 * REVIEW: any ComboBox in the sim" that I would get from the name.
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LabMode from '../../../../solar-system-common/js/model/LabMode.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import { Node, Text } from '../../../../scenery/js/imports.js';

export default class MySolarSystemComboBox extends ComboBox<LabMode> {
  public constructor( model: MySolarSystemModel, listParent: Node ) {

    const createItem = ( mode: LabMode, nameProperty: TReadOnlyProperty<string> ) => {
      return {
        value: mode,
        createNode: () => new Text( nameProperty, {
          font: SolarSystemCommonConstants.PANEL_FONT,
          maxWidth: SolarSystemCommonConstants.MAX_WIDTH
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
    ], listParent, {
      //REVIEW: Please provide an options object in the constructor, so these can be provided in the client location
      //REVIEW: These options aren't general "all ComboBoxes should have these options" options, they're specific to
      //REVIEW: the specific usage, which is in the client (MySolarSystemScreenView)
      widthSizable: false,
      layoutOptions: {
        align: 'center'
      },

      buttonTouchAreaXDilation: 10,
      buttonTouchAreaYDilation: 10,

      //pdom
      accessibleName: 'Mode Selector'
    } );
  }
}

mySolarSystem.register( 'MySolarSystemComboBox', MySolarSystemComboBox );