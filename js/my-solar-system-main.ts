// Copyright 2020-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Jonathan Olson
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import IntroScreen from './intro/IntroScreen.js';
import KeplersLawsScreen from './keplers-laws/KeplersLawsScreen.js';
import LabScreen from './lab/LabScreen.js';
import mySolarSystemStrings from './mySolarSystemStrings.js';

const simOptions: SimOptions = {

  //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
  credits: {
    leadDesign: '',
    softwareDevelopment: '',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  },
  webgl: true
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( mySolarSystemStrings[ 'my-solar-system' ].titleProperty, [
    new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
    new KeplersLawsScreen( Tandem.ROOT.createTandem( 'keplersLawsScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
  ], simOptions );
  sim.start();
} );