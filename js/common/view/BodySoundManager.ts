// Copyright 2022, University of Colorado Boulder

/**
 * Module in charge of controlling the sounds of the bodies in the simulation.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import BodySoundGenerator from './BodySoundGenerator.js';
import CommonModel from '../model/CommonModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import soundManager from '../../../../tambo/js/soundManager.js';

export type BodySoundsManagerOptions = {
  tandem?: Tandem;
};

export default class BodySoundManager {
  private readonly model: CommonModel;
  private readonly bodySoundGenerators: BodySoundGenerator[];

  public constructor( model: CommonModel, providedOptions?: BodySoundsManagerOptions ) {
    this.model = model;

    this.bodySoundGenerators = [
      new BodySoundGenerator( 0 ),
      new BodySoundGenerator( 1 ),
      new BodySoundGenerator( 2 ),
      new BodySoundGenerator( 3 )
    ];

    this.bodySoundGenerators.forEach( sound => soundManager.addSoundGenerator( sound ) );
  }

  public playSounds(): void {
    for ( let i = 0; i < 4; i++ ) {
      if ( i < this.model.numberOfActiveBodiesProperty.value ) {
        const body = this.model.bodies.get( i );
        this.bodySoundGenerators[ i ].setOutputLevel( body.accelerationProperty.value.magnitude / 5000 );
        this.bodySoundGenerators[ i ].play();
      }
      else {
        this.bodySoundGenerators[ i ].stop();
      }
    }
  }

  public stop(): void {
    this.bodySoundGenerators.forEach( sound => sound.stop() );
  }
}

mySolarSystem.register( 'BodySoundManager', BodySoundManager );