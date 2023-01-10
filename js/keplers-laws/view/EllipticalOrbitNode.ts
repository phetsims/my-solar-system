// Copyright 2022-2023, University of Colorado Boulder
/**
 * Visual Node for the Elliptical Orbit based on the Orbital Parameters
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { Shape } from '../../../../kite/js/imports.js';
import EllipticalOrbitEngine from '../model/EllipticalOrbitEngine.js';
import { Circle, Node, Path } from '../../../../scenery/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';


export default class EllipticalOrbitNode extends Path {
  private readonly orbit: EllipticalOrbitEngine;
  private readonly shapeMultilink: UnknownMultilink;
  public readonly topLayer = new Node();

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

    // FIRST LAW: Axis, foci, and Ellipse definition lines
    const axisPath = new Path( null, {
      stroke: MySolarSystemColors.foregroundProperty,
      lineWidth: 2,
      visibleProperty: model.axisVisibleProperty
    } );
    const fociOptions = {
      fill: '#29ABE2',
      stroke: 'black',
      scale: 0.8,
      center: Vector2.ZERO,
      visibleProperty: model.fociVisibleProperty
    };
    const foci = [
      new XNode( fociOptions ),
      new XNode( fociOptions )
    ];

    // Drawing of Periapsis and Apoapsis, their position is updated later
    const periapsis = new XNode( {
      fill: 'gold',
      stroke: 'white',
      center: Vector2.ZERO,
      visibleProperty: new DerivedProperty(
        [ model.periapsisVisibleProperty, this.orbit.eccentricityProperty ],
        ( visible, e ) => {
          return visible && ( e > 0 );
        } )
    } );
    const apoapsis = new XNode( {
      fill: 'cyan',
      stroke: 'white',
      center: Vector2.ZERO,
      visibleProperty: new DerivedProperty(
        [ model.periapsisVisibleProperty, this.orbit.eccentricityProperty ],
        ( visible, e ) => {
          return visible && ( e > 0 );
        } )
    } );

    // Arrays of orbital divisions' dots and areas
    const orbitDivisions: Circle[] = [];
    const areaPaths: Path[] = [];

    for ( let i = 0; i < model.maxDivisionValue; i++ ) {
      orbitDivisions.push( new Circle( 4, {
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
    this.addChild( orbitDivisionsNode );

    this.topLayer.addChild( foci[ 0 ] );
    this.topLayer.addChild( foci[ 1 ] );

    const updatedOrbit = () => {
      // Non allowed orbits will show up as dashed lines
      this.lineDash = this.orbit.allowedOrbitProperty.value ? [ 0 ] : [ 5 ];

      const scale = modelViewTransformProperty.value.modelToViewDeltaX( 1 );
      const a = this.orbit.a;
      const e = this.orbit.e;
      const c = e * a;
      const center = new Vector2( -c, 0 );

      const radiusX = scale * a;
      const radiusY = scale * Math.sqrt( a * a - c * c );

      const applyTransformation = ( point: Node ) => {
        point.translation = modelViewTransformProperty.value.modelToViewPosition( center );
        point.rotation = 0;
        point.rotateAround( point.translation.add( center.times( -scale ) ), -this.orbit.w );
      };

      // The ellipse is translated and rotated so its children can use local coordinates
      applyTransformation( this );
      this.shape = new Shape().ellipse( 0, 0, radiusX, radiusY, 0 );

      // Same transformations set to TopLayer because it's not directly a child of this
      applyTransformation( this.topLayer );

      // FIRST LAW -------------------------------------------
      // Axis of the ellipse
      const axis = new Shape().moveTo( -radiusX, 0 ).lineTo( radiusX, 0 );
      axis.moveTo( 0, -radiusY ).lineTo( 0, radiusY );
      axisPath.shape = axis;

      //Foci
      foci[ 0 ].center = new Vector2( -c * scale, 0 );
      foci[ 1 ].center = new Vector2( c * scale, 0 );

      // SECOND LAW -------------------------------------------
      // Periapsis and apoapsis
      periapsis.center = new Vector2( scale * ( a * ( 1 - e ) + c ), 0 );
      apoapsis.center = new Vector2( -scale * ( a * ( 1 + e ) - c ), 0 );

      // Drawing orbital divisions and areas
      this.orbit.orbitalAreas.forEach( ( area, i ) => {
        orbitDivisions[ i ].visible = model.isSecondLawProperty.value && area.active && this.orbit.allowedOrbitProperty.value;
        areaPaths[ i ].visible = model.isSecondLawProperty.value && area.active && this.orbit.allowedOrbitProperty.value;

        if ( i < model.periodDivisionProperty.value && this.orbit.allowedOrbitProperty.value ) {
          // Set the center of the orbit's divisions dot
          orbitDivisions[ i ].center = area.dotPosition.minus( center ).times( scale );
          orbitDivisions[ i ].fill = MySolarSystemColors.orbitColorProperty.value.darkerColor( Math.pow( 1 - area.completion, 10 ) );


          const start = area.startPosition.minus( center ).times( scale );
          const end = area.endPosition.minus( center ).times( scale );
          const startAngle = Math.atan2( start.y / radiusY, start.x / radiusX );
          const endAngle = Math.atan2( end.y / radiusY, end.x / radiusX );

          // Activate area path
          // Opacity lowered down to 0.8 for stylistic purposes
          areaPaths[ i ].opacity = area.insideProperty.value ? 1 : 0.8 * area.completion;
          areaPaths[ i ].shape = new Shape().moveTo( c * scale, 0 ).ellipticalArc(
            0, 0, radiusX, radiusY, 0, startAngle, endAngle, false
          ).close();
        }
      } );
    };


    this.orbit.changedEmitter.addListener( updatedOrbit );

    this.shapeMultilink = Multilink.multilink(
      [
        modelViewTransformProperty,
        model.periodDivisionProperty,
        model.dotsVisibleProperty,
        model.selectedLawProperty
      ],
      () => updatedOrbit() );
  }
}

mySolarSystem.register( 'EllipticalOrbitNode', EllipticalOrbitNode );