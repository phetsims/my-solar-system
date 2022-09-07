// Copyright 2022, University of Colorado Boulder

/**
 * Draws a vector for a Body, such as a force vector or velocity vector.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

export type VectorNodeOptions = ArrowNodeOptions;

export default class VectorNode extends ArrowNode {
  //REVIEW: I think readonly works here?
  protected tipProperty: ReadOnlyProperty<Vector2>;
  protected tailProperty: ReadOnlyProperty<Vector2>;

  public constructor(
    body: Body,
    //REVIEW: This should be TReadOnlyProperty<ModelViewTransform2>, as the general type (rather than the full Property) is sufficient
    transformProperty: ReadOnlyProperty<ModelViewTransform2>,
    //REVIEW: This should be TReadOnlyProperty<boolean>, so that the interface is flexible (we're only using the read-only part)
    visibleProperty: Property<boolean>,
    //REVIEW: This should be TReadOnlyProperty<Vector2>, so that the interface is flexible (we're only using the read-only part)
    vectorProperty: Property<Vector2>,
    scale: number,
    providedOptions?: VectorNodeOptions
  ) {

    super( 0, 0, 0, 0, optionize<VectorNodeOptions, EmptySelfOptions, ArrowNodeOptions>()( {
      headHeight: 15,
      headWidth: 15,
      tailWidth: 5,
      stroke: '#404040',
      //REVIEW: I generally recommend not having commented-out code lying around without a purpose or to-do item or
      //REVIEW: something else. Is this helpful for you or someone else in the future to see?
      // pickable: false,
      boundsMethod: 'none',
      isHeadDynamic: true,
      scaleTailToo: true,
      visibleProperty: visibleProperty
    }, providedOptions ) );

    this.tailProperty = new DerivedProperty( [ body.positionProperty, transformProperty ],
      ( bodyPosition, transform ) => {
        return transform.modelToViewPosition( bodyPosition );
      } );

    this.tipProperty = new DerivedProperty( [ visibleProperty, this.tailProperty, vectorProperty, transformProperty ],
      ( visible, tail, vector, transform ) => {
        const force = transform.modelToViewDelta( vector.times( scale ) );
        const tip = force.plus( tail );

        if ( visible ) {
          this.setTailAndTip( tail.x, tail.y, tip.x, tip.y );
        }

        return tip;
      } );
  }

  public override dispose(): void {
    this.tailProperty.dispose();
    this.tipProperty.dispose();

    super.dispose();
  }
}

mySolarSystem.register( 'VectorNode', VectorNode );