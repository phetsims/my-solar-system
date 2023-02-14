// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's first law panel control: eccentricity display
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Panel from '../../../../sun/js/Panel.js';
import FirstLawGraph from './FirstLawGraph.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import MySolarSystemTextNumberDisplay from '../../common/view/MySolarSystemTextNumberDisplay.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

export default class FirstLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      children: [
        new ExcentricityPanel( model ),
        new ValuesPanel( model ),
        new InvalidValuesPanel( model )
      ]
    } );
  }
}

class ExcentricityPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {
    super( new VBox( {
      children: [
        new HBox( {
          children: [
            new Text( MySolarSystemStrings.eccentricityEquationStringProperty, MySolarSystemConstants.TITLE_OPTIONS ),
            new Text( MySolarSystemStrings.symbols.focalDistanceStringProperty, combineOptions<TextOptions>( {},
              MySolarSystemConstants.TITLE_OPTIONS, { fill: MySolarSystemColors.thirdBodyColorProperty } ) ),
            new Text( MySolarSystemStrings.symbols.divisionStringProperty, MySolarSystemConstants.TITLE_OPTIONS ),
            new Text( MySolarSystemStrings.symbols.semiMajorAxisStringProperty, combineOptions<TextOptions>( {},
              MySolarSystemConstants.TITLE_OPTIONS, { fill: 'orange' } ) )
            ]
        } ),
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
      text: MySolarSystemStrings.symbols.semiMajorAxisStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty
    } );
    const semiMinorAxisStringPatternProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.semiMinorAxisStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty
    } );
    const focalDistanceStringPatternProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.focalDistanceStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty
    } );

    super( new VBox( {
      children: [
        new MySolarSystemTextNumberDisplay( model.engine.semiMajorAxisProperty, semiMajorAxisValueRange,
          {
            visibleProperty: model.semiaxisVisibleProperty,
            valuePattern: semiMajorAxisStringPatternProperty,
            align: 'left',
            decimalPlaces: 2
          } ),
        new MySolarSystemTextNumberDisplay( model.engine.semiMinorAxisProperty, semiMinorAxisValueRange,
          {
            visibleProperty: model.semiaxisVisibleProperty,
            valuePattern: semiMinorAxisStringPatternProperty,
            align: 'left',
            decimalPlaces: 2
          } ),
        new MySolarSystemTextNumberDisplay( model.engine.focalDistanceProperty, focalDistanceValueRange,
          {
            visibleProperty: model.eccentricityVisibleProperty,
            valuePattern: focalDistanceStringPatternProperty,
            align: 'left',
            decimalPlaces: 2
          } )
      ],
      visibleProperty: model.engine.allowedOrbitProperty
    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );
  }
}

class InvalidValuesPanel extends Panel {
  public constructor( model: KeplersLawsModel ) {

    const semiMajorAxisStringPatternProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.semiMajorAxisStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty,
      value: MathSymbols.INFINITY
    } );
    const semiMinorAxisStringPatternProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.semiMinorAxisStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty,
      value: MathSymbols.NO_VALUE
    } );
    const focalDistanceStringPatternProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.focalDistanceStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty,
      value: MathSymbols.INFINITY
    } );

    super( new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        new Text( semiMajorAxisStringPatternProperty, combineOptions<TextOptions>( { visibleProperty: model.semiaxisVisibleProperty }, MySolarSystemConstants.TEXT_OPTIONS ) ),
        new Text( semiMinorAxisStringPatternProperty, combineOptions<TextOptions>( { visibleProperty: model.semiaxisVisibleProperty }, MySolarSystemConstants.TEXT_OPTIONS ) ),
        new Text( focalDistanceStringPatternProperty, combineOptions<TextOptions>( { visibleProperty: model.eccentricityVisibleProperty }, MySolarSystemConstants.TEXT_OPTIONS ) )
      ],
      visibleProperty: DerivedProperty.not( model.engine.allowedOrbitProperty )
    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );
  }
}

mySolarSystem.register( 'FirstLawPanels', FirstLawPanels );