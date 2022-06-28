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
      stroke: 'fuchsia'
    } );

    this.orbit = new EllipticalOrbit( body );

    this.shapeMultilink = Multilink.multilink(
      [ body.positionProperty, body.velocityProperty, modelViewTransformProperty ],
      ( position, velocity, modelViewTransform ) => {
        this.orbit.update();
        this.lineDash = this.orbit.allowedOrbit ? [ 0 ] : [ 5 ];

        const scale = modelViewTransform.modelToViewDeltaX( 1 );
        const a = this.orbit.a;
        const e = this.orbit.e;
        const c = e * a;
        const center = new Vector2( -c, 0 );
        const radiusX = scale * a;
        const radiusY = scale * Math.sqrt( a * a - c * c );

        this.translation = modelViewTransform.modelToViewPosition( center );
        this.rotation = 0;
        this.rotateAround( this.translation.add( center.times( -scale ) ), -this.orbit.w );
        this.shape = new Shape().ellipse( 0, 0, radiusX, radiusY, 0 );
    } );
  }
}

mySolarSystem.register( 'EllipticalOrbitNode', EllipticalOrbitNode );