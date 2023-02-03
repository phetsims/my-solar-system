// Copyright 2022-2023, University of Colorado Boulder

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
import soundConstants from '../../../../tambo/js/soundConstants.js';
import Utils from '../../../../dot/js/Utils.js';

//REVIEW: This organization around imports might get messed up by automatic IDE handling, careful!
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

// Metronome sound
import Metronome_Sound_1_mp3 from '../../../sounds/Metronome_Sound_1_mp3.js';
import Metronome_Sound_2_mp3 from '../../../sounds/Metronome_Sound_2_mp3.js';
import Metronome_Sound_Reverb_1_mp3 from '../../../sounds/Metronome_Sound_Reverb_1_mp3.js';
import Metronome_Sound_Reverb_2_mp3 from '../../../sounds/Metronome_Sound_Reverb_2_mp3.js';


const allSounds = [
  Bodies_Brass_C3_mp3,
  Bodies_Woodwinds_e3_mp3,
  Bodies_Strings_e3_v2_mp3,
  Bodies_Flute_g3_mp3,

  //REVIEW: Why are these elements of allSounds not used? Can this be cleaned up?
  Bodies_Strings_e3_mp3,
  Bodies_Organ_b3_mp3
];

//REVIEW: Has this been decided on?
const METRONOME = [ 7, 0, 0, 0, 0, 0 ]; // METRONOME
// const METRONOME = [ 4, 2, 0, 2, 4, 4 ]; // ADDITIONAL
// const METRONOME = [ 0, 2, 4, 5, 7, 9 ]; // SCALE
// const METRONOME = [ 0, 2, 4, 7, 9, 12 ]; // PENTATONIC_SCALE
// const METRONOME = [ 0, 3, 5, 6, 7, 10 ]; // BLUES_SCALE

//REVIEW: providedOptions never used, so presumably this can go away. Do we need a tandem?
export type BodySoundsManagerOptions = {
  tandem?: Tandem;
};

export default class BodySoundManager {
  private readonly model: CommonModel;
  public readonly bodySoundGenerators: SoundClip[];
  public readonly bodyNumberSoundClips: SoundClip[]; //REVIEW: Why public?
  public readonly collisionSoundClips: SoundClip[]; //REVIEW: Why public?
  public readonly metronomeSoundClips: SoundClip[]; //REVIEW: Why public?

  //REVIEW: providedOptions never used!!!
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

    const metronomeSoundOptions = { rateChangesAffectPlayingSounds: false };

    // Create the sound generators for the bodies, they are added to the soundManager in the ScreenView
    this.bodySoundGenerators = [
      //REVIEW: If allSounds is cleaned up, this can be simplified to something like
      //REVIEW: this.bodySoundGenerators = allSounds.map( sound => new SoundClip( sound, bodySoundOptions ) );
      //REVIEW: THEN, you would also inline the options so it's a bit more concise.
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

    this.metronomeSoundClips = [
      new SoundClip( Metronome_Sound_1_mp3, metronomeSoundOptions ),
      new SoundClip( Metronome_Sound_2_mp3, metronomeSoundOptions ),
      new SoundClip( Metronome_Sound_Reverb_1_mp3, metronomeSoundOptions ),
      new SoundClip( Metronome_Sound_Reverb_2_mp3, metronomeSoundOptions )
    ];

    this.bodyNumberSoundClips.forEach( sound => soundManager.addSoundGenerator( sound ) );
    this.collisionSoundClips.forEach( sound => soundManager.addSoundGenerator( sound ) );
    this.metronomeSoundClips.forEach( sound => soundManager.addSoundGenerator( sound ) );
  }

  public playSounds(): void {
    //REVIEW: This makes a lot of assumptions (that bodies are always in the same order). Is that OK to do?
    //REVIEW: Why not loop through availableBodies and check if they are each active?
    //REVIEW: On further thought, why don't we tag the sound generators ON the bodies themselves? Then we can just loop
    //REVIEW: through the bodies and play the sound generators that are active.
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

  public playOrbitalMetronome( i: number, semimajorAxis: number, divisions: number ): void {
    const smallSound = this.metronomeSoundClips[ 0 ];
    const bigSound = this.metronomeSoundClips[ 2 ];
    const divisionOffset = 1 + divisions / 12;

    //REVIEW: some documentation here would be helpful

    smallSound.setPlaybackRate( Math.pow( soundConstants.TWELFTH_ROOT_OF_TWO, METRONOME[ i ] ) * divisionOffset );
    smallSound.setOutputLevel( Utils.clamp( Utils.linear( 0, 500, 1, 0, semimajorAxis ), 0, 1 ) );
    smallSound.play();


    bigSound.setPlaybackRate( Math.pow( soundConstants.TWELFTH_ROOT_OF_TWO, METRONOME[ i ] ) * divisionOffset );
    bigSound.setOutputLevel( Utils.clamp( Utils.linear( 100, 500, 0, 1, semimajorAxis ), 0, 1 ) );
    bigSound.play();
  }

  public stop(): void {
    this.bodySoundGenerators.forEach( sound => sound.stop() );
  }
}


mySolarSystem.register( 'BodySoundManager', BodySoundManager );