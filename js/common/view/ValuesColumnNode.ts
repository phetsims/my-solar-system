// Copyright 2022-2023, University of Colorado Boulder

/**
 * Generates the information column for values depending on the type of Value used.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { AlignBox, AlignGroup, Circle, Color, Node, RichText, Text, TextOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import ValuesColumnTypes from './ValuesColumnTypes.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import SolarSystemCommonNumberControl from '../../../../solar-system-common/js/view/SolarSystemCommonNumberControl.js';
import Body from '../../../../solar-system-common/js/model/Body.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MappedProperty from '../../../../axon/js/MappedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import InteractiveNumberDisplay from './InteractiveNumberDisplay.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const LABEL_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );
const CONTENT_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );

type SelfOptions = {
  contentContainerSpacing?: number;
  labelSpacing?: number;
};

export type ValuesColumnNodeOptions = SelfOptions & StrictOmit<VBoxOptions, 'children'>;

export default class ValuesColumnNode extends VBox {
  public constructor( model: MySolarSystemModel, columnType: ValuesColumnTypes, providedOptions?: ValuesColumnNodeOptions ) {
    const options = optionize<ValuesColumnNodeOptions, SelfOptions, VBoxOptions>()( {
      contentContainerSpacing: 3.5,
      labelSpacing: 3,
      stretch: true
    }, providedOptions );

    const labelString = columnType === ValuesColumnTypes.POSITION_X ? MySolarSystemStrings.dataPanel.XStringProperty :
                        columnType === ValuesColumnTypes.POSITION_Y ? MySolarSystemStrings.dataPanel.YStringProperty :
                        columnType === ValuesColumnTypes.VELOCITY_X ? MySolarSystemStrings.dataPanel.VxStringProperty :
                        columnType === ValuesColumnTypes.VELOCITY_Y ? MySolarSystemStrings.dataPanel.VyStringProperty :
                        '';

    const labelNode = new RichText( labelString, combineOptions<TextOptions>( {
      maxWidth: 60
    }, SolarSystemCommonConstants.TEXT_OPTIONS ) );

    // Create the VBox container for the contentNodes of the column.
    const contentContainer = new VBox( { spacing: options.contentContainerSpacing, stretch: true } );

    // Loop through each possible Body and create the corresponding contentNode. These Bodies are NOT necessarily the
    // active bodies, so we are responsible for updating visibility based on whether it is
    // the system.
    model.availableBodies.forEach( body => {

      // Retrieve the color from the colors palette
      const colorProperty = body.colorProperty;

      // Create the corresponding contentNode for each available body.
      const contentNode = ValuesColumnNode.createContentNode( body, columnType, model, colorProperty );

      // Add the content to the container.
      contentContainer.addChild( contentNode );

      // Observe when Bodies are added or removed from the Model, meaning the contentNode's visibility could change
      // if the body is added or removed from the system. It should only be visible if the body is in the Model.
      const onBodiesChanged = () => {
        contentNode.visible = model.bodies.includes( body );
      };
      onBodiesChanged();
      model.bodies.elementAddedEmitter.addListener( onBodiesChanged );
      model.bodies.elementRemovedEmitter.addListener( onBodiesChanged );
    } );

    // Set the children of this Node to the correct rendering order.
    options.children = [ LABEL_ALIGN_GROUP.createBox( labelNode ), contentContainer ];

    super( options );
  }

  private static createContentNode( body: Body, columnType: ValuesColumnTypes, model: MySolarSystemModel, colorProperty: TReadOnlyProperty<Color> ): AlignBox {

    // Flag that references the contentNode.
    let contentNode;

    const massRange = new RangeWithValue( 0.1, 300, 100 );
    const positionRangeX = new RangeWithValue( -8, 8, 0 );
    const positionRangeY = new RangeWithValue( -4, 4, 0 );
    const velocityRange = new RangeWithValue( -100, 100, 0 );

    const clearPathsCallback = () => {
      model.clearPaths();
    };

    const sliderStep = SolarSystemCommonConstants.SLIDER_STEP;

    // Create the contentNode based on the columnType.
    if ( columnType === ValuesColumnTypes.BODY_ICONS ) {

      // Circle representation of the Body.
      const ballCircle = new Circle( 10.5, {
        fill: colorProperty,
        stroke: Color.BLACK
      } );

      // Labels the index of the Body
      const labelNode = new Text( body.index + 1, {
        font: new PhetFont( { size: 18, weight: 600 } ),
        center: ballCircle.center,
        stroke: Color.BLACK,
        fill: Color.WHITE
      } );

      contentNode = new Node( { children: [ ballCircle, labelNode ] } );
    }
    else if ( columnType === ValuesColumnTypes.MASS_SLIDER ) {
      contentNode = new SolarSystemCommonNumberControl( body.massProperty, massRange, {
        sliderOptions: {
          keyboardStep: sliderStep,
          pageKeyboardStep: sliderStep * 2,
          thumbFill: colorProperty,
          thumbFillHighlighted: new DerivedProperty( [ colorProperty ], color => color.colorUtilsBrighter( 0.7 ) ),
          constrainValue: value => massRange.constrainValue( sliderStep * Utils.roundSymmetric( value / sliderStep ) )
        },
        startCallback: () => { body.userControlledMassProperty.value = true; },
        endCallback: () => { body.userControlledMassProperty.value = false; },
        arrowButtonOptions: {
          fireOnDown: true
        }
      } );
    }
    else if ( columnType === ValuesColumnTypes.MASS ) {
      contentNode = new InteractiveNumberDisplay(
        body.massProperty,
        massRange,
        MySolarSystemStrings.units.kgStringProperty,
        body.userControlledMassProperty,
        body.colorProperty, model.isPlayingProperty, 1, {
          useExponential: true,
          hideSmallValues: true
        } );
    }
    else if ( columnType === ValuesColumnTypes.POSITION_X ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.positionProperty, {
          reentrant: true,
          bidirectional: true,
          map: position => position.x * SolarSystemCommonConstants.POSITION_MULTIPLIER,
          inverseMap: ( x: number ) => new Vector2( x / SolarSystemCommonConstants.POSITION_MULTIPLIER, body.positionProperty.value.y )
        } ),
        positionRangeX,
        SolarSystemCommonStrings.units.AUStringProperty,
        body.userControlledPositionProperty,
        body.colorProperty, model.isPlayingProperty, 2, {
          onEditCallback: clearPathsCallback
        }
      );
    }
    else if ( columnType === ValuesColumnTypes.POSITION_Y ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.positionProperty, {
          reentrant: true,
          bidirectional: true,
          map: position => position.y * SolarSystemCommonConstants.POSITION_MULTIPLIER,
          inverseMap: ( y: number ) => new Vector2( body.positionProperty.value.x, y / SolarSystemCommonConstants.POSITION_MULTIPLIER )
        } ),
        positionRangeY,
        SolarSystemCommonStrings.units.AUStringProperty,
        body.userControlledPositionProperty,
        body.colorProperty, model.isPlayingProperty, 2, {
          onEditCallback: clearPathsCallback
        }
      );
    }
    else if ( columnType === ValuesColumnTypes.VELOCITY_X ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.velocityProperty, {
          reentrant: true,
          bidirectional: true,
          map: velocity => velocity.x * SolarSystemCommonConstants.VELOCITY_MULTIPLIER,
          inverseMap: ( x: number ) => new Vector2( x / SolarSystemCommonConstants.VELOCITY_MULTIPLIER, body.velocityProperty.value.y )
        } ),
        velocityRange,
        SolarSystemCommonStrings.units.kmsStringProperty,
        body.userControlledVelocityProperty,
        body.colorProperty, model.isPlayingProperty, 2, {
          onEditCallback: clearPathsCallback
        }
      );
    }
    else if ( columnType === ValuesColumnTypes.VELOCITY_Y ) {
      contentNode = new InteractiveNumberDisplay(
        new MappedProperty( body.velocityProperty, {
          reentrant: true,
          bidirectional: true,
          map: velocity => velocity.y * SolarSystemCommonConstants.VELOCITY_MULTIPLIER,
          inverseMap: ( y: number ) => new Vector2( body.velocityProperty.value.x, y / SolarSystemCommonConstants.VELOCITY_MULTIPLIER )
        } ),
        velocityRange,
        SolarSystemCommonStrings.units.kmsStringProperty,
        body.userControlledVelocityProperty,
        body.colorProperty, model.isPlayingProperty, 2, {
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
