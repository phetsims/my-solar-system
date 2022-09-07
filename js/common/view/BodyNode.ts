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
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';

type SelfOptions = {
  draggable?: boolean;
};
export type BodyNodeOptions = SelfOptions & ShadedSphereNodeOptions;

export default class BodyNode extends ShadedSphereNode {
  public readonly body: Body;
  public readonly initialMass: number;
  private readonly positionMultilink: UnknownMultilink;
  public readonly draggable: boolean;

  //REVIEW: Prefer TReadOnlyProperty instead of ReadOnlyProperty
  public constructor( body: Body, modelViewTransformProperty: ReadOnlyProperty<ModelViewTransform2>, providedOptions?: BodyNodeOptions ) {
    const options = optionize<BodyNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {
      cursor: 'pointer',
      draggable: true
    }, providedOptions );

    super( 1, options );

    this.body = body;
    this.initialMass = 200; //body.massProperty.value;

    this.positionMultilink = Multilink.multilink(
      [ body.positionProperty, body.massProperty, modelViewTransformProperty ],
      ( position, mass, modelViewTransform ) => {
        this.setScaleMagnitude( this.massToScale( mass, modelViewTransform.modelToViewDeltaX( 1 ) ) );
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

  //REVIEW: Doesn't mention `this`, so generally should prefer making methods like this static
  private massToScale( mass: number, scale: number ): number {
    return scale * ( 30 * mass / 200 + 20 );
  }

  public override dispose(): void {
    this.positionMultilink.dispose();
    super.dispose();
  }
}

mySolarSystem.register( 'BodyNode', BodyNode );