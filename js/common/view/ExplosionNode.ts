// Copyright 2022, University of Colorado Boulder
/**
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import BodyNode from './BodyNode.js';

export default class ExplosionNode extends Path {

  public constructor( providedOptions?: PathOptions ) {

    const options = combineOptions<PathOptions>( {
      fill: MySolarSystemColors.explosionColorProperty
    }, providedOptions );

    const radius = 40;
    const numSegments = 14;

    const shape = new Shape();
    shape.moveTo( 0, 0 );
    for ( let i = 0; i < numSegments + 1; i++ ) {
      shape.lineToPoint( Vector2.createPolar( ( i % 2 === 0 ) ? radius * 2 : radius, i * Math.PI * 2 / numSegments ) );
    }
    shape.close();

    super( shape, options );
  }

  public static explode( node: BodyNode ): void {

    const explosionPath = new ExplosionNode( {
      center: node.translation
    } );

    node.parents[ 0 ].addChild( explosionPath );

    const startingRadius = 0.1;
    const maximumRadius = 1;

    const scaleProperty = new NumberProperty( startingRadius );
    scaleProperty.link( scale => explosionPath.setScaleMagnitude( scale ) );

    const duration = 0.16;
    const firstAnimation = new Animation( {
      property: scaleProperty,
      to: maximumRadius,
      duration: duration,
      easing: Easing.QUADRATIC_OUT
    } );
    const secondAnimation = new Animation( {
      property: scaleProperty,
      to: startingRadius,
      duration: duration,
      easing: Easing.QUADRATIC_IN
    } );

    // firstAnimation.finishEmitter.addListener( () => { node.detach(); } );
    firstAnimation.then( secondAnimation );
    firstAnimation.start();
    secondAnimation.finishEmitter.addListener( () => {
      explosionPath.detach();
    } );
  }
}

mySolarSystem.register( 'ExplosionNode', ExplosionNode );