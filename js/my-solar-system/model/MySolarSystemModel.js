// Copyright 2020, University of Colorado Boulder

/**
 * @author Jonathan Olson
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from './Body.js';

class MySolarSystemModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    //TODO

    // @public {Body}
    this.body = new Body();
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );
export default MySolarSystemModel;