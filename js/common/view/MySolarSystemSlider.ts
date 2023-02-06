// Copyright 2022-2023, University of Colorado Boulder

/**
 * Universal slider for MySolarSystem
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import HSlider, { HSliderOptions } from '../../../../sun/js/HSlider.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import Mass_Slider_Bass_Pluck_mp3 from '../../../sounds/Mass_Slider_Bass_Pluck_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import MySolarSystemColors from '../MySolarSystemColors.js';

type SelfOptions = EmptySelfOptions;

export type MySolarSystemSliderOptions = SelfOptions & HSliderOptions;

const massSliderSoundClip = new SoundClip( Mass_Slider_Bass_Pluck_mp3 );

soundManager.addSoundGenerator( massSliderSoundClip );

export default class MySolarSystemSlider extends HSlider {
  public constructor( valueProperty: Property<number>, range: Range, providedOptions?: MySolarSystemSliderOptions ) {
    const options = optionize<MySolarSystemSliderOptions, SelfOptions, HSliderOptions>()( {
      trackSize: new Dimension2( 226, 2 ),
      thumbSize: new Dimension2( 15, 25 ),
      thumbTouchAreaYDilation: 2,
      thumbCenterLineStroke: 'black',
      trackFillEnabled: MySolarSystemColors.foregroundProperty,
      trackStroke: MySolarSystemColors.foregroundProperty,
      valueChangeSoundGeneratorOptions: {
        middleMovingUpSoundPlayer: massSliderSoundClip,
        middleMovingDownSoundPlayer: massSliderSoundClip,
        numberOfMiddleThresholds: 10,
        // This mapping function the same as in Greenhouse
        middleMovingUpPlaybackRateMapper: ( value: number ) => 0.5 + ( value - range.min ) / range.getLength(),
        middleMovingDownPlaybackRateMapper: ( value: number ) => 0.4 + ( value - range.min ) / range.getLength()
      }
    }, providedOptions );
    super( valueProperty, range, options );
  }
}

mySolarSystem.register( 'MySolarSystemSlider', MySolarSystemSlider );