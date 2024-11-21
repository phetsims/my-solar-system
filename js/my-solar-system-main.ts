// Copyright 2020-2024, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import SolarSystemCommonConstants from '../../solar-system-common/js/SolarSystemCommonConstants.js';
import soundManager from '../../tambo/js/soundManager.js';
import Tandem from '../../tandem/js/Tandem.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import MySolarSystemStrings from './MySolarSystemStrings.js';

const simOptions: SimOptions = {

  credits: {
    leadDesign: 'Diana L\u00f3pez Tavares, Michael Dubson',
    softwareDevelopment: 'Agust\u00edn Vallejo, Jonathan Olson',
    team: 'Chris Malley (PixelZoom, Inc.), Emily B. Moore, Sola Olateju, Kathy Perkins, Ariel Paul, Amy Rouinfar',
    qualityAssurance: 'Jaron Droder, Clifford Hardin, Emily Miller, Nancy Salpepi, Martin Veillette, Kathryn Woessner',
    graphicArts: '',
    soundDesign: 'Ashton Morris',
    thanks: ''
  },

  preferencesModel: new PreferencesModel( {
    visualOptions: {
      supportsProjectorMode: true
    }
  } ),

  phetioDesigned: true
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {

  // Attach sim specific sound players.
  soundManager.addSoundGenerator( SolarSystemCommonConstants.GRAB_SOUND_PLAYER );
  soundManager.addSoundGenerator( SolarSystemCommonConstants.RELEASE_SOUND_PLAYER );

  const sim = new Sim( MySolarSystemStrings[ 'my-solar-system' ].titleStringProperty, [
    new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
  ], simOptions );
  sim.start();
} );