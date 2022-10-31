// Copyright 2022, University of Colorado Boulder

/**
 * Module in charge of controlling the sounds of the bodies in the simulation.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import CommonModel from '../model/CommonModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';

// Bodies sounds
import Bodies_Brass_C3_mp3 from '../../../sounds/Bodies_Brass_C3_mp3.js';
import Bodies_Strings_e3_mp3 from '../../../sounds/Bodies_Strings_e3_mp3.js';
import Bodies_Flute_g3_mp3 from '../../../sounds/Bodies_Flute_g3_mp3.js';
import Bodies_Organ_b3_mp3 from '../../../sounds/Bodies_Organ_b3_mp3.js';
import Bodies_Strings_e3_v2_mp3 from '../../../sounds/Bodies_Strings_e3_v2_mp3.js';
import Bodies_Woodwinds_e3_mp3 from '../../../sounds/Bodies_Woodwinds_e3_mp3.js';

// Bodies collision sounds
import Bodies_Collide_Absorb_2_to_1_mp3 from '../../../sounds/Bodies_Collide_Absorb_2_to_1_mp3.js';
import Bodies_Collide_Absorb_3_to_2_mp3 from '../../../sounds/Bodies_Collide_Absorb_3_to_2_mp3.js';
import Bodies_Collide_Absorb_4_to_3_mp3 from '../../../sounds/Bodies_Collide_Absorb_4_to_3_mp3.js';

// Body selection sounds
import Mass_Selection_1_mp3 from '../../../sounds/Mass_Selection_1_mp3.js';
import Mass_Selection_2_mp3 from '../../../sounds/Mass_Selection_2_mp3.js';
import Mass_Selection_3_mp3 from '../../../sounds/Mass_Selection_3_mp3.js';
import Mass_Selection_4_mp3 from '../../../sounds/Mass_Selection_4_mp3.js';

// Mass slider sounds
// import Mass_Slider_Rubber_Band_mp3 from '../../../sounds/Mass_Slider_Rubber_Band_mp3.js';
// import Mass_Slider_Bass_Pluck_mp3 from '../../../sounds/Mass_Slider_Bass_Pluck_mp3.js';


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
  public readonly bodySoundGenerators: SoundClip[];
  public readonly bodyNumberSoundClips: SoundClip[];
  public readonly collisionSoundClips: SoundClip[];

  public constructor( model: CommonModel, providedOptions?: BodySoundsManagerOptions ) {
    this.model = model;

    const DEFAULT_OUTPUT_LEVEL = 0.1;

    const bodySoundOptions: SoundClipOptions = {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL,
      loop: true
    };

    const bodyNumberSoundOptions: SoundClipOptions = {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL
    };

    const collisionSoundOptions: SoundClipOptions = {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL
    };

    // Create the sound generators for the bodies, they are added to the soundManager in the ScreenView
    this.bodySoundGenerators = [
      new SoundClip( allSounds[ 0 ], bodySoundOptions ),
      new SoundClip( allSounds[ 1 ], bodySoundOptions ),
      new SoundClip( allSounds[ 2 ], bodySoundOptions ),
      new SoundClip( allSounds[ 3 ], bodySoundOptions )
    ];

    this.bodyNumberSoundClips = [
      new SoundClip( Mass_Selection_1_mp3, bodyNumberSoundOptions ),
      new SoundClip( Mass_Selection_2_mp3, bodyNumberSoundOptions ),
      new SoundClip( Mass_Selection_3_mp3, bodyNumberSoundOptions ),
      new SoundClip( Mass_Selection_4_mp3, bodyNumberSoundOptions )
    ];

    this.collisionSoundClips = [
      new SoundClip( Bodies_Collide_Absorb_2_to_1_mp3, collisionSoundOptions ),
      new SoundClip( Bodies_Collide_Absorb_3_to_2_mp3, collisionSoundOptions ),
      new SoundClip( Bodies_Collide_Absorb_4_to_3_mp3, collisionSoundOptions )
    ];

    this.bodyNumberSoundClips.forEach( sound => soundManager.addSoundGenerator( sound ) );
    this.collisionSoundClips.forEach( sound => soundManager.addSoundGenerator( sound ) );
  }

  public playSounds(): void {
    for ( let i = 0; i < 4; i++ ) {
      if ( i < this.model.numberOfActiveBodiesProperty.value ) {
        const body = this.model.bodies.get( i );
        this.bodySoundGenerators[ i ].setOutputLevel( body.accelerationProperty.value.magnitude / 2000 );
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

  public playBodyAddedSound( bodyNumber: number ): void {
    this.bodyNumberSoundClips[ bodyNumber ].play();
  }

  public playBodyRemovedSound( bodyNumber: number ): void {
    this.collisionSoundClips[ bodyNumber ].play();
  }

  public stop(): void {
    this.bodySoundGenerators.forEach( sound => sound.stop() );
  }
}

mySolarSystem.register( 'BodySoundManager', BodySoundManager );