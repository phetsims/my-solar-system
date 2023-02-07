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
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Panel from '../../../../sun/js/Panel.js';
import FirstLawGraph from './FirstLawGraph.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import MySolarSystemTextNumberDisplay from '../../common/view/MySolarSystemTextNumberDisplay.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

export default class FirstLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      children: [
        new ExcentricityPanel( model ),
        new ValuesPanel( model )
      ]
    } );
  }
}

class ExcentricityPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    super( new VBox( {
      children: [
        new Text( MySolarSystemStrings.eccentricityEquationStringProperty, MySolarSystemConstants.TITLE_OPTIONS ),
        new FirstLawGraph( model )
      ],
      spacing: 10,
      align: 'left',
      stretch: true,
      visibleProperty: model.eccentricityVisibleProperty
    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );
  }
}

class ValuesPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {

    const semiMajorAxisValueRange = new RangeWithValue( 1, 10000, model.engine.a );
    const semiMinorAxisValueRange = new RangeWithValue( 1, 10000, model.engine.b );
    const focalDistanceValueRange = new RangeWithValue( 0, 10000, model.engine.c );

    const semiMajorAxisStringPatternProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.semiMajorAxisSymbolStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty
    } );
    const semiMinorAxisStringPatternProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.semiMinorAxisSymbolStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty
    } );
    const focalDistanceStringPatternProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.focalDistanceSymbolStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty
    } );

    super( new VBox( {
      children: [
        new MySolarSystemTextNumberDisplay( model.engine.semiMajorAxisProperty, semiMajorAxisValueRange,
          {
            visibleProperty: model.semiaxisVisibleProperty,
            valuePattern: semiMajorAxisStringPatternProperty,
            align: 'left'
          } ),
        new MySolarSystemTextNumberDisplay( model.engine.semiMinorAxisProperty, semiMinorAxisValueRange,
          {
            visibleProperty: model.semiaxisVisibleProperty,
            valuePattern: semiMinorAxisStringPatternProperty,
            align: 'left'
          } ),
        new MySolarSystemTextNumberDisplay( model.engine.focalDistanceProperty, focalDistanceValueRange,
          {
            visibleProperty: model.eccentricityVisibleProperty,
            valuePattern: focalDistanceStringPatternProperty,
            align: 'left'
          } )
      ]
    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );
  }
}

mySolarSystem.register( 'FirstLawPanels', FirstLawPanels );