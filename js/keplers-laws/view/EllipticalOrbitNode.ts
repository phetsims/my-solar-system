// Copyright 2022, University of Colorado Boulder
/**
 * Visual Node for the Elliptical Orbit based on the Orbital Parameters
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { Shape } from '../../../../kite/js/imports.js';
import EllipticalOrbit from '../model/EllipticalOrbit.js';
import { Path, Node, Circle } from '../../../../scenery/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';

const TWOPI = 2 * Math.PI;

export default class EllipticalOrbitNode extends Path {
  private readonly orbit: EllipticalOrbit;
  private readonly shapeMultilink: UnknownMultilink;

  public constructor(
    model: KeplersLawsModel,
    modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>
    ) {

    // Passing in a null shape, since it will be updated later
    super( null, {
      lineWidth: 3,
      stroke: MySolarSystemColors.orbitColorProperty
    } );

    this.orbit = model.engine;

    // Temporal orbiting body, displayed as a white X. In the future, the orbiting body should be the BodyNode
    const predictedBody = this.orbit.predictedBody;
    const predicted = new XNode( {
      fill: 'white',
      stroke: 'white',
      center: Vector2.ZERO,
      legThickness: 2,
      length: 10
    } );

    // Drawing of Periapsis and Apoapsis, their position is updated later
    const periapsis = new XNode( {
      fill: 'gold',
      stroke: 'white',
      center: Vector2.ZERO,
      visibleProperty: new DerivedProperty(
        [ model.periapsisVisibleProperty ], visible => {
        return visible && ( this.orbit.e > 0 );
      } )
    } );
    const apoapsis = new XNode( {
      fill: 'cyan',
      stroke: 'white',
      center: Vector2.ZERO,
      visibleProperty: new DerivedProperty(
        [ model.apoapsisVisibleProperty ], visible => {
        return visible && ( this.orbit.e > 0 );
      } )
    } );
    const axisPath = new Path( null, {
      stroke: MySolarSystemColors.orbitColorProperty,
      lineWidth: 1,
      visibleProperty: model.axisVisibleProperty
    } );

    // Arrays of orbital divisions' dots and areas
    const orbitDivisions: Circle[] = [];
    const areaPaths: Path[] = [];

    for ( let i = 0; i < model.maxDivisionValue; i++ ) {
      orbitDivisions.push( new Circle( 5, {
        fill: 'black',
        stroke: MySolarSystemColors.orbitColorProperty,
        lineWidth: 3,
        center: Vector2.ZERO,
        visible: false
      } ) );
      areaPaths.push( new Path( null, {
        fill: MySolarSystemColors.orbitColorProperty,
        opacity: 0.7 * ( i / 10 ) + 0.3
      } ) );
    }

    // Nodes for the orbital divisions' dots and areas
    // There are Nodes and arrays separately to access them by index
    const orbitDivisionsNode = new Node( {
      visibleProperty: model.dotsVisibleProperty
    } );
    const areaPathsNode = new Node( {
      visibleProperty: model.sweepAreaVisibleProperty
    } );
    orbitDivisions.forEach( node => { orbitDivisionsNode.addChild( node ); } );
    areaPaths.forEach( node => { areaPathsNode.addChild( node ); } );

    this.addChild( axisPath );
    this.addChild( areaPathsNode );
    this.addChild( periapsis );
    this.addChild( apoapsis );
    this.addChild( predicted );
    this.addChild( orbitDivisionsNode );

    const updatedOrbit = () => {
      // Non allowed orbits will show up as dashed lines
      this.lineDash = this.orbit.allowedOrbit ? [ 0 ] : [ 5 ];

      const scale = modelViewTransformProperty.value.modelToViewDeltaX( 1 );
      const a = this.orbit.a;
      const e = this.orbit.e;
      const c = e * a;
      const center = new Vector2( -c, 0 );

      const radiusX = scale * a;
      const radiusY = scale * Math.sqrt( a * a - c * c );

      // The ellipse is translated and rotated so its children can use local coordinates
      this.translation = modelViewTransformProperty.value.modelToViewPosition( center );
      this.rotation = 0;
      this.rotateAround( this.translation.add( center.times( -scale ) ), -this.orbit.w );
      this.shape = new Shape().ellipse( 0, 0, radiusX, radiusY, 0 );

      // Drawing the axis of the ellipse
      const axis = new Shape().moveTo( -radiusX, 0 ).lineTo( radiusX, 0 );
      axis.moveTo( 0, -radiusY ).lineTo( 0, radiusY );
      axisPath.shape = axis;

      periapsis.center = new Vector2( scale * ( a * ( 1 - e ) + c ), 0 );
      apoapsis.center = new Vector2( -scale * ( a * ( 1 + e ) - c ), 0 );
      predicted.center = predictedBody.positionProperty.value.minus( center ).times( scale );

      let startAngle = 0;
      let endAngle = 0;
      let startIndex = 0;
      let endIndex = 0;
      let bodyAngle = Math.atan2( predicted.center.y / radiusY, predicted.center.x / radiusX );

      for ( let i = 0; i < model.maxDivisionValue; i++ ) {
        if ( ( i < model.periodDivisionProperty.value ) ) {
          if ( this.orbit.retrograde ) {
            endIndex = i;
            startIndex = i + 1 < model.periodDivisionProperty.value ? i + 1 : 0;
          }
          else {
            startIndex = i;
            endIndex = i - 1 < 0 ? model.periodDivisionProperty.value - 1 : i - 1;
          }

          // Set the center of the orbit's divisions, seen in the sim as dots
          orbitDivisions[ i ].center = this.orbit.divisionPoints[ i ].minus( center ).times( scale );
          orbitDivisions[ i ].visible = true;

          startAngle = Math.atan2( orbitDivisions[ startIndex ].y / radiusY, orbitDivisions[ startIndex ].x / radiusX );
          endAngle = Math.atan2( orbitDivisions[ endIndex ].y / radiusY, orbitDivisions[ endIndex ].x / radiusX );

          startAngle = Utils.moduloBetweenDown( startAngle, endAngle, TWOPI + endAngle );
          bodyAngle = Utils.moduloBetweenDown( bodyAngle, endAngle, TWOPI + endAngle );

          areaPaths[ i ].visible = true;

          // Map opacity from 0 to 0.8 based on BodyAngle from endAngle to startAngle (inside area)
          const areaRatio = ( bodyAngle - endAngle ) / ( startAngle - endAngle );

          // Map opacity from 0 to 0.8 based on BodyAngle from startAngle to endAngle (outside area)
          let opacityFalloff = -1 * ( bodyAngle - endAngle - TWOPI ) / ( TWOPI - ( startAngle - endAngle ) );
          opacityFalloff = Utils.moduloBetweenDown( opacityFalloff, 0, 1 );

          if ( startAngle === endAngle ) { // TODO: Check why this happens
            areaPaths[ i ].opacity = 0;
          }
          else if ( ( endAngle <= bodyAngle ) && ( bodyAngle <= startAngle ) ) {
            if ( this.orbit.retrograde ) {
              areaPaths[ i ].opacity = 0.8 * ( areaRatio );
              startAngle = bodyAngle;
            }
            else {
              areaPaths[ i ].opacity = 0.8 * ( 1 - areaRatio );
              endAngle = bodyAngle;
            }
          }
          else {
            if ( this.orbit.retrograde ) {
              areaPaths[ i ].opacity = 0.8 * ( opacityFalloff );
            }
            else {
              areaPaths[ i ].opacity = 0.8 * ( 1 - opacityFalloff );
            }
          }

          areaPaths[ i ].shape = new Shape().moveTo( c * scale, 0 ).ellipticalArc(
            0, 0, radiusX, radiusY, 0, startAngle, endAngle, true
          ).close();
        }
        else {
          orbitDivisions[ i ].visible = false;
          areaPaths[ i ].visible = false;
        }
      }
    };

    this.orbit.changedEmitter.addListener( updatedOrbit );

    this.shapeMultilink = Multilink.multilink(
      [
        predictedBody.positionProperty,
        modelViewTransformProperty,
        model.periodDivisionProperty,
        model.dotsVisibleProperty
      ],
      () => updatedOrbit() );
  }
}

mySolarSystem.register( 'EllipticalOrbitNode', EllipticalOrbitNode );