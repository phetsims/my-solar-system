// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen view for Kepler's Laws screen
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { AlignBox, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsControls from './KeplersLawsControls.js';
import SecondLawPanel from './SecondLawPanel.js';
import BodyNode from '../../common/view/BodyNode.js';
import EllipticalOrbitNode from './EllipticalOrbitNode.js';
import ThirdLawPanel from './ThirdLawPanel.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CommonScreenView, { CommonScreenViewOptions } from '../../common/view/CommonScreenView.js';
import LawsButtons from './LawsButtons.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import FirstLawPanel from './FirstLawPanel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

// constants
const MARGIN = 10;

type SelfOptions = EmptySelfOptions;

export type KeplersLawsScreenViewOptions = SelfOptions & CommonScreenViewOptions;

class KeplersLawsScreenView extends CommonScreenView {

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsScreenViewOptions ) {
    const options = combineOptions<CommonScreenViewOptions>( providedOptions, {
      playingAllowedProperty: model.engine.allowedOrbitProperty
    } );

    super( model, options );

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
    this.componentsLayer.addChild( this.createDraggableVectorNode( model.bodies[ 1 ], {
      zeroAllowed: false,
      enabledProperty: DerivedProperty.not( model.alwaysCircularProperty )
    } ) );

    const ellipticalOrbitNode = new EllipticalOrbitNode( model, this.modelViewTransformProperty );
    this.bottomLayer.addChild( ellipticalOrbitNode );
    this.bodiesLayer.addChild( ellipticalOrbitNode.topLayer );

    // UI ----------------------------------------------------------------------------------
    // Second and Third Law Accordion Boxes and Zoom Buttons
    const lawsAndZoomBoxes = new AlignBox( new HBox( {
        children: [
          new FirstLawPanel( model ),
          new SecondLawPanel( model ),
          new ThirdLawPanel( model )
          // NOTE: CODE TEMPORARILY COMMENTED OUT, AWAITING DESIGN DECISION
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
        align: 'left',
        children: [
          new KeplersLawsControls( model, providedOptions.tandem.createTandem( 'controlPanel' ) ),
          this.timeBox,
          new AlignBox(
            new Checkbox(
              model.alwaysCircularProperty,
              new Text( MySolarSystemStrings.circularOrbitStringProperty, MySolarSystemConstants.TEXT_OPTIONS ),
              MySolarSystemConstants.CHECKBOX_OPTIONS ), {
              xMargin: MARGIN / 2,
              xAlign: 'left',
              yAlign: 'bottom',
              maxWidth: 150,
              tandem: providedOptions.tandem.createTandem( 'alwaysCircularCheckbox' )
            }
          ),
          new TextPushButton( MySolarSystemStrings.centerOrbitStringProperty, {
            font: new PhetFont( 16 ),
            maxTextWidth: 120,
            listener: () => {
              const offset = this.layoutBounds.center.minus( ellipticalOrbitNode.center );
              this.orbitalCenterProperty.value = this.orbitalCenterProperty.value.plus( offset );
            },
            tandem: providedOptions.tandem.createTandem( 'centerSystemButton' ),
            touchAreaXDilation: 10,
            touchAreaYDilation: 10
          } )
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