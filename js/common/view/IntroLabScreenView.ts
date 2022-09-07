// Copyright 2020-2022, University of Colorado Boulder

/**
 * Screen view for the My Solar System Screen
 * 
 * @author Agustín Vallejo
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { AlignBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import MySolarSystemControls from './MySolarSystemControls.js';
import mySolarSystem from '../../mySolarSystem.js';
import CommonModel from '../model/CommonModel.js';
import PathsWebGLNode from './PathsWebGLNode.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CommonScreenView from './CommonScreenView.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';

type SelfOptions = EmptySelfOptions;

export type IntroLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class IntroLabScreenView extends CommonScreenView {
  public constructor( model: CommonModel, providedOptions: IntroLabScreenViewOptions ) {
    super( model, providedOptions );

    // UI Elements ===================================================================================================
    // Zoom Buttons
    this.interfaceLayer.addChild( new AlignBox( new MagnifyingGlassZoomButtonGroup(
        model.zoomLevelProperty,
        {
          spacing: 8, magnifyingGlassNodeOptions: { glassRadius: 8 }
        } ),
      {
        alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'left', yAlign: 'top'
      } ) );

    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    this.interfaceLayer.addChild( new AlignBox( new Panel(
      new MySolarSystemControls( model, this.topLayer ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS ),
      {
     alignBounds: this.layoutBounds, margin: MySolarSystemConstants.MARGIN, xAlign: 'right', yAlign: 'top'
    } ) );

    //REVIEW: use visibleProperty (and don't specify visible: false at the start)
    const pathsWebGLNode = new PathsWebGLNode( model, this.modelViewTransformProperty, { visible: false } );
    model.pathVisibleProperty.link( visible => {
      pathsWebGLNode.visible = visible;
      model.clearPaths();
    } );
    this.bottomLayer.addChild( pathsWebGLNode );
  }

  //REVIEW: This provides no value over the CommonScreenView update() method, and should be removed (so the subtypes
  //REVIEW: can specify the implementation more directly).
  public override update(): void {
    // See subclass for implementation
  }
}

mySolarSystem.register( 'IntroLabScreenView', IntroLabScreenView );