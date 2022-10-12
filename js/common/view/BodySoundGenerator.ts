// Copyright 2022, University of Colorado Boulder

/**
 * Module in charge of controlling the sound of a single body in the simulation.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';

const DEFAULT_OUTPUT_LEVEL = 0.1;

type SelfOptions = EmptySelfOptions;

export type BodySoundGeneratorOptions = SoundClipOptions;

export default class BodySoundGenerator extends SoundClip {

  public constructor( bodySound: WrappedAudioBuffer, providedOptions?: BodySoundGeneratorOptions ) {
    const options = optionize<BodySoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {
      initialOutputLevel: DEFAULT_OUTPUT_LEVEL,
      loop: true
    }, providedOptions );

    // Determine which sound it's going to play based on the body index
    super( bodySound, options );

  }
}

mySolarSystem.register( 'BodySoundGenerator', BodySoundGenerator );