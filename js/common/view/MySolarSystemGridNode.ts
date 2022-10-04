// Copyright 2022, University of Colorado Boulder

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons
 * between distances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 *
 * Modified for My Solar System:
 * @author Agustín Vallejo
 *
 * REVIEW: This looks incredibly similar to GravityAndOrbitsGridNode. Perhaps we could refactor THIS type out into
 * REVIEW: scenery-phet, and have GAO use it? This one looks like an enhanced version with better typing.
 */

import { Shape } from '../../../../kite/js/imports.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type MySolarSystemGridNodeOptions = SelfOptions & PathOptions;

export default class MySolarSystemGridNode extends Path {

  /**
   * @param transformProperty
   * @param spacing - spacing between grid lines
   * @param center - center of the grid in model coordinates
   * @param numGridLines - number grid lines on each side of the center
   * @param [providedOptions]
   */
  public constructor( transformProperty: ReadOnlyProperty<ModelViewTransform2>, spacing: number, center: Vector2, numGridLines: number, providedOptions?: MySolarSystemGridNodeOptions ) {

    const options = optionize<MySolarSystemGridNodeOptions, SelfOptions, PathOptions>()( {
      stroke: 'gray'
    }, providedOptions );

    super( null, options );

    transformProperty.link( () => {
      const shape = new Shape();

      const x1 = -numGridLines * spacing + center.x;
      const x2 = numGridLines * spacing + center.x;
      const y1 = -numGridLines * spacing + center.y;
      const y2 = numGridLines * spacing + center.y;

      for ( let i = -numGridLines; i <= numGridLines; i++ ) {
        const x = i * spacing + center.x;
        const y = i * spacing + center.y;
        shape.moveTo( x1, y ).lineTo( x2, y ); // horizontal lines
        shape.moveTo( x, y1 ).lineTo( x, y2 ); // vertical lines
      }

      //REVIEW: #2: try to avoid .value/.get() for a Property when inside a link for it. Just add a parameter to this
      //REVIEW: arrow function ('transform') and use that instead.
      this.shape = transformProperty.value.modelToViewShape( shape );
    } );
  }
}

mySolarSystem.register( 'MySolarSystemGridNode', MySolarSystemGridNode );