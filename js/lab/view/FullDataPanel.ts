// Copyright 2022, University of Colorado Boulder
/**
 * Set up for the panel that holds the mass dataBox.
 * They will control the mass of the N bodies in the simulation.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { GridBox, GridBoxOptions, Node, Text } from '../../../../scenery/js/imports.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import CommonModel from '../../common/model/CommonModel.js';
import { optionize3 } from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import LabModel from '../model/LabModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type FullDataPanelOptions = PanelOptions;

export default class FullDataPanel extends Panel {
  private dataBox: DataBox;

  constructor( model: LabModel, providedOptions?: FullDataPanelOptions ) {
    const dataBox = new DataBox( model );
    const options = optionize3<FullDataPanelOptions, EmptyObjectType, PanelOptions>()(
      {},
      MySolarSystemConstants.CONTROL_PANEL_OPTIONS,
      providedOptions
      );
    super( dataBox, options );
    this.dataBox = dataBox;
  }

  update(): void {
    this.dataBox.update();
  }
}

type DataBoxOptions = GridBoxOptions;

class DataBox extends GridBox {
  model: CommonModel;
  massRange: RangeWithValue;
  tempChildren: Node[];

  constructor( model: CommonModel, providedOptions?: Partial<DataBoxOptions> ) {
    super( {
      ySpacing: 5,
      xMargin: 10
    } );
    this.model = model;
    this.massRange = new RangeWithValue( 1, 300, 100 );
    this.tempChildren = [];
    this.update();
  }

  update(): void {
    // Whenever the number of bodies change, repopulate the dataBox
    this.tempChildren = [
      new Text( 'Mass', { font: new PhetFont( 20 ), layoutOptions: { x: 1, y: 0 } } ),
      new Text( 'Position', { font: new PhetFont( 20 ), layoutOptions: { x: 2, y: 0, width: 2 } } ),
      new Text( 'Velocity', { font: new PhetFont( 20 ), layoutOptions: { x: 4, y: 0, width: 2 } } ),
      new Text( 'x', { font: new PhetFont( 20 ), layoutOptions: { x: 2, y: 1 } } ),
      new Text( 'y', { font: new PhetFont( 20 ), layoutOptions: { x: 3, y: 1 } } ),
      new Text( 'Vx', { font: new PhetFont( 20 ), layoutOptions: { x: 4, y: 1 } } ),
      new Text( 'Vy', { font: new PhetFont( 20 ), layoutOptions: { x: 5, y: 1 } } )
    ];

    for ( let i = 0; i < this.model.bodies.length; i++ ) {
      const color = MySolarSystemColors.bodiesPalette[ i ];
      this.tempChildren.push( ...[
            new ShadedSphereNode( 15, { mainColor: color, layoutOptions: { x: 0, y: i + 2 } } ),
            new NumberDisplay(
              this.model.bodies[ i ].massProperty,
              this.massRange, { layoutOptions: { x: 1, y: i + 2 } } ),
            new NumberDisplay(
              new DerivedProperty( [ this.model.bodies[ i ].positionProperty ], position => position.x ),
              this.massRange, { layoutOptions: { x: 2, y: i + 2 } } ),
            new NumberDisplay(
              new DerivedProperty( [ this.model.bodies[ i ].positionProperty ], position => position.y ),
              this.massRange, { layoutOptions: { x: 3, y: i + 2 } } ),
            new NumberDisplay(
              new DerivedProperty( [ this.model.bodies[ i ].velocityProperty ], velocity => velocity.x ),
              this.massRange, { layoutOptions: { x: 4, y: i + 2 } } ),
            new NumberDisplay(
              new DerivedProperty( [ this.model.bodies[ i ].velocityProperty ], velocity => velocity.y ),
              this.massRange, { layoutOptions: { x: 5, y: i + 2 } } )
          ] );
    }
    this.children = this.tempChildren;
  }
}

mySolarSystem.register( 'FullDataPanel', FullDataPanel );