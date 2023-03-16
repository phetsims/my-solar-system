// Copyright 2022-2023, University of Colorado Boulder

/**
 * Shows the "trail" left behind by a Body as it moves over time, which disappears after about 2 orbits
 * This is named "Path" instead of "trail" since that is how it is supposed to appear to the students.
 *
 * Note: In the Java sim this was PathNode and there was one Node for each body. For performance reasons, it
 * has been changed so that there is just one CanvasNode shared between all of the bodies.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import { CanvasNode, CanvasNodeOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;

// constants
const STROKE_WIDTH = 3;

export default class PathsCanvasNode extends CanvasNode {
  private readonly transformProperty: TReadOnlyProperty<ModelViewTransform2>;
  private readonly bodies: Body[];

  public constructor( bodies: Body[], transformProperty: TReadOnlyProperty<ModelViewTransform2>, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, providedOptions?: CanvasNodeOptions ) {

    const options = optionize<CanvasNodeOptions, SelfOptions, CanvasNodeOptions>()( {
      preventFit: true
    }, providedOptions );

    super( options );

    visibleBoundsProperty.link( bounds => {
      this.canvasBounds = bounds;
    } );

    this.transformProperty = transformProperty;
    this.bodies = bodies;

    stepTimer.addListener( () => this.invalidatePaint() );
  }

  public paintCanvas( context: CanvasRenderingContext2D ): void {
    let j;

    // draw the path for each body one by one
    for ( let i = 0; i < this.bodies.length; i++ ) {
      const body = this.bodies[ i ];

      const points = body.pathPoints.map( point => this.transformProperty.value.modelToViewPosition( point ) );

      // max path length in view coordinates
      const maxPathLength = this.transformProperty.get().modelToViewDeltaX( 1200 );
      const fadePathLength = maxPathLength * 0.15; // fade length is ~15% of the path

      context.strokeStyle = body.colorProperty.value.toCSS();
      context.lineWidth = STROKE_WIDTH;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();

      // Create and render the solid part as a path. New points are added at the tail of the list,
      // so easiest to render backwards for fade-out.
      if ( points.length > 0 ) {
        context.moveTo( points[ points.length - 1 ].x, points[ points.length - 1 ].y );
      }

      j = points.length - 1;

      let pathLength = 0;
      while ( pathLength < maxPathLength - fadePathLength && j > 0 ) {
        context.lineTo( points[ j ].x, points[ j ].y );
        if ( j > 1 ) {

          // increment the path length by the length of the added segment
          const segDifX = points[ j ].x - points[ j - 1 ].x;
          const segDifY = points[ j ].y - points[ j - 1 ].y;

          // avoid using vector2 to prevent excess object allocation
          const segLength = Math.sqrt( segDifX * segDifX + segDifY * segDifY );
          pathLength += segLength;
        }
        j--;
      }
      context.stroke();

      // Draw the faded out part

      // Using "butt" is too "feathered" and makes the stroke look less bold than it should be
      context.lineCap = 'square';

      // Using "square" makes the stroke too wide, so we must trim it down accordingly.
      context.lineWidth = STROKE_WIDTH * 0.7;

      const faded = body.colorProperty.value;

      while ( pathLength < maxPathLength && j > 0 ) {
        assert && assert( pathLength > maxPathLength - fadePathLength, 'the path length is too small to start fading' );

        // fade out a little bit each segment
        const alpha = Utils.linear( maxPathLength - fadePathLength, maxPathLength, 1, 0, pathLength );

        // format without Color to avoid unnecessary allocation
        const fade = `rgba(${faded.r},${faded.g},${faded.b},${alpha})`;

        context.beginPath();
        context.strokeStyle = fade;
        context.moveTo( points[ j + 1 ].x, points[ j + 1 ].y );
        context.lineTo( points[ j ].x, points[ j ].y );
        context.stroke();

        // increment the path length by the length of the added segment
        const segDifX = points[ j ].x - points[ j - 1 ].x;
        const segDifY = points[ j ].y - points[ j - 1 ].y;

        // avoid using vector2 to prevent excess object allocation
        const segLength = Math.sqrt( segDifX * segDifX + segDifY * segDifY );
        pathLength += segLength;
        j--;
      }

      if ( pathLength > maxPathLength ) {
        while ( j >= 0 ) {
          points.shift();
          j--;
        }
      }
    }
  }
}

mySolarSystem.register( 'PathsCanvasNode', PathsCanvasNode );