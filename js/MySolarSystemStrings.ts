// Copyright 2020-2025, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
import mySolarSystem from './mySolarSystem.js';

type StringsType = {
  'my-solar-system': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'introStringProperty': LocalizedStringProperty;
    'labStringProperty': LocalizedStringProperty;
  };
  'centerOfMassStringProperty': LocalizedStringProperty;
  'followCenterOfMassStringProperty': LocalizedStringProperty;
  'returnBodiesStringProperty': LocalizedStringProperty;
  'dataPanel': {
    'XStringProperty': LocalizedStringProperty;
    'YStringProperty': LocalizedStringProperty;
    'VxStringProperty': LocalizedStringProperty;
    'VyStringProperty': LocalizedStringProperty;
    'massStringProperty': LocalizedStringProperty;
    'velocityStringProperty': LocalizedStringProperty;
    'positionStringProperty': LocalizedStringProperty;
    'bodiesStringProperty': LocalizedStringProperty;
    'moreDataStringProperty': LocalizedStringProperty;
  };
  'massStringProperty': LocalizedStringProperty;
  'mode': {
    'sunAndPlanetStringProperty': LocalizedStringProperty;
    'sunPlanetAndMoonStringProperty': LocalizedStringProperty;
    'sunPlanetAndCometStringProperty': LocalizedStringProperty;
    'trojanAsteroidsStringProperty': LocalizedStringProperty;
    'ellipsesStringProperty': LocalizedStringProperty;
    'hyperbolicStringProperty': LocalizedStringProperty;
    'slingshotStringProperty': LocalizedStringProperty;
    'doubleSlingshotStringProperty': LocalizedStringProperty;
    'binaryStarPlanetStringProperty': LocalizedStringProperty;
    'fourStarBalletStringProperty': LocalizedStringProperty;
    'doubleDoubleStringProperty': LocalizedStringProperty;
    'customStringProperty': LocalizedStringProperty;
    'orbitalSystem1StringProperty': LocalizedStringProperty;
    'orbitalSystem2StringProperty': LocalizedStringProperty;
    'orbitalSystem3StringProperty': LocalizedStringProperty;
    'orbitalSystem4StringProperty': LocalizedStringProperty;
  };
  'units': {
    'kgStringProperty': LocalizedStringProperty;
  };
  'unitsInfo': {
    'titleStringProperty': LocalizedStringProperty;
    'contentStringProperty': LocalizedStringProperty;
    'content2StringProperty': LocalizedStringProperty;
    'content3StringProperty': LocalizedStringProperty;
  };
  'pattern': {
    'labelParenthesesUnitsStringProperty': LocalizedStringProperty;
    'rangeStringProperty': LocalizedStringProperty;
  };
  'keyboardHelpDialog': {
    'chooseAnOrbitalSystemStringProperty': LocalizedStringProperty;
    'orbitalSystemsStringProperty': LocalizedStringProperty;
    'orbitalSystemStringProperty': LocalizedStringProperty;
  };
  'a11y': {
    'moreDataStringProperty': LocalizedStringProperty;
    'infoStringProperty': LocalizedStringProperty;
    'numberOfBodiesStringProperty': LocalizedStringProperty;
    'introScreen': {
      'screenSummary': {
        'playAreaDescriptionStringProperty': LocalizedStringProperty;
        'controlAreaDescriptionStringProperty': LocalizedStringProperty;
      }
    };
    'labScreen': {
      'screenSummary': {
        'playAreaDescriptionStringProperty': LocalizedStringProperty;
        'controlAreaDescriptionStringProperty': LocalizedStringProperty;
      };
      'orbitalSystemSelectorStringProperty': LocalizedStringProperty;
    }
  }
};

const MySolarSystemStrings = getStringModule( 'MY_SOLAR_SYSTEM' ) as StringsType;

mySolarSystem.register( 'MySolarSystemStrings', MySolarSystemStrings );

export default MySolarSystemStrings;
