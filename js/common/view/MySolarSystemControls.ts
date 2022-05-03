// Copyright 2021-2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MySolarSystemModel from '../../my-solar-system/model/MySolarSystemModel.js';
import mySolarSystem from '../../mySolarSystem.js';
import CheckboxPanel from './CheckboxPanel.js';

// constants
const MENU_SECTION_OPTIONS = { x: 5 };
// const SEPARATOR_OPTIONS = { lineWidth: 2, stroke: MySolarSystemConstants.CONTROL_PANEL_STROKE };

type MySolarSystemControlsOptions = {
  tandem: Tandem;
};

class MySolarSystemControls extends VBox {

  constructor( model: MySolarSystemModel, providedOptions?: Partial<MySolarSystemControlsOptions> ) {
    // const options: MySolarSystemControlsOptions = merge( {}, MySolarSystemConstants.CONTROL_PANEL_OPTIONS, providedOptions ) as unknown as MySolarSystemControlsOptions;

    // top separator rectangle for the gravity control section
    // const topSeparator = new HSeparator( 0, merge( { tandem: options.tandem.createTandem( 'separator1' ) }, SEPARATOR_OPTIONS ) );
    // const bottomSeparator = new HSeparator( 0, merge( { tandem: options.tandem.createTandem( 'separator2' ) }, SEPARATOR_OPTIONS ) );

    // menu sections and separators
    const sections = [
      // new SceneSelectionControls( model.sceneProperty, model.getScenes(), merge( { tandem: options.tandem.createTandem( 'sceneControl' ) }, MENU_SECTION_OPTIONS ) ),
      // topSeparator,
      // new GravityControl( model.gravityEnabledProperty, merge( { tandem: options.tandem.createTandem( 'gravityControl' ) }, MENU_SECTION_OPTIONS ) ),
      // bottomSeparator,
      new CheckboxPanel( model, MENU_SECTION_OPTIONS )
    ];

    super( {
      children: sections,
      spacing: 4,
      y: 5,
      align: 'left'
    } );

    // resize the separators to allow them to go inside the panel margins
    // const separatorWidth = this.width + 2 * MySolarSystemConstants.PANEL_X_MARGIN;
    // topSeparator.setLine( 0, 0, separatorWidth, 0 );
    // bottomSeparator.setLine( 0, 0, separatorWidth, 0 );
  }

}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );
export default MySolarSystemControls;