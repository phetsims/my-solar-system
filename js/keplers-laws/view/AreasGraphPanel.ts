// Copyright 2022, University of Colorado Boulder

/**
 * Panel that shows the graph of the swept area under the curve of the orbit.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';

const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

export default class AreasGraphPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {

    const options = combineOptions<PanelOptions>( {
      visibleProperty: new DerivedProperty( [ model.areasVisibleProperty, model.areaGraphVisibleProperty ],
        ( areasVisible, areasGraphVisible ) => areasVisible && areasGraphVisible )
    }, MySolarSystemConstants.CONTROL_PANEL_OPTIONS );

    const xAxisLength = 120;
    const yAxisLength = 180;

    const title = new Text( mySolarSystemStrings.areaGraph.titleStringProperty, TITLE_OPTIONS );

    const xAxis = new ArrowNode( 0, 0, xAxisLength, 0, {
      fill: 'white',
      stroke: 'white',
      tailWidth: 1
    } );
    const yAxis = new ArrowNode( 0, 0, 0, -yAxisLength, {
      fill: 'white',
      stroke: 'white',
      tailWidth: 1
    } );

    super( new VBox(
      {
        children: [
          title,
          new Node( {
            children: [
              xAxis,
              yAxis
              ]
          } )
        ]
      }
    ), options );
  }
}

mySolarSystem.register( 'AreasGraphPanel', AreasGraphPanel );