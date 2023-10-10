// Copyright 2023, University of Colorado Boulder

/**
 * MySolarSystemCheckbox creates checkboxes that are specific to the My Solar System sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SolarSystemCommonCheckbox, { SolarSystemCommonCheckboxOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import Property from '../../../../axon/js/Property.js';
import { colorProfileProperty, HBox, Image, Node, SceneryConstants, Text } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import pathIcon_png from '../../../../solar-system-common/images/pathIcon_png.js';
import pathIconProjector_png from '../../../../solar-system-common/images/pathIconProjector_png.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';

type SelfOptions = EmptySelfOptions;
type MySolarSystemCheckboxOptions = SelfOptions & SolarSystemCommonCheckboxOptions;

export default class MySolarSystemCheckbox extends SolarSystemCommonCheckbox {

  protected constructor( property: Property<boolean>, content: Node, providedOptions?: MySolarSystemCheckboxOptions ) {
    super( property, content, providedOptions );
  }

  /**
   * Creates the 'Center of Mass' checkox
   */
  public static createCenterOfMassCheckbox( centerOfMassVisibleProperty: Property<boolean>, tandem: Tandem ): SolarSystemCommonCheckbox {

    const text = new Text( MySolarSystemStrings.centerOfMassStringProperty, SolarSystemCommonCheckbox.TEXT_OPTIONS );
    const icon = new XNode( {
      fill: 'red',
      stroke: SolarSystemCommonColors.foregroundProperty,
      scale: 0.5
    } );

    const content = new HBox( {
      children: [ text, icon ],
      spacing: 10
    } );

    return new SolarSystemCommonCheckbox( centerOfMassVisibleProperty, content, {
      accessibleName: MySolarSystemStrings.centerOfMassStringProperty,
      tandem: tandem.createTandem( 'centerOfMassCheckbox' )
    } );
  }

  /**
   * Creates the 'Path' checkbox
   */
  public static createPathCheckbox( pathVisibleProperty: Property<boolean>, tandem: Tandem ): SolarSystemCommonCheckbox {

    const text = new Text( SolarSystemCommonStrings.pathStringProperty, SolarSystemCommonCheckbox.TEXT_OPTIONS );
    const icon = new Image( pathIcon_png, { scale: 0.25 } );

    colorProfileProperty.lazyLink( profileName => {
      assert && assert( profileName === SceneryConstants.DEFAULT_COLOR_PROFILE || profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE );
      icon.setImage( profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE ? pathIconProjector_png : pathIcon_png );
    } );

    const content = new HBox( {
      children: [ text, icon ],
      spacing: 10
    } );

    return new SolarSystemCommonCheckbox( pathVisibleProperty, content, {
      accessibleName: SolarSystemCommonStrings.pathStringProperty,
      tandem: tandem
    } );
  }
}

mySolarSystem.register( 'MySolarSystemCheckbox', MySolarSystemCheckbox );