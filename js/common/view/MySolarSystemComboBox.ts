// Copyright 2023, University of Colorado Boulder

/**
 * Combo Box that keeps track of the Lab Modes and their proper string mapping.
 * Creates the ComboBoxItems with tandems and a11y view.
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LabMode from '../../../../solar-system-common/js/model/LabMode.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import { Node, Text } from '../../../../scenery/js/imports.js';

const COMBO_BOX_TEXT_OPTIONS = {
  font: SolarSystemCommonConstants.PANEL_FONT,
  maxWidth: SolarSystemCommonConstants.MAX_WIDTH
};

export default class MySolarSystemComboBox extends ComboBox<LabMode> {
  public constructor( model: MySolarSystemModel, listParent: Node ) {

    // Creating pairings between LabMode and their respective string
    const modeNameMap = new Map<LabMode, TReadOnlyProperty<string>>();
    modeNameMap.set( LabMode.SUN_PLANET, MySolarSystemStrings.mode.sunAndPlanetStringProperty );
    modeNameMap.set( LabMode.SUN_PLANET_MOON, MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty );
    modeNameMap.set( LabMode.SUN_PLANET_COMET, MySolarSystemStrings.mode.sunPlanetAndCometStringProperty );
    modeNameMap.set( LabMode.TROJAN_ASTEROIDS, MySolarSystemStrings.mode.trojanAsteroidsStringProperty );
    modeNameMap.set( LabMode.ELLIPSES, MySolarSystemStrings.mode.ellipsesStringProperty );
    modeNameMap.set( LabMode.HYPERBOLIC, MySolarSystemStrings.mode.hyperbolicStringProperty );
    modeNameMap.set( LabMode.SLINGSHOT, MySolarSystemStrings.mode.slingshotStringProperty );
    modeNameMap.set( LabMode.DOUBLE_SLINGSHOT, MySolarSystemStrings.mode.doubleSlingshotStringProperty );
    modeNameMap.set( LabMode.BINARY_STAR_PLANET, MySolarSystemStrings.mode.binaryStarPlanetStringProperty );
    modeNameMap.set( LabMode.FOUR_STAR_BALLET, MySolarSystemStrings.mode.fourStarBalletStringProperty );
    modeNameMap.set( LabMode.DOUBLE_DOUBLE, MySolarSystemStrings.mode.doubleDoubleStringProperty );
    modeNameMap.set( LabMode.CUSTOM, MySolarSystemStrings.mode.customStringProperty );

    // This create a ComboBoxItem with the proper a11y content convention
    const createModeNode = ( mode: LabMode ): ComboBoxItem<LabMode> => {
      const nameProperty = modeNameMap.get( mode )!;
      return {
        value: mode,
        createNode: () => new Text( nameProperty, COMBO_BOX_TEXT_OPTIONS ),
        a11yName: nameProperty
      };
    };

    const comboBoxItems: ComboBoxItem<LabMode>[] = [];
    modeNameMap.forEach( ( value, key ) => {
      comboBoxItems.push( createModeNode( key ) );
    } );

    super( model.labModeProperty, comboBoxItems, listParent, {
      widthSizable: false,
      layoutOptions: {
        align: 'center'
      },

      //pdom
      accessibleName: 'Mode Selector'
    } );
  }
}

mySolarSystem.register( 'MySolarSystemComboBox', MySolarSystemComboBox );