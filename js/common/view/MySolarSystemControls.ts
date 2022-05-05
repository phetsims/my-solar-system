// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { VBox } from '../../../../scenery/js/imports.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IntroModel from '../../intro/model/IntroModel.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import ArrowsCheckboxNode from './ArrowsCheckboxNode.js';
import CheckboxNode from './CheckboxNode.js';


// constants
const MENU_SECTION_OPTIONS = { x: 5 };
const SEPARATOR_OPTIONS = { lineWidth: 2, stroke: MySolarSystemConstants.CONTROL_PANEL_STROKE };

type MySolarSystemControlsOptions = {
  tandem: Tandem;
};

class MySolarSystemControls extends VBox {

  constructor( model: IntroModel, providedOptions?: Partial<MySolarSystemControlsOptions> ) {
    // const options: MySolarSystemControlsOptions = merge( {}, MySolarSystemConstants.CONTROL_PANEL_OPTIONS, providedOptions ) as unknown as MySolarSystemControlsOptions;

    // top separator rectangle for the gravity control section
    // const topSeparator = new HSeparator( 0, merge( { tandem: options.tandem.createTandem( 'separator1' ) }, SEPARATOR_OPTIONS ) );
    const bottomSeparator = new HSeparator( 0, SEPARATOR_OPTIONS );

    // menu sections and separators
    const sections = [
      // new SceneSelectionControls( model.sceneProperty, model.getScenes(), merge( { tandem: options.tandem.createTandem( 'sceneControl' ) }, MENU_SECTION_OPTIONS ) ),
      // topSeparator,
      new CheckboxNode( model, MENU_SECTION_OPTIONS ),
      bottomSeparator,
      new ArrowsCheckboxNode( model, MENU_SECTION_OPTIONS )
    ];

    super( {
      children: sections,
      spacing: 4,
      y: 5,
      align: 'left'
    } );

    // resize the separators to allow them to go inside the panel margins
    const separatorWidth = this.width + 2 * MySolarSystemConstants.PANEL_X_MARGIN;
    // topSeparator.setLine( 0, 0, separatorWidth, 0 );
    bottomSeparator.setLine( 0, 0, separatorWidth, 0 );
  }

}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );
export default MySolarSystemControls;