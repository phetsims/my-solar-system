// Copyright 2022, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { AlignBox, HBox, VBox } from '../../../../scenery/js/imports.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import KeplersLawsControls from './KeplersLawsControls.js';
import AreasAccordionBox from './AreasAccordionBox.js';
import BodyNode from '../../common/view/BodyNode.js';
import EllipticalOrbitNode from './EllipticalOrbitNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import DraggableVectorNode from '../../common/view/DraggableVectorNode.js';
import ThirdLawAccordionBox from './ThirdLawAccordionBox.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AreasGraphPanel from './AreasGraphPanel.js';
import CommonScreenView, { CommonScreenViewOptions } from '../../common/view/CommonScreenView.js';
import LawsButtons from './LawsButtons.js';

// constants
const MARGIN = 5;

type SelfOptions = EmptySelfOptions;

export type KeplersLawsScreenViewOptions = SelfOptions & CommonScreenViewOptions;

class KeplersLawsScreenView extends CommonScreenView {

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {
    super( model, providedOptions );


    const sun = model.bodies[ 0 ];
    const planet = model.bodies[ 1 ];

    this.bodiesLayer.addChild( new BodyNode(
      sun,
      this.modelViewTransformProperty,
      {
        mainColor: MySolarSystemColors.bodiesPalette[ 0 ],
        draggable: false
      }
    ) );
    this.bodiesLayer.addChild( new BodyNode(
      planet,
      this.modelViewTransformProperty,
      {
        mainColor: MySolarSystemColors.bodiesPalette[ 1 ]
      }
    ) );
    this.componentsLayer.addChild( new DraggableVectorNode(
      planet, this.modelViewTransformProperty, model.velocityVisibleProperty, planet.velocityProperty,
      //REVIEW: translatable label! also factor this out with the other version in the common screen view
      1, 'V', { fill: PhetColorScheme.VELOCITY, zeroAllowed: false }
    ) );

    this.bottomLayer.addChild( new EllipticalOrbitNode( model, this.modelViewTransformProperty ) );

    // UI ----------------------------------------------------------------------------------
    // Zoom Buttons
    this.interfaceLayer.addChild( new AlignBox( new HBox( {
        children: [
          new VBox( {
            margin: 5,
            stretch: true,
            children: [
              new AreasAccordionBox( model ),
              new AreasGraphPanel( model )
            ]
          } ),
          new ThirdLawAccordionBox( model ),
          new MagnifyingGlassZoomButtonGroup(
            model.zoomLevelProperty, { spacing: 8, magnifyingGlassNodeOptions: { glassRadius: 8 } } )
        ],
        spacing: 10,
        align: 'top'
      } ),
      { alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'left', yAlign: 'top' }
    ) );


    // Add the control panel on top of the canvases
    // Visibility checkboxes for sim elements
    this.interfaceLayer.addChild( new AlignBox( new KeplersLawsControls( model ),
      {
        alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'right', yAlign: 'top'
      } ) );

    this.interfaceLayer.addChild( new AlignBox( new HBox( {
        children: [
          new LawsButtons( model )
        ],
        spacing: 20
      } ),
      {
        alignBounds: this.layoutBounds, margin: MARGIN, xAlign: 'left', yAlign: 'bottom'
      } ) );
  }
}

mySolarSystem.register( 'KeplersLawsScreenView', KeplersLawsScreenView );
export default KeplersLawsScreenView;