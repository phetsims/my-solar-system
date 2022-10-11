// Copyright 2022, University of Colorado Boulder

/**
 * Module in charge of controlling the sound of a single body in the simulation.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import Bodies_Brass_C3_mp3 from '../../../sounds/Bodies_Brass_C3_mp3.js';
import Bodies_Strings_e3_mp3 from '../../../sounds/Bodies_Strings_e3_mp3.js';
import Bodies_Flute_g3_mp3 from '../../../sounds/Bodies_Flute_g3_mp3.js';
import Bodies_Organ_b3_mp3 from '../../../sounds/Bodies_Organ_b3_mp3.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

const allSounds = [
  Bodies_Brass_C3_mp3,
  Bodies_Flute_g3_mp3,
  Bodies_Organ_b3_mp3,
  Bodies_Strings_e3_mp3
  ];

const DEFAULT_OUTPUT_LEVEL = 0.1;

type SelfOptions = EmptySelfOptions;

export type BodySoundGeneratorOptions = SoundClipOptions;

export default class BodySoundGenerator extends SoundClip {

  public constructor( bodyIndex: number, providedOptions?: BodySoundGeneratorOptions ) {
    const options = optionize<BodySoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL
    }, providedOptions );

    // Determine which sound it's going to play based on the body index
    super( allSounds[ bodyIndex ], options );

  }
}

mySolarSystem.register( 'BodySoundGenerator', BodySoundGenerator );