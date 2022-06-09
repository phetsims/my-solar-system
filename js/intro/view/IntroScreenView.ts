// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 * 
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import IntroModel from '../model/IntroModel.js';
import CommonScreenView, { CommonScreenViewOptions } from '../../common/view/CommonScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { AlignBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MassesControlPanel from '../../common/view/MassesControlPanel.js';


type IntroScreenViewOptions = CommonScreenView;

class IntroScreenView extends CommonScreenView {
  private massesControlPanel: MassesControlPanel;
  
  constructor( model: IntroModel, tandem: Tandem ) {
    const options = optionize<IntroScreenViewOptions, {}, CommonScreenViewOptions>()( {
      tandem: tandem
    } );
    super( model, options );

    // Add the node for the Masses Sliders
    this.massesControlPanel = new MassesControlPanel( model, { fill: 'white' } );

    // Slider that controls the bodies mass
    this.UILayerNode.addChild( new AlignBox( this.massesControlPanel,
      {
     alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'left', yAlign: 'bottom'
    } ) );
  }
}

mySolarSystem.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;