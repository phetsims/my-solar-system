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
import Bodies_Brass_C3_mp3 from '../../../sounds/Bodies_Brass_C3_mp3.js';
import Bodies_Strings_e3_mp3 from '../../../sounds/Bodies_Strings_e3_mp3.js';
import Bodies_Flute_g3_mp3 from '../../../sounds/Bodies_Flute_g3_mp3.js';
import Bodies_Organ_b3_mp3 from '../../../sounds/Bodies_Organ_b3_mp3.js';
import Bodies_Strings_e3_v2_mp3 from '../../../sounds/Bodies_Strings_e3_v2_mp3.js';
import Bodies_Woodwinds_e3_mp3 from '../../../sounds/Bodies_Woodwinds_e3_mp3.js';

const allSounds = [
  Bodies_Brass_C3_mp3,
  Bodies_Woodwinds_e3_mp3,
  Bodies_Strings_e3_v2_mp3,
  Bodies_Flute_g3_mp3,
  Bodies_Strings_e3_mp3,
  Bodies_Organ_b3_mp3
];

export type BodySoundsManagerOptions = {
  tandem?: Tandem;
};

export default class BodySoundManager {
  private readonly model: CommonModel;
  public readonly bodySoundGenerators: BodySoundGenerator[];

  public constructor( model: CommonModel, providedOptions?: BodySoundsManagerOptions ) {
    this.model = model;

    // Create the sound generators for the bodies, they are added to the soundManager in the ScreenView
    this.bodySoundGenerators = [
      new BodySoundGenerator( allSounds[ 0 ] ),
      new BodySoundGenerator( allSounds[ 1 ] ),
      new BodySoundGenerator( allSounds[ 2 ] ),
      new BodySoundGenerator( allSounds[ 3 ] )
    ];
  }

  public playSounds(): void {
    for ( let i = 0; i < 4; i++ ) {
      if ( i < this.model.numberOfActiveBodiesProperty.value ) {
        const body = this.model.bodies.get( i );
        this.bodySoundGenerators[ i ].setOutputLevel( body.accelerationProperty.value.magnitude / 8000 );
        // this.bodySoundGenerators[ i ].setOutputLevel(
        //   1 / body.positionProperty.value.magnitude
        // );
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