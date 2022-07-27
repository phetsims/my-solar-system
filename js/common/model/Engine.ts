// Copyright 2022, University of Colorado Boulder

/**
 * Everything that controls the gravitational interactions between bodies.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Body from './Body.js';

export default abstract class Engine {
  // Array of gravitational interacting bodies
  protected bodies: ObservableArray<Body>;

  protected constructor( bodies: ObservableArray<Body> ) {
    this.bodies = bodies;
  }
  public abstract run( dt: number ): void;
  public abstract update( bodies: ObservableArray<Body> ): void;
  public abstract reset(): void;
}

mySolarSystem.register( 'Engine', Engine );