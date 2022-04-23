// Copyright 2020-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Jonathan Olson
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import MySolarSystemScreen from './my-solar-system/MySolarSystemScreen.js';
import mySolarSystemStrings from './mySolarSystemStrings.js';

const mySolarSystemTitleString = mySolarSystemStrings[ 'my-solar-system' ].title;

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
  }
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( mySolarSystemTitleString, [
    new MySolarSystemScreen( Tandem.ROOT.createTandem( 'mySolarSystemScreen' ) )
  ], simOptions );
  sim.start();
} );