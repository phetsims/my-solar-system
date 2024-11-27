// Copyright 2022-2023, University of Colorado Boulder

/**
 *
 * Definition of the Lab Screen Icon: A sun with two elliptical orbits around it
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import { Shape } from '../../../../kite/js/imports.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import mySolarSystem from '../../mySolarSystem.js';

export default class IntroScreenIcon extends ScreenIcon {

  public constructor() {

    // Ellipses parameters
    // focal point function with a and b
    const focalPoint = ( a: number, b: number ) => Math.sqrt( a * a - b * b );

    // Big ellipse
    const bigEllipseSemiMajorAxis = 20;
    const bigEllipseSemiMinorAxis = 19;
    const bigEllipseFocalPoint = focalPoint( bigEllipseSemiMajorAxis, bigEllipseSemiMinorAxis );
    const bigEllipseCenterX = -bigEllipseFocalPoint;

    // Small ellipse
    const ellipsesMultiplier = 0.35;
    const smallEllipseSemiMajorAxis = bigEllipseSemiMajorAxis * ellipsesMultiplier;
    const smallEllipseSemiMinorAxis = bigEllipseSemiMinorAxis * ellipsesMultiplier;
    const smallEllipseFocalPoint = focalPoint( smallEllipseSemiMajorAxis, smallEllipseSemiMinorAxis );
    const smallEllipseCenterX = smallEllipseFocalPoint;

    const iconNode = new Node( {
      children: [

        // yellow orbit
        new Path( new Shape().ellipse( 0, 0, smallEllipseSemiMajorAxis, smallEllipseSemiMinorAxis, 0 ), {
          stroke: MySolarSystemColors.body1ColorProperty,
          lineWidth: 0.5,
          x: smallEllipseCenterX
        } ),

        // a segment of the magenta orbit
        new Path( new Shape().ellipticalArc( 0, 0, bigEllipseSemiMajorAxis, bigEllipseSemiMinorAxis, 0, -Math.PI / 6, Math.PI / 6 ), {
          stroke: MySolarSystemColors.body2ColorProperty,
          lineWidth: 0.5,
          x: bigEllipseCenterX
        } ),

        // Sun (yellow body)
        new ShadedSphereNode( 6, {
          mainColor: MySolarSystemColors.body1ColorProperty,
          x: ( smallEllipseFocalPoint - smallEllipseSemiMajorAxis )
        } ),

        // magenta body
        new ShadedSphereNode( 3, {
          mainColor: MySolarSystemColors.body2ColorProperty,
          x: bigEllipseSemiMajorAxis - bigEllipseFocalPoint
        } ),

        // red 'X'
        new XNode( {
          scale: 0.1,
          fill: 'red',
          stroke: 'white',
          center: Vector2.ZERO
        } )
      ]
    } );

    super( iconNode, {
      fill: SolarSystemCommonColors.backgroundProperty
    } );
  }
}

mySolarSystem.register( 'IntroScreenIcon', IntroScreenIcon );