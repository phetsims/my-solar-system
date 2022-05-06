// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  //TODO add options that are specific to LabModel here
};

type LabModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class LabModel {

  constructor( providedOptions: LabModelOptions ) {
    //TODO
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

mySolarSystem.register( 'LabModel', LabModel );
export default LabModel;