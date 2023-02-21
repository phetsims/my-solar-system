// Copyright 2022, University of Colorado Boulder

/**
 * Screen View for Lab Screen: Where you can play with all the presets and body configurations
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import LabModel from '../model/LabModel.js';
import IntroLabScreenView, { IntroLabScreenViewOptions } from '../../common/view/IntroLabScreenView.js';

export type LabScreenViewOptions = IntroLabScreenViewOptions;

class LabScreenView extends IntroLabScreenView {
  public constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {
    super( model, providedOptions );

    model.bodyAddedEmitter.addListener( () => {
      this.bodySoundManager.playBodyAddedSound( model.bodies.length - 1 );
    } );

    model.bodyRemovedEmitter.addListener( () => {
      this.bodySoundManager.playBodyRemovedSound( model.bodies.length - 1 );
    } );
  }
}

mySolarSystem.register( 'LabScreenView', LabScreenView );
export default LabScreenView;