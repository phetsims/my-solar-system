// Copyright 2020-2022, University of Colorado Boulder

/**
 * Logic for Center of Mass class
 * 
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import mySolarSystem from '../../mySolarSystem.js';

export default class CenterOfMass {
  positionProperty: Property<Vector2>;
  visibleProperty: Property<boolean>;

  constructor() {
    this.positionProperty = new Property<Vector2>( Vector2.ZERO );
    this.visibleProperty = new Property<boolean>( false );
  }
}

mySolarSystem.register( 'CenterOfMass', CenterOfMass );