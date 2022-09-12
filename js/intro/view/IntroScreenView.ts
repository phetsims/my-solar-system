// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the Intro Screen
 * 
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import IntroModel from '../model/IntroModel.js';
import { AlignBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MassesControlPanel from '../../common/view/MassesControlPanel.js';
import IntroLabScreenView from '../../common/view/IntroLabScreenView.js';

class IntroScreenView extends IntroLabScreenView {
  private massesControlPanel: MassesControlPanel;

  //REVIEW: Can we provide options to the IntroLabScreenView constructor, and just include the tandem there? So we don't
  //REVIEW: have to combine the tandem and options here?
  public constructor( model: IntroModel, tandem: Tandem ) {
    super( model, {
      tandem: tandem
    } );

    // Add the node for the Masses Sliders
    this.massesControlPanel = new MassesControlPanel( model, { fill: 'white' } );

    // Masses Align Box
    const lowerLeftMassesBox = new AlignBox( this.massesControlPanel,
      {
        margin: MySolarSystemConstants.MARGIN,
        xAlign: 'left',
        yAlign: 'bottom'
      } );

    this.visibleBoundsProperty.link( visibleBounds => {
      lowerLeftMassesBox.alignBounds = visibleBounds;
    } );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( lowerLeftMassesBox );
  }
}

mySolarSystem.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;