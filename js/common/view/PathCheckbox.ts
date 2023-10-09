// Copyright 2023, University of Colorado Boulder

/**
 * PathCheckbox is the checkbox labeled 'Path' that controls visibility of the path of bodies.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import { colorProfileProperty, HBox, Image, SceneryConstants, Text, TextOptions } from '../../../../scenery/js/imports.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import solarSystemCommon from '../../../../solar-system-common/js/solarSystemCommon.js';
import pathIcon_png from '../../../../solar-system-common/images/pathIcon_png.js';
import pathIconProjector_png from '../../../../solar-system-common/images/pathIconProjector_png.js';

const TEXT_OPTIONS = combineOptions<TextOptions>( {}, SolarSystemCommonConstants.TEXT_OPTIONS, {
  maxWidth: SolarSystemCommonConstants.CHECKBOX_TEXT_MAX_WIDTH
} );

export default class PathCheckbox extends SolarSystemCommonCheckbox {

  public constructor( pathVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const text = new Text( SolarSystemCommonStrings.pathStringProperty, TEXT_OPTIONS );

    const icon = new Image( pathIcon_png, { scale: 0.25 } );
    colorProfileProperty.lazyLink( profileName => {
      assert && assert( profileName === SceneryConstants.DEFAULT_COLOR_PROFILE || profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE );
      icon.setImage( profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE ? pathIconProjector_png : pathIcon_png );
    } );

    const content = new HBox( {
      children: [ text, icon ],
      spacing: 10
    } );

    super( pathVisibleProperty, content, {
      accessibleName: SolarSystemCommonStrings.pathStringProperty,
      tandem: tandem
    } );
  }
}

solarSystemCommon.register( 'PathCheckbox', PathCheckbox );