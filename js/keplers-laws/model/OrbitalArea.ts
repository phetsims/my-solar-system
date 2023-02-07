// Copyright 2022-2023, University of Colorado Boulder

/**
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

export default class OrbitalArea {
  // TODO: Document what all this means
  public dotPosition = Vector2.ZERO;
  public startPosition = Vector2.ZERO;
  public endPosition = Vector2.ZERO;
  public completion = 0;
  public insideProperty = new BooleanProperty( false );
  public alreadyEntered = false;
  public active = false;
  public resetted = true;

  public constructor() {
    // noop
  }

  public reset(): void {
    this.dotPosition = Vector2.ZERO;
    this.startPosition = Vector2.ZERO;
    this.endPosition = Vector2.ZERO;
    this.completion = 0;
    this.insideProperty.reset();
    this.alreadyEntered = false;
    this.active = false;
    this.resetted = true;
  }
}

mySolarSystem.register( 'OrbitalArea', OrbitalArea );