// Copyright 2022-2023, University of Colorado Boulder

/**
 *
 * Definition of the Lab Screen Icon: A sun with two elliptical orbits around it
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import platform from '../../../../phet-core/js/platform.js';
import Multilink from '../../../../axon/js/Multilink.js';

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

    const node = new Node( {
      clipArea: new Shape().rect( -8, -10, 30, 20 ),
      children: [
        new Path(
          new Shape().ellipse( 0, 0, smallEllipseSemiMajorAxis, smallEllipseSemiMinorAxis, 0 ),
          {
            stroke: SolarSystemCommonColors.firstBodyColorProperty,
            lineWidth: 0.5,
            x: smallEllipseCenterX
          } ),
        new Path(
          new Shape().ellipse( 0, 0, bigEllipseSemiMajorAxis, bigEllipseSemiMinorAxis, 0 ),
          {
            stroke: SolarSystemCommonColors.secondBodyColorProperty,
            lineWidth: 0.5,
            x: bigEllipseCenterX
          } ),
        new ShadedSphereNode( 6, {
          mainColor: SolarSystemCommonColors.firstBodyColorProperty,
          x: ( smallEllipseFocalPoint - smallEllipseSemiMajorAxis )
        } ),
        new ShadedSphereNode( 3, {
          mainColor: SolarSystemCommonColors.secondBodyColorProperty,
          x: bigEllipseSemiMajorAxis - bigEllipseFocalPoint
        } ),
        new XNode( {
          scale: 0.1,
          fill: 'red',
          stroke: 'white',
          center: Vector2.ZERO
        } )
      ]
    } );

    const containerNode = new Node();

    Multilink.multilink( [ SolarSystemCommonColors.firstBodyColorProperty, SolarSystemCommonColors.secondBodyColorProperty ], () => {

      // Rasterizing the icon because clip areas weren't working on Safari, see https://github.com/phetsims/my-solar-system/issues/46
      // Because rasterization reduces quality, we only do it on Safari
      containerNode.children = [ platform.safari ? node.rasterized( {
        resolution: 16,

        sourceBounds: new Bounds2( -8, -10, 22, 10 )
      } ) : node ];
    } );

    super(
      containerNode,
      { fill: SolarSystemCommonColors.backgroundProperty }
    );
  }
}

mySolarSystem.register( 'IntroScreenIcon', IntroScreenIcon );