// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of velocity and gravity arrows checkbox.
 *
 * @author Agustín Vallejo
 */

import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IntroModel from '../../intro/model/IntroModel.js';

const velocityString = mySolarSystemStrings.velocity;
const gravityForceString = mySolarSystemStrings.gravityForce;

// constants
const FONT = new PhetFont( 18 );
const ARROW_Y_COORDINATE = -10;
const CHECKBOX_OPTIONS = {
  scale: 0.8,
  checkboxColor: MySolarSystemColors.foregroundProperty,
  checkboxColorBackground: MySolarSystemColors.backgroundProperty
};
const TEXT_OPTIONS = {
  font: FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const SPACING = 10;

const HBOX_OPTIONS = {
  maxWidth: 240,
  spacing: SPACING
};

type ArrowsCheckboxNodeSelfOptions = {};

type ArrowsCheckboxNodeOptions = ArrowsCheckboxNodeSelfOptions & VBoxOptions;

class ArrowsCheckboxNode extends VBox {

  constructor( model: IntroModel, providedOptions?: ArrowsCheckboxNodeOptions ) {

    const children = [];
    const gravityForceTextNode = new Text( gravityForceString, TEXT_OPTIONS );
    const velocityTextNode = new Text( velocityString, TEXT_OPTIONS );
    const optionsWithTandem = ( tandemName: string ) => CHECKBOX_OPTIONS;

    // gravity force checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          gravityForceTextNode,
          new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: PhetColorScheme.GRAVITATIONAL_FORCE } )
        ]
      }, HBOX_OPTIONS ) ),
      model.gravityVisibleProperty, optionsWithTandem( 'gravityForceCheckbox' ) ) );

    // velocity checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          velocityTextNode,
          new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.VELOCITY } )
        ]
      }, HBOX_OPTIONS ) ),
      model.velocityVisibleProperty, optionsWithTandem( 'velocityCheckbox' ) ) );

    // increase the touch area of the checkboxes
    const touchAreaHeight = 32;
    for ( let i = 0; i < children.length; i++ ) {
      const checkboxNode = children[ i ];
      const bounds = checkboxNode.parentToLocalBounds( checkboxNode.bounds );
      // @ts-ignore
      checkboxNode.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
    }

    super( optionize<ArrowsCheckboxNodeOptions, ArrowsCheckboxNodeSelfOptions, VBoxOptions>()( {
      excludeInvisibleChildrenFromBounds: true,
      children: children,
      spacing: SPACING,
      align: 'left',
      bottom: -12,
      tandem: Tandem.REQUIRED
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'ArrowsCheckboxNode', ArrowsCheckboxNode );
export default ArrowsCheckboxNode;