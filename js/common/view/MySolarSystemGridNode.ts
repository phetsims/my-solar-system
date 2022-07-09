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
 */

import { Shape } from '../../../../kite/js/imports.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';

type SelfOptions = EmptyObjectType;

export type MySolarSystemGridNodeOptions = SelfOptions & PathOptions;

class MySolarSystemGridNode extends Path {

  /**
   * @param transformProperty
   * @param spacing - spacing between grid lines
   * @param center - center of the grid in model coordinates
   * @param numGridLines - number grid lines on each side of the center
   * @param [providedOptions]
   */
  constructor( transformProperty: ReadOnlyProperty<ModelViewTransform2>, spacing: number, center: Vector2, numGridLines: number, providedOptions?: MySolarSystemGridNodeOptions ) {

    const options = optionize<MySolarSystemGridNodeOptions, SelfOptions, PathOptions>()( {
      lineWidth: 1,
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

      this.shape = transformProperty.get().modelToViewShape( shape );
    } );
  }
}

mySolarSystem.register( 'MySolarSystemGridNode', MySolarSystemGridNode );
export default MySolarSystemGridNode;