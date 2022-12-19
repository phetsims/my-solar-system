// Copyright 2020-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Jonathan Olson
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import IntroScreen from './intro/IntroScreen.js';
import KeplersLawsScreen from './keplers-laws/KeplersLawsScreen.js';
import LabScreen from './lab/LabScreen.js';
import MySolarSystemStrings from './MySolarSystemStrings.js';

const simOptions: SimOptions = {

  //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
  credits: {
    leadDesign: 'Diana López Tavares',
    softwareDevelopment: 'Agustín Vallejo, Jonathan Olson',
    team: 'Emily B. Moore, Sola Olateju, Kathy Perkins, Ariel Paul, Amy Rouinfar',
    qualityAssurance: 'Jaron Droder, Clifford Hardin, Emily Miller, Nancy Salpepi, Kathryn Woessner',
    graphicArts: '',
    soundDesign: 'Ashton Morris',
    thanks: ''
  },
  webgl: true,

  preferencesModel: new PreferencesModel( {
    visualOptions: {
      supportsProjectorMode: true
    }
  } )
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( MySolarSystemStrings[ 'my-solar-system' ].titleStringProperty, [
    new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) ),
    new KeplersLawsScreen( Tandem.ROOT.createTandem( 'keplersLawsScreen' ) )
  ], simOptions );
  sim.start();
} );