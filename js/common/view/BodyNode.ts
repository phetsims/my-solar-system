// Copyright 2021-2022, University of Colorado Boulder

/**
 * Visible Body Node that draws a sphere with size dependent on the Body's mass.
 *
 * @author Agustín Vallejo
 */

import { DragListener } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../model/Body.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {
  draggable?: boolean;
};

export type BodyNodeOptions = SelfOptions & ShadedSphereNodeOptions;

export default class BodyNode extends ShadedSphereNode {
  public readonly body: Body;
  private readonly positionMultilink: UnknownMultilink;
  public readonly draggable: boolean;

  //REVIEW: Prefer TReadOnlyProperty instead of ReadOnlyProperty
  public constructor( body: Body, modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>, providedOptions?: BodyNodeOptions ) {
    const options = optionize<BodyNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {
      cursor: 'pointer',
      draggable: true
    }, providedOptions );

    super( 1, options );

    this.body = body;

    this.positionMultilink = Multilink.multilink(
      [ body.positionProperty, body.radiusProperty, modelViewTransformProperty ],
      ( position, radius, modelViewTransform ) => {
        radius = modelViewTransform.modelToViewDeltaX( radius );
        this.setRadius( radius );
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

    this.draggable = options.draggable;
    if ( this.draggable ) {
      const dragListener = new DragListener( {
        positionProperty: body.positionProperty,
        start: () => {
          body.clearPath();
        }
      } );
      modelViewTransformProperty.link( transform => {
        dragListener.transform = transform;
      } );
      this.addInputListener( dragListener );
    }
  }

  private static massToScale( mass: number, scale: number ): number {
    return scale * ( 30 * mass / 200 + 20 );
  }

  public override dispose(): void {
    this.positionMultilink.dispose();
    super.dispose();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );