// Copyright 2020-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import mySolarSystem from './mySolarSystem.js';

type StringsType = {
  'my-solar-system': {
    'title': string;
  };
  'gravityForce': string;
  'grid': string;
  'mass': string;
  'measuringTape': string;
  'path': string;
  'velocity': string;
  'orbital': string;
  'axis': string;
  'apoapsis': string;
  'periapsis': string;
  'clear': string;
  'values': string;
  'area': {
    'title': string;
    'dots': string;
    'sweptArea': string;
    'areaGraph': string;
    'periodDivision': string;
  };
  'dataPanel': {
    'X': string;
    'Y': string;
    'Vx': string;
    'Vy': string;
    'Mass': string;
    'Velocity': string;
    'Position': string;
    'bodies': string;
    'moreData': string;
  };
  'graph': {
    'title': string;
    'a': string;
    't': string;
  }
};

const mySolarSystemStrings = getStringModule( 'MY_SOLAR_SYSTEM' ) as StringsType;

mySolarSystem.register( 'mySolarSystemStrings', mySolarSystemStrings );

export default mySolarSystemStrings;
