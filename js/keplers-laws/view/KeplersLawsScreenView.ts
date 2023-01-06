// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { AlignBox, HBox, Node, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsControls from './KeplersLawsControls.js';
import PanelSecondLaw from './PanelSecondLaw.js';
import BodyNode from '../../common/view/BodyNode.js';
import EllipticalOrbitNode from './EllipticalOrbitNode.js';
import PanelThirdLaw from './PanelThirdLaw.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CommonScreenView, { CommonScreenViewOptions } from '../../common/view/CommonScreenView.js';
import LawsButtons from './LawsButtons.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import SecondLawGraph from './SecondLawGraph.js';
import PanelFirstLaw from './PanelFirstLaw.js';

// constants
const MARGIN = 5;

type SelfOptions = EmptySelfOptions;

export type KeplersLawsScreenViewOptions = SelfOptions & CommonScreenViewOptions;

class KeplersLawsScreenView extends CommonScreenView {

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {
    super( model, providedOptions );

    this.bodiesLayer.addChild( new BodyNode(
      model.bodies[ 0 ],
      this.modelViewTransformProperty,
      {
        draggable: false
      }
    ) );
    this.bodiesLayer.addChild( new BodyNode(
      model.bodies[ 1 ],
      this.modelViewTransformProperty
    ) );
    this.componentsLayer.addChild( this.createDraggableVectorNode( model.bodies[ 1 ], { zeroAllowed: false } ) );

    this.bottomLayer.addChild( new EllipticalOrbitNode( model, this.modelViewTransformProperty ) );

    // UI ----------------------------------------------------------------------------------
    // Second and Third Law Accordion Boxes and Zoom Buttons
    const lawsAndZoomBoxes = new AlignBox( new HBox( {
        children: [
          new PanelFirstLaw( model ),
          new VBox( {
            margin: 5,
            stretch: true,
            children: [
              new PanelSecondLaw( model ),
              new SecondLawGraph( model )
            ],
            visibleProperty: model.isSecondLawProperty
          } ),
          new PanelThirdLaw( model )
          // new MagnifyingGlassZoomButtonGroup(
          //   model.zoomLevelProperty, {
          //     spacing: 8,
          //     magnifyingGlassNodeOptions: {
          //       glassRadius: 8
          //     },
          //     touchAreaXDilation: 5,
          //     touchAreaYDilation: 5
          //   } )
        ],
        spacing: 10,
        align: 'top'
      } ),
      { margin: MARGIN, xAlign: 'left', yAlign: 'top' }
    );

    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    const controlPanelAlignBox = new AlignBox(
      new VBox( {
        spacing: 10,
        children: [
          new KeplersLawsControls( model, providedOptions.tandem.createTandem( 'controlPanel' ) ),
          this.timeBox
        ]
      } ),
      { margin: MARGIN, xAlign: 'right', yAlign: 'top' }
    );

    const lawsButtonsBox = new AlignBox( new HBox( {
        children: [
          new LawsButtons( model )
        ],
        spacing: 20
      } ),
      { margin: MARGIN, xAlign: 'left', yAlign: 'bottom' }
    );


    // Add the center box containing the time control buttons
    const centerBox = new AlignBox( new Node(), {
      margin: MySolarSystemConstants.MARGIN,
      xAlign: 'center',
      yAlign: 'bottom'
    } );

    this.visibleBoundsProperty.link( visibleBounds => {
      lawsAndZoomBoxes.alignBounds = visibleBounds;
      controlPanelAlignBox.alignBounds = visibleBounds;
      lawsButtonsBox.alignBounds = visibleBounds;
      centerBox.alignBounds = visibleBounds;
    } );

    // Slider that controls the bodies mass
    this.interfaceLayer.addChild( lawsAndZoomBoxes );
    this.interfaceLayer.addChild( controlPanelAlignBox );
    this.interfaceLayer.addChild( lawsButtonsBox );
    this.interfaceLayer.addChild( centerBox );
  }
}

mySolarSystem.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;