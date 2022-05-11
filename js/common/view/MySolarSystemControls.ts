// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { FlowBox, VDivider } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IntroModel from '../../intro/model/IntroModel.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import ArrowsCheckboxNode from './ArrowsCheckboxNode.js';
import VisibilityCheckboxes from './VisibilityCheckboxes.js';

type MySolarSystemControlsOptions = {
  tandem: Tandem;
};

class MySolarSystemControls extends FlowBox {

  constructor( model: IntroModel, providedOptions?: Partial<MySolarSystemControlsOptions> ) {
    super( {
      children: [
        new VisibilityCheckboxes( model ),
        new VDivider( {
          lineWidth: 2,
          stroke: MySolarSystemConstants.CONTROL_PANEL_STROKE,
          layoutOptions: {
            yMargin: 5
          }
        } ),
        new ArrowsCheckboxNode( model )
      ],
      spacing: 4,
      align: 'left',
      stretch: true,
      orientation: 'vertical'
    } );
  }

}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );
export default MySolarSystemControls;