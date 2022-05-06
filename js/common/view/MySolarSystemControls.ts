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
//REVIEW: Will we need multiple separators? I'd encourage this to either be in the constants file (for multiple uses)
//REVIEW: or for it to be inlined into the divider.
const SEPARATOR_OPTIONS = { lineWidth: 2, stroke: MySolarSystemConstants.CONTROL_PANEL_STROKE };

type MySolarSystemControlsOptions = {
  tandem: Tandem;
};

//REVIEW: We'll use FlowBox with a vertical orientation, and then a VDivider (instead of the separator). That will not
//REVIEW: require any code handling the size of it. For example:
//REVIEW: super( {
//REVIEW:   orientation: 'horizontal',
//REVIEW:   spacing: 4,
//REVIEW:   align: 'left',
//REVIEW:   children: [
//REVIEW:     new CheckboxNode( model ),
//REVIEW:     new VDivider( { lineWidth: 2, stroke: MySolarSystemConstants.CONTROL_PANEL_STROKE } ),
//REVIEW:     new ArrowsCheckboxNode( model )
//REVIEW:   ]
//REVIEW: } );

class MySolarSystemControls extends VBox {

  constructor( model: IntroModel, providedOptions?: Partial<MySolarSystemControlsOptions> ) {
    // const options: MySolarSystemControlsOptions = merge( {}, MySolarSystemConstants.CONTROL_PANEL_OPTIONS, providedOptions ) as unknown as MySolarSystemControlsOptions;

    // top separator rectangle for the gravity control section
    // const topSeparator = new HSeparator( 0, merge( { tandem: options.tandem.createTandem( 'separator1' ) }, SEPARATOR_OPTIONS ) );
    const bottomSeparator = new HSeparator( 0, SEPARATOR_OPTIONS );

    //REVIEW: Generally we'll inline this local variable into the super call (OR if desired to have separate, will call
    //REVIEW: it `children`.
    // menu sections and separators
    const sections = [
      // new SceneSelectionControls( model.sceneProperty, model.getScenes(), merge( { tandem: options.tandem.createTandem( 'sceneControl' ) }, MENU_SECTION_OPTIONS ) ),
      // topSeparator,
      //REVIEW: MENU_SECTION_OPTIONS doesn't look helpful. It's specifying an `x` value, which is immediately getting
      //REVIEW: overwritten by the VBox changing its position in the layout. Presumably we can remove this.
      new CheckboxNode( model, MENU_SECTION_OPTIONS ),
      bottomSeparator,
      new ArrowsCheckboxNode( model, MENU_SECTION_OPTIONS )
    ];

    super( {
      children: sections,
      spacing: 4,
      //REVIEW: Why a `y` value here? Generally this shouldn't exist, and if we needed y:5 we would put it in the
      //REVIEW: place that creates the MySolarSystemControls
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