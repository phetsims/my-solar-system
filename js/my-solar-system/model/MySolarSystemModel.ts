// Copyright 2020-2021, University of Colorado Boulder

/**
 * @author Jonathan Olson
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../../common/model/Body.js';

class MySolarSystemModel {
  body: Body;

  constructor( tandem: Tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    //TODO

    this.body = new Body();
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
  }


  step( dt: number ) {
    //TODO
  }
}

mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );
export default MySolarSystemModel;