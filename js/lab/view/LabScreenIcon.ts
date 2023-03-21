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
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';

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

    super(
        new Node( {
          children: [
            new Path(
              new Shape().ellipse( 0, 0, smallEllipseSemiMajorAxis, smallEllipseSemiMinorAxis, 0 ),
              {
                stroke: SolarSystemCommonColors.secondBodyColorProperty,
                lineWidth: 0.8,
                x: smallEllipseCenterX
              } ),
            new Path(
              new Shape().ellipse( 0, 0, bigEllipseSemiMajorAxis, bigEllipseSemiMinorAxis, 0 ),
              {
                stroke: SolarSystemCommonColors.thirdBodyColorProperty,
                lineWidth: 1
              } ),
            new ShadedSphereNode( 8, {
              mainColor: SolarSystemCommonColors.firstBodyColorProperty,
              x: -bigEllipseFocalPoint
            } ),
            new ShadedSphereNode( 3, {
              mainColor: SolarSystemCommonColors.secondBodyColorProperty,
              x: smallEllipseSemiMajorAxis + smallEllipseCenterX
            } ),
            new ShadedSphereNode( 3, {
              mainColor: SolarSystemCommonColors.thirdBodyColorProperty,
              x: bigEllipseSemiMajorAxis
            } )
          ]
        } ),
        { fill: SolarSystemCommonColors.backgroundProperty }
      );
  }
}

mySolarSystem.register( 'LabScreenIcon', LabScreenIcon );