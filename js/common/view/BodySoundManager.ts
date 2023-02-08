// Copyright 2022-2023, University of Colorado Boulder

/**
 * Module in charge of controlling the sounds of the bodies in the simulation.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import CommonModel from '../model/CommonModel.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import soundConstants from '../../../../tambo/js/soundConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import Bodies_Brass_C3_mp3 from '../../../sounds/Bodies_Brass_C3_mp3.js';
import Bodies_Flute_g3_mp3 from '../../../sounds/Bodies_Flute_g3_mp3.js';
import Bodies_Strings_e3_v2_mp3 from '../../../sounds/Bodies_Strings_e3_v2_mp3.js';
import Bodies_Woodwinds_e3_mp3 from '../../../sounds/Bodies_Woodwinds_e3_mp3.js';
import Bodies_Collide_Absorb_2_to_1_mp3 from '../../../sounds/Bodies_Collide_Absorb_2_to_1_mp3.js';
import Bodies_Collide_Absorb_3_to_2_mp3 from '../../../sounds/Bodies_Collide_Absorb_3_to_2_mp3.js';
import Bodies_Collide_Absorb_4_to_3_mp3 from '../../../sounds/Bodies_Collide_Absorb_4_to_3_mp3.js';
import Mass_Selection_1_mp3 from '../../../sounds/Mass_Selection_1_mp3.js';
import Mass_Selection_2_mp3 from '../../../sounds/Mass_Selection_2_mp3.js';
import Mass_Selection_3_mp3 from '../../../sounds/Mass_Selection_3_mp3.js';
import Mass_Selection_4_mp3 from '../../../sounds/Mass_Selection_4_mp3.js';
import Metronome_Sound_1_mp3 from '../../../sounds/Metronome_Sound_1_mp3.js';
import Metronome_Sound_2_mp3 from '../../../sounds/Metronome_Sound_2_mp3.js';
import Metronome_Sound_Reverb_1_mp3 from '../../../sounds/Metronome_Sound_Reverb_1_mp3.js';
import Metronome_Sound_Reverb_2_mp3 from '../../../sounds/Metronome_Sound_Reverb_2_mp3.js';

const bodiesSounds = [
  Bodies_Brass_C3_mp3,
  Bodies_Woodwinds_e3_mp3,
  Bodies_Strings_e3_v2_mp3,
  Bodies_Flute_g3_mp3
];

const bodyNumberSounds = [
  Mass_Selection_1_mp3,
  Mass_Selection_2_mp3,
  Mass_Selection_3_mp3,
  Mass_Selection_4_mp3
];

const collisionSounds = [
  Bodies_Collide_Absorb_2_to_1_mp3,
  Bodies_Collide_Absorb_3_to_2_mp3,
  Bodies_Collide_Absorb_4_to_3_mp3
];

const metronomeSounds = [
  Metronome_Sound_1_mp3,
  Metronome_Sound_2_mp3,
  Metronome_Sound_Reverb_1_mp3,
  Metronome_Sound_Reverb_2_mp3
];

// Other scales available to play around with!
const METRONOME = [ 7, 0, 0, 0, 0, 0 ]; // METRONOME
// const METRONOME = [ 4, 2, 0, 2, 4, 4 ]; // ADDITIONAL
// const METRONOME = [ 0, 2, 4, 5, 7, 9 ]; // SCALE
// const METRONOME = [ 0, 2, 4, 7, 9, 12 ]; // PENTATONIC_SCALE
// const METRONOME = [ 0, 3, 5, 6, 7, 10 ]; // BLUES_SCALE

export default class BodySoundManager {
  private readonly model: CommonModel;
  public readonly bodySoundClips: SoundClip[];
  private readonly bodyNumberSoundClips: SoundClip[];
  private readonly collisionSoundClips: SoundClip[];
  private readonly metronomeSoundClips: SoundClip[];

  public constructor( model: CommonModel ) {
    this.model = model;

    const DEFAULT_OUTPUT_LEVEL = 0.1;

    // Create the sound generators for the bodies, they are added to the soundManager in the ScreenView
    this.bodySoundClips = bodiesSounds.map( sound => new SoundClip( sound, {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL,
      loop: true
    } ) );

    this.bodyNumberSoundClips = bodyNumberSounds.map( sound => new SoundClip( sound, {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL
    } ) );

    this.collisionSoundClips = collisionSounds.map( sound => new SoundClip( sound, {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL
    } ) );

    this.metronomeSoundClips = metronomeSounds.map( sound => new SoundClip( sound, {
      rateChangesAffectPlayingSounds: false
    } ) );

    // BodySoundClips are added in the ScreenView because they have an associated view node
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
        this.bodySoundClips[ i ].setOutputLevel( body.accelerationProperty.value.magnitude / 2000 );
        this.bodySoundClips[ i ].play();
      }
      else {
        this.bodySoundClips[ i ].stop();
      }
    }
  }

  public playBodyAddedSound( bodyNumber: number ): void {
    this.bodyNumberSoundClips[ bodyNumber ].play();
  }

  public playBodyRemovedSound( bodyNumber: number ): void {
    this.collisionSoundClips[ bodyNumber ].play();
  }

  /**
   *  This function plays the melody described in METRONOME based on the division index.
   *  Because of how scales work, they are powers of the twelfth root of 2.
   *
   *  The amount of divisions shifts the metronome sound up or down half an octave (1 to 1.5)
   *
   *  And depending on the semi major axis, the sound is small (muted) or big (with reverb)
   */
  public playOrbitalMetronome( i: number, semiMajorAxis: number, divisions: number ): void {
    const smallSound = this.metronomeSoundClips[ 0 ];
    const bigSound = this.metronomeSoundClips[ 2 ];

    const divisionOffset = 1 + divisions / 12;

    smallSound.setPlaybackRate( Math.pow( soundConstants.TWELFTH_ROOT_OF_TWO, METRONOME[ i ] ) * divisionOffset );
    smallSound.setOutputLevel( Utils.clamp( Utils.linear( 0, 500, 1, 0, semiMajorAxis ), 0, 1 ) );
    smallSound.play();


    bigSound.setPlaybackRate( Math.pow( soundConstants.TWELFTH_ROOT_OF_TWO, METRONOME[ i ] ) * divisionOffset );
    bigSound.setOutputLevel( Utils.clamp( Utils.linear( 100, 500, 0, 1, semiMajorAxis ), 0, 1 ) );
    bigSound.play();
  }

  public stop(): void {
    this.bodySoundClips.forEach( sound => sound.stop() );
  }
}


mySolarSystem.register( 'BodySoundManager', BodySoundManager );