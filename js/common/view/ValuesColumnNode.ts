// Copyright 2022, University of Colorado Boulder

/**
 * Generates the information column for values depending on the type of Value used.
 *
 * @author Agustín Vallejo
 */

import { AlignBox, AlignGroup, Color, Node, RichText, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import CommonModel from '../model/CommonModel.js';
import ValuesColumnTypes from './ValuesColumnTypes.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import MySolarSystemSlider from './MySolarSystemSlider.js';
import Body from '../model/Body.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import MappedProperty from '../../../../axon/js/MappedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import InteractiveNumberDisplay from './InteractiveNumberDisplay.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

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
      //REVIEW: Don't doc them here! They should be documented in SelfOptions. Why the type docs, copied from BallValuesPanelColumnNode?
      // {number} - y-spacing between each of the content Nodes.
      contentContainerSpacing: 3.5,

      //REVIEW: Don't doc them here! They should be documented in SelfOptions. Why the type docs, copied from BallValuesPanelColumnNode?
      // {number} - y-spacing between the label and first content Node.
      labelSpacing: 3,

      stretch: true
    };

    const labelString = columnType === ValuesColumnTypes.POSITION_X ? MySolarSystemStrings.dataPanel.XStringProperty :
                        columnType === ValuesColumnTypes.POSITION_Y ? MySolarSystemStrings.dataPanel.YStringProperty :
                        columnType === ValuesColumnTypes.VELOCITY_X ? MySolarSystemStrings.dataPanel.VxStringProperty :
                        columnType === ValuesColumnTypes.VELOCITY_Y ? MySolarSystemStrings.dataPanel.VyStringProperty :
                        '';

    const labelNode = new RichText( labelString, {
      maxWidth: 60,
      font: MySolarSystemConstants.PANEL_FONT
    } );

    // Create the VBox container for the contentNodes of the column.
    const contentContainer = new VBox( { spacing: options.contentContainerSpacing, stretch: true } );

    // Loop through each possible Body and create the corresponding contentNode. These Bodies are NOT necessarily the
    // active bodies, so we are responsible for updating visibility based on whether it is
    // the system.
    //REVIEW: not using `i` parameter
    model.availableBodies.forEach( ( body, i ) => {

      // Retrieve the color from the colors palette
      const colorProperty = body.colorProperty;

      // Create the corresponding contentNode for each available body.
      const contentNode = ValuesColumnNode.createContentNode( body, columnType, model, colorProperty );

      // Add the content to the container.
      contentContainer.addChild( contentNode );

      // Observe when Bodies are added or removed from the Model, meaning the contentNode's visibility could change
      // if the body is added or removed from the system. It should only be visible if the body is in the Model.
      //REVIEW: This actually fails if we replace an element in the ObservableArray. elementAddedEmitter/elementRemovedEmitter
      //REVIEW: would in general be safer to listen to.
      model.bodies.lengthProperty.link( () => {
        contentNode.visible = model.bodies.includes( body );
      } );
    } );

    // Set the children of this Node to the correct rendering order.
    //REVIEW: StrictOmit<VBoxOptions, 'children'>
    options.children = [ LABEL_ALIGN_GROUP.createBox( labelNode ), contentContainer ];

    super( options );
  }

  private static createContentNode( body: Body, columnType: ValuesColumnTypes, model: CommonModel, colorProperty: TReadOnlyProperty<Color> ): AlignBox {
    // Flag that references the contentNode.
    let contentNode;

    const massRange = new RangeWithValue( 0.1, 300, 100 );
    const positionRangeX = new RangeWithValue( -4, 4, 0 );
    const positionRangeY = new RangeWithValue( -2, 2, 0 );
    const velocityRange = new RangeWithValue( -100, 100, 0 );

    const clearPathsCallback = () => {
      model.clearPaths();
    };

    // Create the contentNode based on the columnType.
    if ( columnType === ValuesColumnTypes.BODY_ICONS ) {
      contentNode = new ShadedSphereNode( 16, { mainColor: colorProperty, stroke: 'black' } );
    }
    else if ( columnType === ValuesColumnTypes.MASS_SLIDER ) {
      contentNode = new MySolarSystemSlider( body.massProperty, massRange, {
        thumbFill: colorProperty,
        thumbFillHighlighted: new DerivedProperty( [ colorProperty ], color => color.colorUtilsBrighter( 0.7 ) ),
        startDrag: () => { body.userControlledMassProperty.value = true; },
        endDrag: () => { body.userControlledMassProperty.value = false; },
        constrainValue: value => massRange.constrainValue( 5 * Utils.roundSymmetric( value / 5 ) )
      } );
    }
    else if ( columnType === ValuesColumnTypes.MASS ) {
      contentNode = new InteractiveNumberDisplay(
        body.massProperty,
        massRange,
        MySolarSystemStrings.units.kgStringProperty,
        body.userControlledMassProperty,
        body.colorProperty, model.isPlayingProperty, {
          useExponential: true,
          hideSmallValues: true
      } );
    }
    else if ( columnType === ValuesColumnTypes.POSITION_X ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.positionProperty, {
          reentrant: true,
          bidirectional: true,
          map: position => position.x * MySolarSystemConstants.POSITION_MULTIPLIER,
          inverseMap: ( x : number ) => new Vector2( x / MySolarSystemConstants.POSITION_MULTIPLIER, body.positionProperty.value.y )
        } ),
        positionRangeX,
        MySolarSystemStrings.units.AUStringProperty,
        body.userControlledPositionProperty,
        body.colorProperty, model.isPlayingProperty, {
          onEditCallback: clearPathsCallback
        }
      );
    }
    else if ( columnType === ValuesColumnTypes.POSITION_Y ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.positionProperty, {
          reentrant: true,
          bidirectional: true,
          map: position => position.y * MySolarSystemConstants.POSITION_MULTIPLIER,
          inverseMap: ( y : number ) => new Vector2( body.positionProperty.value.x, y / MySolarSystemConstants.POSITION_MULTIPLIER )
        } ),
        positionRangeY,
        MySolarSystemStrings.units.AUStringProperty,
        body.userControlledPositionProperty,
        body.colorProperty, model.isPlayingProperty, {
          onEditCallback: clearPathsCallback
        }
      );
    }
    else if ( columnType === ValuesColumnTypes.VELOCITY_X ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.velocityProperty, {
          reentrant: true,
          bidirectional: true,
          map: velocity => velocity.x * MySolarSystemConstants.VELOCITY_MULTIPLIER,
          inverseMap: ( x : number ) => new Vector2( x / MySolarSystemConstants.VELOCITY_MULTIPLIER, body.velocityProperty.value.y )
        } ),
        velocityRange,
        MySolarSystemStrings.units.kmsStringProperty,
        body.userControlledVelocityProperty,
        body.colorProperty, model.isPlayingProperty, {
          onEditCallback: clearPathsCallback
        }
      );
    }
    else if ( columnType === ValuesColumnTypes.VELOCITY_Y ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.velocityProperty, {
          reentrant: true,
          bidirectional: true,
          map: velocity => velocity.y * MySolarSystemConstants.VELOCITY_MULTIPLIER,
          inverseMap: ( y : number ) => new Vector2( body.velocityProperty.value.x, y / MySolarSystemConstants.VELOCITY_MULTIPLIER )
        } ),
        velocityRange,
        MySolarSystemStrings.units.kmsStringProperty,
        body.userControlledVelocityProperty,
        body.colorProperty, model.isPlayingProperty, {
          onEditCallback: clearPathsCallback
        }
      );
    }
    else {
      contentNode = new Node();
    }

    // Wrap the contentNode in a AlignBox to match the height of all ContentNodes.
    return CONTENT_ALIGN_GROUP.createBox( contentNode );
  }
}

mySolarSystem.register( 'ValuesColumnNode', ValuesColumnNode );
