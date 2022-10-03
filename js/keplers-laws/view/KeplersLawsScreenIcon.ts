// Copyright 2020-2022, University of Colorado Boulder

/**
 *
 * Definition of the Lab Screen Icon: A sun with two elliptical orbits around it
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class KeplersLawsScreenIcon extends ScreenIcon {
  public constructor() {
    // Ellipses parameters
    const EllipseSemiMajorAxis = 20;
    const EllipseSemiMinorAxis = 15;
    // calculate focal point
    const EllipseFocalPoint = Math.sqrt( EllipseSemiMajorAxis * EllipseSemiMajorAxis - EllipseSemiMinorAxis * EllipseSemiMinorAxis );

    const calculateR = ( a: number, e: number, nu: number ): Vector2 => {
      const r = a * ( 1 - e * e ) / ( 1 + e * Math.cos( nu ) );
      return Vector2.createPolar( r, nu );
    };

    const excentricity = EllipseFocalPoint / EllipseSemiMajorAxis;

    const divisionAngles = [
      0,
      1.877,
      2.807,
      3.475,
      -1.877
    ];
    const areas = [];

    const bodyPosition = calculateR( EllipseSemiMajorAxis, excentricity, divisionAngles[ divisionAngles.length - 1 ] * 1.08 );

    for ( let i = 1; i < divisionAngles.length; i++ ) {
      let startAngle = divisionAngles[ i ];
      let endAngle = i + 1 === divisionAngles.length ? divisionAngles[ 0 ] : divisionAngles[ i + 1 ];

      startAngle = Math.PI - startAngle;
      endAngle = Math.PI - endAngle;

      areas.push(
        new Path(
        new Shape().moveTo( -EllipseFocalPoint, 0 ).ellipticalArc(
          0, 0, EllipseSemiMajorAxis, EllipseSemiMinorAxis, 0, startAngle, endAngle, true
        ).close(),
          {
            fill: 'fuchsia',
            opacity: ( divisionAngles.length - i + 1 ) / ( divisionAngles.length + 1 )
          }
        )
      );
    }

    super(
      new Node( {
        children: [
          ...areas,
          new Path(
            new Shape().ellipse( 0, 0, EllipseSemiMajorAxis, EllipseSemiMinorAxis, 0 ),
            {
              stroke: 'fuchsia',
              lineWidth: 1
            } ),
          new ShadedSphereNode( 8, {
            mainColor: 'yellow',
            x: -EllipseFocalPoint
          } ),
          new ShadedSphereNode( 3, {
            mainColor: 'fuchsia',
            x: bodyPosition.x + EllipseFocalPoint,
            y: -bodyPosition.y
          } )
        ]
      } ),
      { fill: 'black' }
    );
  }
}

mySolarSystem.register( 'KeplersLawsScreenIcon', KeplersLawsScreenIcon );