// Copyright 2022, University of Colorado Boulder
/**
 * Set up for the panel that holds the mass sliders.
 * They will control the mass of the two bodies in the simulation.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { FlowBox, Text } from '../../../../scenery/js/imports.js';
import IntroModel from '../../intro/model/IntroModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import MySolarSystemSlider from './MySolarSystemSlider.js';


type MassesControlsOptions = {
  tandem: Tandem;
};

export default class MassesControls extends FlowBox {

  constructor( model: IntroModel, providedOptions?: Partial<MassesControlsOptions> ) {

    const massRange = new RangeWithValue( 1, 300, 100 );

    const numberControl1 = new MySolarSystemSlider( model.bodies[ 0 ].massProperty, massRange, { thumbFill: 'yellow' } );
    const numberControl2 = new MySolarSystemSlider( model.bodies[ 1 ].massProperty, massRange, { thumbFill: 'fuchsia' } );
  
    super( {
      children: [
        new Text( 'Mass', { font: new PhetFont( 20 ) } ),
        new FlowBox( {
          children: [
            new ShadedSphereNode( 15, { mainColor: 'yellow' } ),
            new NumberDisplay( model.bodies[ 0 ].massProperty, massRange ),
            numberControl1
          ],
          orientation: 'horizontal',
          margin: 5
        } ),
        new FlowBox( {
          children: [
            new ShadedSphereNode( 15, { mainColor: 'fuchsia' } ),
            new NumberDisplay( model.bodies[ 1 ].massProperty, massRange ),
            numberControl2
          ],
          orientation: 'horizontal',
          margin: 5
        } )
      ],
      spacing: 4,
      align: 'left',
      stretch: true,
      orientation: 'vertical'
    } );
  }

}

mySolarSystem.register( 'MassesControls', MassesControls );