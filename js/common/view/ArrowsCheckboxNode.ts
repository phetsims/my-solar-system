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
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CommonModel from '../model/CommonModel.js';

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

export type ArrowsCheckboxNodeOptions = SelfOptions & StrictOmit<VBoxOptions, 'children'>;

class ArrowsCheckboxNode extends VBox {

  public constructor( model: CommonModel, providedOptions?: ArrowsCheckboxNodeOptions ) {

    super( optionize<ArrowsCheckboxNodeOptions, SelfOptions, VBoxOptions>()( {
      excludeInvisibleChildrenFromBounds: true,
      children: [
        // gravity force checkbox
        new MySolarSystemCheckbox( model.gravityVisibleProperty, new HBox( combineOptions<HBoxOptions>( {
          children: [
            new Text( mySolarSystemStrings.gravityForce, TEXT_OPTIONS ),
            new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: PhetColorScheme.GRAVITATIONAL_FORCE } )
          ]
        }, HBOX_OPTIONS ) ) ),
        // velocity checkbox
        new MySolarSystemCheckbox( model.velocityVisibleProperty, new HBox( combineOptions<HBoxOptions>( {
          children: [
            new Text( mySolarSystemStrings.velocity, TEXT_OPTIONS ),
            new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.VELOCITY } )
          ]
        }, HBOX_OPTIONS ) ) )
      ],
      spacing: SPACING,
      align: 'left',
      stretch: true,

      //REVIEW: positioning code shouldn't go in the type, but in the usage
      bottom: -12,
      tandem: Tandem.REQUIRED
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'ArrowsCheckboxNode', ArrowsCheckboxNode );
export default ArrowsCheckboxNode;