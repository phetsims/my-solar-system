// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 * 
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import IntroModel from '../model/IntroModel.js';
import CommonScreenView from '../../common/view/CommonScreenView.js';
import { AlignBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MassesControlPanel from '../../common/view/MassesControlPanel.js';

class IntroScreenView extends CommonScreenView {
  private massesControlPanel: MassesControlPanel;
  
  public constructor( model: IntroModel, tandem: Tandem ) {
    super( model, {
      tandem: tandem
    } );

    // Add the node for the Masses Sliders
    this.massesControlPanel = new MassesControlPanel( model, { fill: 'white' } );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( new AlignBox( this.massesControlPanel,
      {
     alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'left', yAlign: 'bottom'
    } ) );
  }
}

mySolarSystem.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;