// Copyright 2022, University of Colorado Boulder
/**
 * Visual Node for the Elliptical Orbit based on the Orbital Parameters
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { Shape } from '../../../../kite/js/imports.js';
import EllipticalOrbit from '../model/EllipticalOrbit.js';
import { Path } from '../../../../scenery/js/imports.js';
import Body from '../../common/model/Body.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { ReadOnlyProperty } from '../../../../axon/js/ReadOnlyProperty.js';
import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class EllipticalOrbitNode extends Path {
  private orbit: EllipticalOrbit;
  private shapeMultilink: UnknownMultilink;

  constructor( body: Body, modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2> ) {
    super( new Shape(), {
      lineWidth: 3,
      stroke: 'white'
    } );

    this.orbit = new EllipticalOrbit( body );
    this.translation = modelViewTransformProperty.value.modelToViewPosition( Vector2.ZERO );
    const radiusX = body.positionProperty.value.x;
    const radiusY = body.positionProperty.value.x;
    const rotation = 0;
    this.shape = new Shape().ellipse( 0, 0, radiusX, radiusY, rotation );

    this.shapeMultilink = Multilink.multilink(
      [ body.positionProperty, body.velocityProperty, modelViewTransformProperty ],
      ( position, velocity, modelViewTransform ) => {
        this.translation = modelViewTransform.modelToViewPosition( Vector2.ZERO );
        const radiusX = position.x;
        const radiusY = position.x;
        const rotation = 0;
        this.shape = new Shape().ellipse( 0, 0, radiusX, radiusY, rotation );
    } );
  }
}

mySolarSystem.register( 'EllipticalOrbitNode', EllipticalOrbitNode );