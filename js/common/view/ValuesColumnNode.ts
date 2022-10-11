// Copyright 2022, University of Colorado Boulder

/**
 * Generates the information column for values depending on the type of Value used.
 *
 * @author Agustín Vallejo
 */

import KeypadDialog from '../../../../scenery-phet/js/keypad/KeypadDialog.js';
import { AlignBox, AlignGroup, FireListener, Node, RichText, TColor, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import CommonModel from '../model/CommonModel.js';
import ValuesColumnTypes from './ValuesColumnTypes.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import MySolarSystemSlider from './MySolarSystemSlider.js';
import Body from '../model/Body.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import MappedProperty from '../../../../axon/js/MappedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TProperty from '../../../../axon/js/TProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

const LABEL_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );
const CONTENT_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );

type SelfOptions = {
  contentContainerSpacing?: number;
  labelSpacing?: number;
};

export type ValuesColumnNodeOptions = SelfOptions & VBoxOptions;


export default class ValuesColumnNode extends VBox {
  public constructor( model: CommonModel, columnType: ValuesColumnTypes ) {
    const options: ValuesColumnNodeOptions = {
      // {number} - y-spacing between each of the content Nodes.
      contentContainerSpacing: 3.5,

      // {number} - y-spacing between the label and first content Node.
      labelSpacing: 3
    };

    const labelString = columnType === ValuesColumnTypes.POSITION_X ? MySolarSystemStrings.dataPanel.XStringProperty :
                        columnType === ValuesColumnTypes.POSITION_Y ? MySolarSystemStrings.dataPanel.YStringProperty :
                        columnType === ValuesColumnTypes.VELOCITY_X ? MySolarSystemStrings.dataPanel.VxStringProperty :
                        columnType === ValuesColumnTypes.VELOCITY_Y ? MySolarSystemStrings.dataPanel.VyStringProperty :
                        '';

    const labelNode = new RichText( labelString, { font: MySolarSystemConstants.PANEL_FONT } );

    // Create the VBox container for the contentNodes of the column.
    const contentContainer = new VBox( { spacing: options.contentContainerSpacing } );

    // Loop through each possible Body and create the corresponding contentNode. These Bodies are NOT necessarily the
    // active bodies, so we are responsible for updating visibility based on whether it is
    // the system.
    model.availableBodies.forEach( ( body, i ) => {

      // Retrieve the color from the colors palette
      const color = body.color;

      // Create the corresponding contentNode for each available body.
      const contentNode = ValuesColumnNode.createContentNode( body, columnType, model, color );

      // Add the content to the container.
      contentContainer.addChild( contentNode );

      // Observe when Bodies are added or removed from the Model, meaning the contentNode's visibility could change
      // if the body is added or removed from the system. It should only be visible if the body is in the Model.
      model.bodies.lengthProperty.link( () => {
        contentNode.visible = model.bodies.includes( body );
      } );
    } );

    // Set the children of this Node to the correct rendering order.
    options.children = [ LABEL_ALIGN_GROUP.createBox( labelNode ), contentContainer ];

    super( options );
  }

  private static createContentNode( body: Body, columnType: ValuesColumnTypes, model: CommonModel, color: TColor ): AlignBox {
    // Flag that references the contentNode.
    let contentNode;

    const massRange = new RangeWithValue( 1, 300, 100 );
    const positionRange = new RangeWithValue( -400, 400, 0 );

    // Create the contentNode based on the columnType.
    if ( columnType === ValuesColumnTypes.BODY_ICONS ) {
      contentNode = new ShadedSphereNode( 16, { mainColor: color } );
    }
    else if ( columnType === ValuesColumnTypes.MASS_SLIDER ) {
      contentNode = new MySolarSystemSlider( body.massProperty, massRange, { thumbFill: color } );
    }
    else if ( columnType === ValuesColumnTypes.MASS ) {
      contentNode = new InteractiveNumberDisplay( body.massProperty, massRange );
    }
    else if ( columnType === ValuesColumnTypes.POSITION_X ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.positionProperty, {
          bidirectional: true,
          map: position => position.x,
          inverseMap: ( x : number ) => new Vector2( x, body.positionProperty.value.y )
        } ),
        positionRange );
    }
    else if ( columnType === ValuesColumnTypes.POSITION_Y ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.positionProperty, {
          bidirectional: true,
          map: position => position.y,
          inverseMap: ( y : number ) => new Vector2( body.positionProperty.value.x, y )
        } ),
        positionRange );
    }
    else if ( columnType === ValuesColumnTypes.VELOCITY_X ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.velocityProperty, {
          bidirectional: true,
          map: velocity => velocity.x,
          inverseMap: ( x : number ) => new Vector2( x, body.velocityProperty.value.y )
        } ),
        positionRange );
    }
    else if ( columnType === ValuesColumnTypes.VELOCITY_Y ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.velocityProperty, {
          bidirectional: true,
          map: velocity => velocity.y,
          inverseMap: ( y : number ) => new Vector2( body.velocityProperty.value.x, y )
        } ),
        positionRange );
    }
    else {
      contentNode = new Node();
    }

    // Wrap the contentNode in a AlignBox to match the height of all ContentNodes.
    return CONTENT_ALIGN_GROUP.createBox( contentNode );
  }
}

/**
 * NumberDisplay used in the panel to control Masses, Position and Velocity
 */
class InteractiveNumberDisplay extends NumberDisplay {
  public constructor(
    property: TProperty<number>,
    range: RangeWithValue,
    providedOptions?: NumberDisplayOptions
  ) {

    // Keypad dialog
    const keypadDialog = new KeypadDialog( {
      keypadOptions: {
        accumulatorOptions: {
          // {number} - maximum number of digits that can be entered on the keypad.
          maxDigits: 8
        }
      }
    } );

    const options = combineOptions<NumberDisplayOptions>( {
      cursor: 'pointer',
      textOptions: {
        font: MySolarSystemConstants.PANEL_FONT
      }
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

mySolarSystem.register( 'ValuesColumnNode', ValuesColumnNode );
