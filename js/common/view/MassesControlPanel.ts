// Copyright 2022, University of Colorado Boulder
/**
 * Set up for the panel that holds the mass sliders.
 * They will control the mass of the N bodies in the simulation.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { FlowBox, Node, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import MySolarSystemSlider from './MySolarSystemSlider.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import CommonModel from '../model/CommonModel.js';
import { optionize3 } from '../../../../phet-core/js/optionize.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';


type MassesSlidersOptions = {
  tandem: Tandem;
};

type MassesControlPanelOptions = PanelOptions;

export default class MassesControlPanel extends Panel {
  private sliders: MassesSliders;

  constructor( model: CommonModel, providedOptions?: MassesControlPanelOptions ) {
    const sliders = new MassesSliders( model );
    const options = optionize3<MassesControlPanelOptions, {}, PanelOptions>()(
      {},
      MySolarSystemConstants.CONTROL_PANEL_OPTIONS,
      providedOptions
      );
    super( sliders, options );
    this.sliders = sliders;
  }

  update(): void {
    this.sliders.update();
  }
}

class MassesSliders extends FlowBox {
  model: CommonModel;
  massRange: RangeWithValue;
  tempChildren: Node[];

  constructor( model: CommonModel, providedOptions?: Partial<MassesSlidersOptions> ) {
    super( {
      spacing: 5,
      margin: 5,
      align: 'left',
      stretch: true,
      orientation: 'vertical'
    } );
    this.model = model;
    this.massRange = new RangeWithValue( 1, 300, 100 );
    this.tempChildren = [];
    this.update();
  }

  update(): void {
    // Whenever the number of bodies change, repopulate the sliders
    this.tempChildren = [ new Text( 'Mass', { font: MySolarSystemConstants.TITLE_FONT } ) ];
    for ( let i = 0; i < this.model.bodies.length; i++ ) {
      const color = MySolarSystemColors.bodiesPalette[ i ];
      this.tempChildren.push(
        new FlowBox( {
          children: [
            new ShadedSphereNode( 15, { mainColor: color } ),
            new NumberDisplay( this.model.bodies[ i ].massProperty, this.massRange ),
            new MySolarSystemSlider( this.model.bodies[ i ].massProperty, this.massRange, { thumbFill: color } )
          ],
          orientation: 'horizontal',
          margin: 5
        } )
      );
    }
    this.children = this.tempChildren;
  }
}

mySolarSystem.register( 'MassesControlPanel', MassesControlPanel );