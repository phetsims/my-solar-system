// Copyright 2022, University of Colorado Boulder

/**
 * Logic that handles the creation and disposal of model-view pairs.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { Node } from '../../../../scenery/js/imports.js';

export default class NodeTracker<Model, View extends Node> {
  private readonly map: Map<Model, View>;
  private readonly container: Node;
  private readonly factory: ( x: Model ) => View;

  public constructor( container: Node, factory: ( x: Model ) => View ) {
    this.map = new Map<Model, View>();
    this.container = container;
    this.factory = factory;
  }

  public add( model: Model ): void {
    const modelView = this.factory( model );
    this.map.set( model, modelView );
    this.container.addChild( modelView );
  }

  public remove( model: Model ): void {
    const modelView = this.map.get( model )!;
    this.map.delete( model );
    this.container.removeChild( modelView );
    modelView.dispose();
  }
}

mySolarSystem.register( 'NodeTracker', NodeTracker );
