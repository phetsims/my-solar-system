// Copyright 2022, University of Colorado Boulder

/**
 * Set up for the panel that holds the mass dataBox.
 * They will control the mass of the N bodies in the simulation.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { FireListener, GridBox, GridBoxOptions, Node, Text } from '../../../../scenery/js/imports.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import KeypadDialog from '../../../../scenery-phet/js/keypad/KeypadDialog.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import CommonModel from '../../common/model/CommonModel.js';
import { combineOptions, EmptySelfOptions, optionize3 } from '../../../../phet-core/js/optionize.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import LabModel from '../model/LabModel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import MappedProperty from '../../../../axon/js/MappedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TProperty from '../../../../axon/js/TProperty.js';

export type FullDataPanelOptions = PanelOptions;

export default class FullDataPanel extends Panel {
  private readonly dataBox: DataBox;

  public constructor( model: LabModel, providedOptions?: FullDataPanelOptions ) {
    const dataBox = new DataBox( model );
    const options = optionize3<FullDataPanelOptions, EmptySelfOptions, PanelOptions>()(
      {},
      MySolarSystemConstants.CONTROL_PANEL_OPTIONS,
      providedOptions
    );
    super( dataBox, options );
    this.dataBox = dataBox;
  }

  public update(): void {
    this.dataBox.update();
  }
}

type DataBoxOptions = GridBoxOptions;

class DataBox extends GridBox {
  //REVIEW: See all the notes from MassesControlPanel here! tempChildren and the creation of NumberDisplays that we
  //REVIEW: should be disposing all applies here.

  private readonly model: CommonModel;
  private readonly massRange: RangeWithValue;
  private readonly positionRange: RangeWithValue;
  private tempChildren: Node[];

  public constructor( model: CommonModel, providedOptions?: Partial<DataBoxOptions> ) {
    super( {
      ySpacing: 5,
      xMargin: 10
    } );
    this.model = model;
    this.massRange = new RangeWithValue( 1, 300, 100 );
    this.positionRange = new RangeWithValue( -400, 400, 0 );
    this.tempChildren = [];
    this.update();
  }

  public update(): void {

    // KeypadDialog
    const keypadDialog = new KeypadDialog( {
      keypadOptions: {
        accumulatorOptions: {
          // {number} - maximum number of digits that can be entered on the keypad.
          maxDigits: 8
        }
      }
    } );

    // Whenever the number of bodies change, repopulate the dataBox
    this.tempChildren = [
      new Text( MySolarSystemStrings.dataPanel.MassStringProperty, { font: new PhetFont( 20 ), layoutOptions: { column: 1, row: 0 } } ),
      new Text( MySolarSystemStrings.dataPanel.PositionStringProperty, { font: new PhetFont( 20 ), layoutOptions: { column: 2, row: 0, width: 2 } } ),
      new Text( MySolarSystemStrings.dataPanel.VelocityStringProperty, { font: new PhetFont( 20 ), layoutOptions: { column: 4, row: 0, width: 2 } } ),
      new Text( MySolarSystemStrings.dataPanel.XStringProperty, { font: new PhetFont( 20 ), layoutOptions: { column: 2, row: 1 } } ),
      new Text( MySolarSystemStrings.dataPanel.YStringProperty, { font: new PhetFont( 20 ), layoutOptions: { column: 3, row: 1 } } ),
      new Text( MySolarSystemStrings.dataPanel.VxStringProperty, { font: new PhetFont( 20 ), layoutOptions: { column: 4, row: 1 } } ),
      new Text( MySolarSystemStrings.dataPanel.VyStringProperty, { font: new PhetFont( 20 ), layoutOptions: { column: 5, row: 1 } } )
    ];

    for ( let i = 0; i < this.model.bodies.length; i++ ) {
      const color = MySolarSystemColors.bodiesPalette[ i ];
      this.tempChildren.push(
        new ShadedSphereNode( 15, { mainColor: color, layoutOptions: { column: 0, row: i + 2 } } ),
        new InteractiveNumberDisplay(
          this.model.bodies[ i ].massProperty,
          this.massRange, keypadDialog, { layoutOptions: { column: 1, row: i + 2 } } ),
        new InteractiveNumberDisplay(
          new MappedProperty( this.model.bodies[ i ].positionProperty, {
            bidirectional: true,
            map: position => position.x,
            inverseMap: ( x : number ) => new Vector2( x, this.model.bodies[ i ].positionProperty.value.y )
          } ),
          this.positionRange, keypadDialog, { layoutOptions: { column: 2, row: i + 2 } } ),
        new InteractiveNumberDisplay(
          new MappedProperty( this.model.bodies[ i ].positionProperty, {
            bidirectional: true,
            map: position => position.y,
            inverseMap: ( y : number ) => new Vector2( this.model.bodies[ i ].positionProperty.value.x, y )
          } ),
          this.positionRange, keypadDialog, { layoutOptions: { column: 3, row: i + 2 } } ),
        new InteractiveNumberDisplay(
          new MappedProperty( this.model.bodies[ i ].velocityProperty, {
            bidirectional: true,
            map: velocity => velocity.x,
            inverseMap: ( x : number ) => new Vector2( x, this.model.bodies[ i ].velocityProperty.value.y )
          } ),
          this.positionRange, keypadDialog, { layoutOptions: { column: 4, row: i + 2 } } ),
        new InteractiveNumberDisplay(
          new MappedProperty( this.model.bodies[ i ].velocityProperty, {
            bidirectional: true,
            map: velocity => velocity.y,
            inverseMap: ( y : number ) => new Vector2( this.model.bodies[ i ].velocityProperty.value.x, y )
          } ),
          this.positionRange, keypadDialog, { layoutOptions: { column: 5, row: i + 2 } } )
        );
    }
    this.children = this.tempChildren;
  }
}

class InteractiveNumberDisplay extends NumberDisplay {
  public constructor(
    property: TProperty<number>,
    range: RangeWithValue,
    keypadDialog: KeypadDialog,
    providedOptions?: NumberDisplayOptions
  ) {

    const options = combineOptions<NumberDisplayOptions>( {
      cursor: 'pointer'
    }, providedOptions );

    super( property, range, options );

    this.addInputListener( new FireListener( {
      fire: () => {
        keypadDialog.beginEdit( value => {
          property.value = value;
        }, range, new PatternStringProperty( MySolarSystemStrings.gridStringProperty, {
          units: 'AU'
        } ), () => {
          // no-op
        } );
      },
      fireOnDown: true
    } ) );
    }
}

mySolarSystem.register( 'FullDataPanel', FullDataPanel );