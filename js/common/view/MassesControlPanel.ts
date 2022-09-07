// Copyright 2022, University of Colorado Boulder
/**
 * Set up for the panel that holds the mass sliders.
 * They will control the mass of the N bodies in the simulation.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import MySolarSystemSlider from './MySolarSystemSlider.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import CommonModel from '../model/CommonModel.js';
import { EmptySelfOptions, optionize3 } from '../../../../phet-core/js/optionize.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';

type SelfOptions = EmptySelfOptions;

export type MassesControlPanelOptions = SelfOptions & PanelOptions;

export default class MassesControlPanel extends Panel {
  //REVIEW: readonly?
  private sliders: MassesSliders;

  public constructor( model: CommonModel, providedOptions?: MassesControlPanelOptions ) {
    const sliders = new MassesSliders( model );
    const options = optionize3<MassesControlPanelOptions, EmptySelfOptions, PanelOptions>()(
      {},
      MySolarSystemConstants.CONTROL_PANEL_OPTIONS,
      providedOptions
    );
    super( sliders, options );
    this.sliders = sliders;
  }

  public update(): void {
    this.sliders.update();
  }
}

//REVIEW: Curious why this type is factored out
class MassesSliders extends VBox {
  private readonly model: CommonModel;
  private readonly massRange: RangeWithValue;

  //REVIEW: tempChildren seems like it can just be a local variable in update(), instead of being stored here.
  private tempChildren: Node[];

  public constructor( model: CommonModel ) {
    super( {
      //REVIEW: Generally prefer to not leave commented-out code, does this have a purpose?
      // spacing: 5,
      // margin: 5,
      align: 'left',
      stretch: true
    } );
    this.model = model;
    this.massRange = new RangeWithValue( 1, 250, 100 );
    this.tempChildren = [];
    this.update();
  }

  public update(): void {
    //REVIEW: A LOT of notes in here that should be read FULLY before making changes. My recommendations changed while
    //REVIEW: reviewing top-to-bottom, but I think a lot of this is still valuable to know.

    // Whenever the number of bodies change, repopulate the sliders
    //REVIEW: Actually, we can probably get rid of tempChildren fully (it's probably not a huge performance hit to just
    //REVIEW: clear children (node.removeAllChildren()), and then add all the new children.
    this.tempChildren = [ new Text( mySolarSystemStrings.massStringProperty, { font: MySolarSystemConstants.TITLE_FONT } ) ];

    //REVIEW: Unless performance is a concern, I'd prefer the pattern this.model.bodies.forEach( ( body, index ) => { ... } ),
    //REVIEW: where you get the index from the forEach.

    //REVIEW: ACTUALLY, since it's unconditional, you can just specify:
    //REVIEW: this.children = this.model.bodies.map( ( body, index ) => { ... } );
    //REVIEW: strongly prefer this approach, if we're handling the dynamic approach.
    for ( let i = 0; i < this.model.bodies.length; i++ ) {
      const color = MySolarSystemColors.bodiesPalette[ i ];
      this.tempChildren.push(
        new HBox( {
          children: [
            new ShadedSphereNode( 15, { mainColor: color } ),

            //REVIEW: SO, there are some downsides to this dynamic approach of recreating the NumberDisplay/slider.
            //REVIEW: #1: You would need to dispose them, otherwise this is leaking memory (we're never removing the
            //REVIEW: listeners added to the NumberDisplay/slider).
            //REVIEW: #2: For phet-io, we're presumably going to want a stable NumberDisplay/Slider that is each given
            //REVIEW: a single tandem and exists for the lifetime of the sim. This is a bit more complicated to do,
            //REVIEW: unfortunately, but I think it's a case where we should proactively do it if possible (phet-io
            //REVIEW: can make things... tricky sometimes).
            //REVIEW: So... we can consider using DynamicProperty (if the body changes), and potentially updating the
            //REVIEW: ranges, instead of creating new NumberDisplays/Sliders. Perhaps we can collaborate on this?
            new NumberDisplay( this.model.bodies[ i ].massProperty, this.massRange ),
            new MySolarSystemSlider( this.model.bodies[ i ].massProperty, this.massRange, { thumbFill: color } )
          ],
          xMargin: 5,
          yMargin: 3
        } )
      );
    }
    this.children = this.tempChildren;
  }
}

mySolarSystem.register( 'MassesControlPanel', MassesControlPanel );
