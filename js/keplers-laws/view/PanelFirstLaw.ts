// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's first law panel control: Excentricity display
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
import { PanelThirdLawOptions } from './PanelThirdLaw.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

export default class PanelFirstLaw extends Panel {
  public constructor( model: KeplersLawsModel ) {
    const options = combineOptions<PanelThirdLawOptions>( {
      visibleProperty: model.isFirstLawProperty,
      fill: MySolarSystemColors.backgroundProperty,
      stroke: MySolarSystemColors.gridIconStrokeColorProperty
    }, MySolarSystemConstants.CONTROL_PANEL_OPTIONS );

    super( new VBox( {
      children: [
        new Text( MySolarSystemStrings.excentricityStringProperty, TEXT_OPTIONS )
      ],
      spacing: 10,
      align: 'left',
      stretch: true
    } ), options );
  }
}

mySolarSystem.register( 'PanelFirstLaw', PanelFirstLaw );