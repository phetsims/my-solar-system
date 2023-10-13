// Copyright 2023, University of Colorado Boulder

/**
 * OrbitalSystemComboBox is the control for selecting an OrbitalSystem (configuration of bodies).
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import OrbitalSystem from '../model/OrbitalSystem.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;
type LabModeComboBoxOptions = SelfOptions &
  PickOptional<ComboBoxOptions, 'widthSizable' | 'layoutOptions' | 'phetioVisiblePropertyInstrumented'> &
  PickRequired<ComboBoxOptions, 'tandem'>;

export default class OrbitalSystemComboBox extends ComboBox<OrbitalSystem> {

  public constructor( orbitalSystemProperty: Property<OrbitalSystem>, listboxParent: Node, providedOptions: LabModeComboBoxOptions ) {

    const options = optionize<LabModeComboBoxOptions, SelfOptions, ComboBoxOptions>()( {

      // ComboBoxOptions
      buttonTouchAreaXDilation: 10,
      buttonTouchAreaYDilation: 10,

      // pdom
      accessibleName: MySolarSystemStrings.a11y.labScreen.orbitalSystemSelectorStringProperty
    }, providedOptions );

    const items: ComboBoxItem<OrbitalSystem>[] = [
      createItem( OrbitalSystem.SUN_PLANET, MySolarSystemStrings.mode.sunAndPlanetStringProperty ),
      createItem( OrbitalSystem.SUN_PLANET_MOON, MySolarSystemStrings.mode.sunPlanetAndMoonStringProperty ),
      createItem( OrbitalSystem.SUN_PLANET_COMET, MySolarSystemStrings.mode.sunPlanetAndCometStringProperty ),
      createItem( OrbitalSystem.TROJAN_ASTEROIDS, MySolarSystemStrings.mode.trojanAsteroidsStringProperty ),
      createItem( OrbitalSystem.ELLIPSES, MySolarSystemStrings.mode.ellipsesStringProperty ),
      createItem( OrbitalSystem.HYPERBOLIC, MySolarSystemStrings.mode.hyperbolicStringProperty ),
      createItem( OrbitalSystem.SLINGSHOT, MySolarSystemStrings.mode.slingshotStringProperty ),
      createItem( OrbitalSystem.DOUBLE_SLINGSHOT, MySolarSystemStrings.mode.doubleSlingshotStringProperty ),
      createItem( OrbitalSystem.BINARY_STAR_PLANET, MySolarSystemStrings.mode.binaryStarPlanetStringProperty ),
      createItem( OrbitalSystem.FOUR_STAR_BALLET, MySolarSystemStrings.mode.fourStarBalletStringProperty ),
      createItem( OrbitalSystem.DOUBLE_DOUBLE, MySolarSystemStrings.mode.doubleDoubleStringProperty ),
      createItem( OrbitalSystem.CUSTOM, MySolarSystemStrings.mode.customStringProperty )
    ];

    super( orbitalSystemProperty, items, listboxParent, options );
  }
}

/**
 * Creates an item for the combo box.
 */
function createItem( orbitalSystem: OrbitalSystem, nameProperty: TReadOnlyProperty<string> ): ComboBoxItem<OrbitalSystem> {
  return {
    value: orbitalSystem,
    createNode: () => new Text( nameProperty, {
      font: SolarSystemCommonConstants.COMBO_BOX_ITEM_FONT,
      maxWidth: 200
    } ),
    a11yName: nameProperty
  };
}

mySolarSystem.register( 'OrbitalSystemComboBox', OrbitalSystemComboBox );