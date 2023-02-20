// Copyright 2022-2023, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { colorProfileProperty, HBox, Image, SceneryConstants, Text, TextOptions } from '../../../../scenery/js/imports.js';
import pathIcon_png from '../../../images/pathIcon_png.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import CommonModel from '../../../../solar-system-common/js/model/CommonModel.js';
import SolarSystemCommonCheckbox from '../../../../solar-system-common/js/view/SolarSystemCommonCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import pathIconProjector_png from '../../../images/pathIconProjector_png.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';

// constants
const TEXT_OPTIONS = combineOptions<TextOptions>( {
  maxWidth: 200
}, SolarSystemCommonConstants.TEXT_OPTIONS );

const createOrbitalInformationCheckboxes = ( model: CommonModel, tandem: Tandem ): SolarSystemCommonCheckbox[] => {

  const pathIconImageNode = new Image( pathIcon_png, { scale: 0.25 } );
  colorProfileProperty.lazyLink( ( profileName: string ) => {
    assert && assert( profileName === SceneryConstants.DEFAULT_COLOR_PROFILE || profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE );
    pathIconImageNode.setImage( profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE ? pathIconProjector_png : pathIcon_png );
  } );

  return [
    new SolarSystemCommonCheckbox( model.pathVisibleProperty, new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.pathStringProperty, TEXT_OPTIONS ),
        pathIconImageNode
      ],
      tandem: tandem.createTandem( 'pathVisibleCheckbox' )
    } ), SolarSystemCommonConstants.CHECKBOX_OPTIONS ),
    new SolarSystemCommonCheckbox( model.centerOfMass.visibleProperty, new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.centerOfMassStringProperty, TEXT_OPTIONS ),
        new XNode( {
          fill: 'red',
          stroke: SolarSystemCommonColors.foregroundProperty,
          scale: 0.5
        } )
      ],
      tandem: tandem.createTandem( 'centerOfMassVisibleCheckbox' )
    } ), SolarSystemCommonConstants.CHECKBOX_OPTIONS )
  ];
};

export default createOrbitalInformationCheckboxes;
mySolarSystem.register( 'createOrbitalInformationCheckboxes', createOrbitalInformationCheckboxes );