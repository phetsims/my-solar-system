// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, Image, Text } from '../../../../scenery/js/imports.js';
import pathIcon_png from '../../../images/pathIcon_png.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import CommonModel from '../model/CommonModel.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
//REVIEW: This is shared between VisibilityInformation and OrbitalInformation, can we factor it out? Thoughts?
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const createOrbitalInformationCheckboxes = ( model: CommonModel, tandem: Tandem ): MySolarSystemCheckbox[] => {

  const pathIconImageNode = new Image( pathIcon_png, { scale: 0.25 } );

  return [
    new MySolarSystemCheckbox( model.pathVisibleProperty, new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.pathStringProperty, TEXT_OPTIONS ),
        pathIconImageNode
      ],
      tandem: tandem.createTandem( 'pathVisibleCheckbox' )
    } ), MySolarSystemConstants.CHECKBOX_OPTIONS ),
    new MySolarSystemCheckbox( model.centerOfMass.visibleProperty, new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.centerOfMassStringProperty, TEXT_OPTIONS ),
        new XNode( {
          fill: 'red',
          stroke: 'white',
          scale: 0.5
        } )
      ],
      tandem: tandem.createTandem( 'centerOfMassVisibleCheckbox' )
    } ), MySolarSystemConstants.CHECKBOX_OPTIONS )
  ];
};

export default createOrbitalInformationCheckboxes;
mySolarSystem.register( 'createOrbitalInformationCheckboxes', createOrbitalInformationCheckboxes );