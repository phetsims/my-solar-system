// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Shape } from '../../../../kite/js/imports.js';
import { FlowBox, Image, Text, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import pathIcon_png from '../../../images/pathIcon_png.js';
import mySolarSystem from '../../mySolarSystem.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import CommonModel from '../model/CommonModel.js';

const pathString = mySolarSystemStrings.path;
const massString = mySolarSystemStrings.mass;

// constants
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const SPACING = 10;

type SelfOptions = {};

type OrbitalInformationOptions = SelfOptions & VBoxOptions;

class OrbitalInformation extends FlowBox {

  constructor( model: CommonModel, providedOptions?: OrbitalInformationOptions ) {

    const pathIconImageNode = new Image( pathIcon_png, { scale: 0.25 } );

    const children = [
      new Checkbox( new FlowBox( {
        spacing: 10,
        children: [
          new Text( pathString, TEXT_OPTIONS ),
          pathIconImageNode
        ]
      } ), model.pathVisibleProperty, MySolarSystemConstants.CHECKBOX_OPTIONS ),
      new Checkbox( new FlowBox( {
        spacing: 10,
        children: [
          new Text( massString, TEXT_OPTIONS ),
          new XNode( {
            fill: 'red',
            stroke: 'white',
            center: Vector2.ZERO,
            scale: 0.5
          } )
        ]
      } ), model.centerOfMass.visibleProperty, MySolarSystemConstants.CHECKBOX_OPTIONS )
    ];

    // increase the touch area of the checkboxes
    const touchAreaHeight = 32;
    children.forEach( child => {
      const OrbitalInformation = child;
      const bounds = OrbitalInformation.parentToLocalBounds( OrbitalInformation.bounds );
      OrbitalInformation.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
    } );

    super( optionize<OrbitalInformationOptions, SelfOptions, FlowBox>()( {
      children: children,
      spacing: SPACING,
      orientation: 'vertical',
      align: 'left',
      stretch: true
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'OrbitalInformation', OrbitalInformation );
export default OrbitalInformation;