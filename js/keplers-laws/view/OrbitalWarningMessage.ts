// Copyright 2023, University of Colorado Boulder

/**
 * A simple warning that appears when the user tries to make a forbidden orbit.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import OrbitTypes from '../model/OrbitTypes.js';

export default class OrbitalWarningMessage extends Node {

  public constructor( model: KeplersLawsModel, modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2> ) {
    const options = {
      visibleProperty: DerivedProperty.not( model.engine.allowedOrbitProperty ),
      center: modelViewTransformProperty.value.modelToViewPosition( new Vector2( 0, -50 ) )
    };

    let message = '';
    const warningText = new RichText( message, MySolarSystemConstants.TITLE_OPTIONS );

    //TODO: Make these strings translatable
    model.engine.orbitTypeProperty.link( orbitType => {
      message = 'Warning:';
      switch( orbitType ) {
        case OrbitTypes.CRASH_ORBIT:
          message += ' The body will crash into the sun';
          break;
        case OrbitTypes.ESCAPE_ORBIT:
          message += ' The body will escape the system';
          break;
        case OrbitTypes.TOO_BIG:
          message += ' The orbit is too big';
          break;
        default:
          break;
      }

      warningText.setString( message );
      warningText.center = options.center;
    } );

    super( {
      children: [ warningText ],
      ...options
    } );
  }
}

mySolarSystem.register( 'OrbitalWarningMessage', OrbitalWarningMessage );