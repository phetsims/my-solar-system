// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of velocity and gravity arrows checkbox.
 *
 * @author Agustín Vallejo
 */

import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { HBox, HBoxOptions, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';
import CommonModel from '../model/CommonModel.js';

// constants
const ARROW_Y_COORDINATE = -10;

//REVIEW: Factor-out-able options?
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty,
  maxWidth: 200
};

const SPACING = 10;

const createArrowsVisibilityCheckboxes = ( model: CommonModel, tandem: Tandem ): MySolarSystemCheckbox[] => {
  return [
    // gravity force checkbox
    new MySolarSystemCheckbox( model.gravityVisibleProperty, new HBox( combineOptions<HBoxOptions>( {
      children: [
        new Text( MySolarSystemStrings.gravityForceStringProperty, TEXT_OPTIONS ),
        new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: PhetColorScheme.GRAVITATIONAL_FORCE } )
      ]
    }, {
      spacing: SPACING
    } ) ), {
      tandem: tandem.createTandem( 'gravityForceCheckbox' )
    } ),
    // velocity checkbox
    new MySolarSystemCheckbox( model.velocityVisibleProperty, new HBox( combineOptions<HBoxOptions>( {
      children: [
        new Text( MySolarSystemStrings.velocityStringProperty, TEXT_OPTIONS ),
        new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.VELOCITY } )
      ]
    }, {
      spacing: SPACING
    } ) ), {
      tandem: tandem.createTandem( 'velocityCheckbox' )
    } )
  ];
};

mySolarSystem.register( 'createArrowsVisibilityCheckboxes', createArrowsVisibilityCheckboxes );
export default createArrowsVisibilityCheckboxes;