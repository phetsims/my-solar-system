// Copyright 2020-2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import mySolarSystem from './mySolarSystem.js';

type StringsType = {
  'my-solar-system': {
    'title': string;
    'titleStringProperty': LinkableProperty<string>;
  };
  'screen': {
    'intro': string;
    'introStringProperty': LinkableProperty<string>;
    'lab': string;
    'labStringProperty': LinkableProperty<string>;
  };
  'centerOfMass': string;
  'centerOfMassStringProperty': LinkableProperty<string>;
  'followCenterOfMass': string;
  'followCenterOfMassStringProperty': LinkableProperty<string>;
  'returnBodies': string;
  'returnBodiesStringProperty': LinkableProperty<string>;
  'path': string;
  'pathStringProperty': LinkableProperty<string>;
  'dataPanel': {
    'X': string;
    'XStringProperty': LinkableProperty<string>;
    'Y': string;
    'YStringProperty': LinkableProperty<string>;
    'Vx': string;
    'VxStringProperty': LinkableProperty<string>;
    'Vy': string;
    'VyStringProperty': LinkableProperty<string>;
    'mass': string;
    'massStringProperty': LinkableProperty<string>;
    'velocity': string;
    'velocityStringProperty': LinkableProperty<string>;
    'position': string;
    'positionStringProperty': LinkableProperty<string>;
    'bodies': string;
    'bodiesStringProperty': LinkableProperty<string>;
    'moreData': string;
    'moreDataStringProperty': LinkableProperty<string>;
  };
  'mass': string;
  'massStringProperty': LinkableProperty<string>;
  'mode': {
    'sunAndPlanet': string;
    'sunAndPlanetStringProperty': LinkableProperty<string>;
    'sunPlanetAndMoon': string;
    'sunPlanetAndMoonStringProperty': LinkableProperty<string>;
    'sunPlanetAndComet': string;
    'sunPlanetAndCometStringProperty': LinkableProperty<string>;
    'trojanAsteroids': string;
    'trojanAsteroidsStringProperty': LinkableProperty<string>;
    'ellipses': string;
    'ellipsesStringProperty': LinkableProperty<string>;
    'hyperbolic': string;
    'hyperbolicStringProperty': LinkableProperty<string>;
    'slingshot': string;
    'slingshotStringProperty': LinkableProperty<string>;
    'doubleSlingshot': string;
    'doubleSlingshotStringProperty': LinkableProperty<string>;
    'binaryStarPlanet': string;
    'binaryStarPlanetStringProperty': LinkableProperty<string>;
    'fourStarBallet': string;
    'fourStarBalletStringProperty': LinkableProperty<string>;
    'doubleDouble': string;
    'doubleDoubleStringProperty': LinkableProperty<string>;
    'custom': string;
    'customStringProperty': LinkableProperty<string>;
  };
  'units': {
    'kg': string;
    'kgStringProperty': LinkableProperty<string>;
  };
  'unitsInfo': {
    'title': string;
    'titleStringProperty': LinkableProperty<string>;
    'content': string;
    'contentStringProperty': LinkableProperty<string>;
    'content2': string;
    'content2StringProperty': LinkableProperty<string>;
    'content3': string;
    'content3StringProperty': LinkableProperty<string>;
  };
  'pattern': {
    'labelParenthesesUnits': string;
    'labelParenthesesUnitsStringProperty': LinkableProperty<string>;
    'range': string;
    'rangeStringProperty': LinkableProperty<string>;
  };
  'a11y': {
    'moreData': string;
    'moreDataStringProperty': LinkableProperty<string>;
    'info': string;
    'infoStringProperty': LinkableProperty<string>;
    'numberOfBodies': string;
    'numberOfBodiesStringProperty': LinkableProperty<string>;
    'simDescription': string;
    'simDescriptionStringProperty': LinkableProperty<string>;
    'introScreen': {
      'screenSummary': {
        'playAreaDescription': string;
        'playAreaDescriptionStringProperty': LinkableProperty<string>;
        'controlAreaDescription': string;
        'controlAreaDescriptionStringProperty': LinkableProperty<string>;
      }
    };
    'labScreen': {
      'screenSummary': {
        'playAreaDescription': string;
        'playAreaDescriptionStringProperty': LinkableProperty<string>;
        'controlAreaDescription': string;
        'controlAreaDescriptionStringProperty': LinkableProperty<string>;
      };
      'modeSelector': string;
      'modeSelectorStringProperty': LinkableProperty<string>;
    }
  }
};

const MySolarSystemStrings = getStringModule( 'MY_SOLAR_SYSTEM' ) as StringsType;

mySolarSystem.register( 'MySolarSystemStrings', MySolarSystemStrings );

export default MySolarSystemStrings;
