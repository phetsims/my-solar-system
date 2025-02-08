// Copyright 2023-2025, University of Colorado Boulder

/**
 * MySolarSystemCheckbox adds static methods to SolarSystemCommonCheckbox for creating checkboxes that are specific to
 * the My Solar System sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import SceneryConstants from '../../../../scenery/js/SceneryConstants.js';
import colorProfileProperty from '../../../../scenery/js/util/colorProfileProperty.js';
import pathIcon_png from '../../../../solar-system-common/images/pathIcon_png.js';
import pathIconProjector_png from '../../../../solar-system-common/images/pathIconProjector_png.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import SolarSystemCommonCheckbox, { SolarSystemCommonCheckboxOptions } from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';

type SelfOptions = EmptySelfOptions;
type MySolarSystemCheckboxOptions = SelfOptions & SolarSystemCommonCheckboxOptions;

export default class MySolarSystemCheckbox extends SolarSystemCommonCheckbox {

  protected constructor( property: Property<boolean>, stringProperty: TReadOnlyProperty<string>, providedOptions: MySolarSystemCheckboxOptions ) {
    super( property, stringProperty, providedOptions );
  }

  /**
   * Creates the 'Center of Mass' checkbox
   */
  public static createCenterOfMassCheckbox( centerOfMassVisibleProperty: Property<boolean>, tandem: Tandem ): SolarSystemCommonCheckbox {
    return new SolarSystemCommonCheckbox( centerOfMassVisibleProperty, MySolarSystemStrings.centerOfMassStringProperty, {
      icon: new XNode( {
        fill: 'red',
        stroke: SolarSystemCommonColors.foregroundProperty,
        scale: 0.5
      } ),
      phetioDisplayOnlyPropertyInstrumented: true,
      tandem: tandem
    } );
  }

  /**
   * Creates the 'Path' checkbox
   */
  public static createPathCheckbox( pathVisibleProperty: Property<boolean>, tandem: Tandem ): SolarSystemCommonCheckbox {

    const icon = new Image( pathIcon_png, { scale: 0.25 } );
    colorProfileProperty.lazyLink( profileName => {
      assert && assert( profileName === SceneryConstants.DEFAULT_COLOR_PROFILE || profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE );
      icon.setImage( profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE ? pathIconProjector_png : pathIcon_png );
    } );

    return new SolarSystemCommonCheckbox( pathVisibleProperty, SolarSystemCommonStrings.pathStringProperty, {
      icon: icon,
      tandem: tandem
    } );
  }

  /**
   * Creates the 'More Data' checkbox
   */
  public static createMoreDataCheckbox( moreDataVisibleProperty: Property<boolean>, tandem: Tandem ): SolarSystemCommonCheckbox {
    return new SolarSystemCommonCheckbox( moreDataVisibleProperty, MySolarSystemStrings.dataPanel.moreDataStringProperty, {
      textOptions: {
        maxWidth: 300
      },
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      accessibleName: MySolarSystemStrings.a11y.moreDataStringProperty,
      tandem: tandem
    } );
  }
}

mySolarSystem.register( 'MySolarSystemCheckbox', MySolarSystemCheckbox );