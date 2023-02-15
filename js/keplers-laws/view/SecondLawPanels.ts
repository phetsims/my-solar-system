// Copyright 2022-2023, University of Colorado Boulder

/**
 * Kepler's second law panel control: Swept area
 *
 * This class is mostly empty and only has SecondLawGraph as a child to keep code consistency across the three laws.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import { VBox } from '../../../../scenery/js/imports.js';
import SecondLawGraph from './SecondLawGraph.js';

export default class SecondLawPanels extends VBox {
  public constructor( model: KeplersLawsModel ) {
    super( {
      margin: 5,
      stretch: true,
      children: [
        new SecondLawGraph( model )
      ],
      visibleProperty: model.isSecondLawProperty
    } );
  }
}

mySolarSystem.register( 'SecondLawPanels', SecondLawPanels );