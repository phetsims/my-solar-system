// Copyright 2022-2025, University of Colorado Boulder

/**
 *
 * Definition of the Lab Screen Icon: A sun with two elliptical orbits around it
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import Shape from '../../../../kite/js/Shape.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import mySolarSystem from '../../mySolarSystem.js';

export default class LabScreenIcon extends ScreenIcon {
  public constructor() {

    // Ellipses parameters
    // Big ellipse
    const bigEllipseSemiMajorAxis = 20;
    const bigEllipseSemiMinorAxis = 15;

    // calculate focal point
    const bigEllipseFocalPoint = Math.sqrt( bigEllipseSemiMajorAxis * bigEllipseSemiMajorAxis - bigEllipseSemiMinorAxis * bigEllipseSemiMinorAxis );

    // Small ellipse
    const smallEllipseSemiMajorAxis = 15;
    const smallEllipseSemiMinorAxis = 10;

    // Calculate center if periapsis is the same as the one of the big ellipse
    const smallEllipseCenterX = smallEllipseSemiMajorAxis - bigEllipseSemiMajorAxis;

    const iconNode = new Node( {
      children: [

        // magenta orbit
        new Path( new Shape().ellipse( 0, 0, smallEllipseSemiMajorAxis, smallEllipseSemiMinorAxis, 0 ), {
          stroke: MySolarSystemColors.body2ColorProperty,
          lineWidth: 0.8,
          x: smallEllipseCenterX
        } ),

        // cyan orbit
        new Path( new Shape().ellipse( 0, 0, bigEllipseSemiMajorAxis, bigEllipseSemiMinorAxis, 0 ), {
          stroke: MySolarSystemColors.body3ColorProperty,
          lineWidth: 1
        } ),

        // Sun (yellow body)
        new ShadedSphereNode( 8, {
          mainColor: MySolarSystemColors.body1ColorProperty,
          x: -bigEllipseFocalPoint
        } ),

        // magenta body
        new ShadedSphereNode( 3, {
          mainColor: MySolarSystemColors.body2ColorProperty,
          x: smallEllipseSemiMajorAxis + smallEllipseCenterX
        } ),

        // cyan body
        new ShadedSphereNode( 3, {
          mainColor: MySolarSystemColors.body3ColorProperty,
          x: bigEllipseSemiMajorAxis
        } )
      ]
    } );

    super( iconNode, {
      fill: SolarSystemCommonColors.backgroundProperty
    } );
  }
}

mySolarSystem.register( 'LabScreenIcon', LabScreenIcon );