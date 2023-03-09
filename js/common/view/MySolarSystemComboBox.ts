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
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import { Node, Text } from '../../../../scenery/js/imports.js';

//REVIEW: This is only used once, why not inline it?
const COMBO_BOX_TEXT_OPTIONS = {
  font: SolarSystemCommonConstants.PANEL_FONT,
  maxWidth: SolarSystemCommonConstants.MAX_WIDTH
};

export default class MySolarSystemComboBox extends ComboBox<LabMode> {
  public constructor( model: MySolarSystemModel, listParent: Node ) {

    //REVIEW: Read this first!
    //REVIEW: A Map is being used. We're implicitly relying on the map being iterable in the order that it was
    //REVIEW: constructed, which is NOT a guarantee I'd want to rely on.
    //REVIEW: I'd suggest the following:
    //REVIEW:
    //REVIEW: const createItem = ( mode: LabMode, nameProperty: TReadOnlyProperty<string> ) => {
    //REVIEW:   return {
    //REVIEW:     value: mode,
    //REVIEW:     createNode: () => new Text( nameProperty, {
    //REVIEW:       font: SolarSystemCommonConstants.PANEL_FONT,
    //REVIEW:       maxWidth: SolarSystemCommonConstants.MAX_WIDTH
    //REVIEW:     } ),
    //REVIEW:     a11yName: nameProperty
    //REVIEW:   };
    //REVIEW: };
    //REVIEW:
    //REVIEW: // ACTUALLY..... I would inline this, so I don't have to name the array
    //REVIEW: const comboBoxItems = [
    //REVIEW:   createItem( LabMode.SUN_PLANET, MySolarSystemStrings.mode.sunAndPlanetStringProperty ),
    //REVIEW:   createItem( LabMode.SUN_PLANET_MOON, MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty ),
    //REVIEW:   // ...
    //REVIEW: ];
    //REVIEW:
    //REVIEW: This is a LOT simpler, doesn't require maps, doesn't rely on Map order, or the other issues below.
    //REVIEW: BUT: please read about the issues below, hopefully it's helpful!

    // Creating pairings between LabMode and their respective string
    const modeNameMap = new Map<LabMode, TReadOnlyProperty<string>>();
    //REVIEW: We're mapping over an enumeration. Please use EnumerationMap.
    //REVIEW: You won't have to guard the map.get() calls below, since it will be guaranteed to have a value.
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

    // This creates a ComboBoxItem with the proper a11y content convention
    //REVIEW: Bad name, this is NOT returning a Node!!! createModeItem?
    const createModeNode = ( mode: LabMode ): ComboBoxItem<LabMode> => {
      const nameProperty = modeNameMap.get( mode )!;
      return {
        value: mode,
        createNode: () => new Text( nameProperty, COMBO_BOX_TEXT_OPTIONS ),
        a11yName: nameProperty
      };
    };

    //REVIEW: 1: const comboBoxItems = [ ...modeNameMap.keys() ].map( createModeNode );
    //REVIEW: 2: inline it, since it's only used once
    //REVIEW: 3: OR, inline createModeNode. We're just mapping with a function, usually we inline those functions
    //REVIEW: 4: You're mapping over modes, which we already have an array for (LabMode.enumeration.values)
    //REVIEW: So:
    //REVIEW: const comboBoxItems = LabMode.enumeration.values.map( mode => {
    //REVIEW:   const nameProperty = modeNameMap.get( mode );
    //REVIEW:   return {
    //REVIEW:     value: mode,
    //REVIEW:     createNode: () => new Text( nameProperty, COMBO_BOX_TEXT_OPTIONS ),
    //REVIEW:      a11yName: nameProperty
    //REVIEW:   }
    //REVIEW: } );
    const comboBoxItems: ComboBoxItem<LabMode>[] = [];
    modeNameMap.forEach( ( value, key ) => {
      comboBoxItems.push( createModeNode( key ) );
    } );

    super( model.labModeProperty, comboBoxItems, listParent, {
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