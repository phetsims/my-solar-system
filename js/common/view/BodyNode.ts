// Copyright 2021-2022, University of Colorado Boulder

/**
 * PLACE DOCUMENTATION HERE ABOUT THE GENERAL TYPE
 *
 * @author Agustín Vallejo
 */

import { Node } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class BodyNode extends Node {
  body: Body
  positionListener: ( position:Vector2 ) => void

  constructor( body: Body, modelViewTransform: ModelViewTransform2 ) {
    super();
    this.body = body;

    this.addChild( new ShadedSphereNode( body.massProperty.value / 2, { mainColor: 'yellow' } ) ); // Create white circles with R=mass

    this.positionListener = position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    };
    this.body.positionProperty.link( this.positionListener );
  }

  override dispose(): void {
    this.body.positionProperty.unlink( this.positionListener );

    super.dispose();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );
export default BodyNode;