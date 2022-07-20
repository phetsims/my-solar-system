// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of velocity and gravity arrows checkbox.
 *
 * @author Agustín Vallejo
 */

import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { HBox, HBoxOptions, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IntroModel from '../../intro/model/IntroModel.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';

const velocityString = mySolarSystemStrings.velocity;
const gravityForceString = mySolarSystemStrings.gravityForce;

// constants
const ARROW_Y_COORDINATE = -10;
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const SPACING = 10;

const HBOX_OPTIONS = {
  maxWidth: 240,
  spacing: SPACING
};

type SelfOptions = EmptySelfOptions;

type ArrowsCheckboxNodeOptions = SelfOptions & VBoxOptions;

class ArrowsCheckboxNode extends VBox {

  public constructor( model: IntroModel, providedOptions?: ArrowsCheckboxNodeOptions ) {

    const children = [];
    const gravityForceTextNode = new Text( gravityForceString, TEXT_OPTIONS );
    const velocityTextNode = new Text( velocityString, TEXT_OPTIONS );

    // gravity force checkbox
    children.push( new MySolarSystemCheckbox( model.gravityVisibleProperty, new HBox( combineOptions<HBoxOptions>( {
      children: [
        gravityForceTextNode,
        new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: PhetColorScheme.GRAVITATIONAL_FORCE } )
      ]
    }, HBOX_OPTIONS ) ) ) );

    // velocity checkbox
    children.push( new MySolarSystemCheckbox( model.velocityVisibleProperty, new HBox( combineOptions<HBoxOptions>( {
      children: [
        velocityTextNode,
        new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.VELOCITY } )
      ]
    }, HBOX_OPTIONS ) ) ) );

    super( optionize<ArrowsCheckboxNodeOptions, SelfOptions, VBoxOptions>()( {
      excludeInvisibleChildrenFromBounds: true,
      children: children,
      spacing: SPACING,
      align: 'left',
      stretch: true,
      bottom: -12,
      tandem: Tandem.REQUIRED
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'ArrowsCheckboxNode', ArrowsCheckboxNode );
export default ArrowsCheckboxNode;