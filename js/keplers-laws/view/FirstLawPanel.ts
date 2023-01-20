// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's first law panel control: eccentricity display
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Panel from '../../../../sun/js/Panel.js';
import { PanelThirdLawOptions } from './ThirdLawPanel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import FirstLawGraph from './FirstLawGraph.js';


export default class FirstLawPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const options = combineOptions<PanelThirdLawOptions>( {
      visibleProperty: model.eccentricityVisibleProperty,
      fill: MySolarSystemColors.backgroundProperty,
      stroke: MySolarSystemColors.gridIconStrokeColorProperty,
      xMargin: 10,
      yMargin: 10
    }, MySolarSystemConstants.CONTROL_PANEL_OPTIONS );

    super( new VBox( {
      children: [
        new Text( MySolarSystemStrings.eccentricityEquationStringProperty, MySolarSystemConstants.TITLE_OPTIONS ),
        new FirstLawGraph( model )
      ],
      spacing: 10,
      align: 'left',
      stretch: true
    } ), options );
  }
}

mySolarSystem.register( 'FirstLawPanel', FirstLawPanel );