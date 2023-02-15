// Copyright 2023, University of Colorado Boulder

/**
 * Kepler's first law panel control: eccentricity display
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { HBox, RichText, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import Panel from '../../../../sun/js/Panel.js';
import FirstLawGraph from './FirstLawGraph.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';

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

    const semiMajorAxisStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.semiMajorAxisStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty,
      value: new DerivedProperty( [ model.engine.semiMajorAxisProperty, model.engine.allowedOrbitProperty ], ( semiMajorAxis, allowedOrbit ) => {
        return allowedOrbit ? Utils.toFixed( semiMajorAxis, 2 ) : MathSymbols.INFINITY;
      } )
    } );
    const semiMinorAxisStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.semiMinorAxisStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty,
      value: new DerivedProperty( [ model.engine.semiMinorAxisProperty, model.engine.allowedOrbitProperty ], ( semiMinorAxis, allowedOrbit ) => {
        return allowedOrbit ? Utils.toFixed( semiMinorAxis, 2 ) : MathSymbols.NO_VALUE;
      } )
    } );
    const focalDistanceStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.textEqualsValueUnitsStringProperty, {
      text: MySolarSystemStrings.symbols.focalDistanceStringProperty,
      units: MySolarSystemStrings.units.AUStringProperty,
      value: new DerivedProperty( [ model.engine.focalDistanceProperty, model.engine.allowedOrbitProperty ], ( focalDistance, allowedOrbit ) => {
        return allowedOrbit ? Utils.toFixed( focalDistance, 2 ) : MathSymbols.INFINITY;
      } )
    } );

    super( new VBox( {
      align: 'left',
      children: [
        new RichText( semiMajorAxisStringProperty, MySolarSystemConstants.TEXT_OPTIONS ),
        new RichText( semiMinorAxisStringProperty, MySolarSystemConstants.TEXT_OPTIONS ),
        new RichText( focalDistanceStringProperty, MySolarSystemConstants.TEXT_OPTIONS )
      ]
    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );
  }
}

mySolarSystem.register( 'FirstLawPanels', FirstLawPanels );