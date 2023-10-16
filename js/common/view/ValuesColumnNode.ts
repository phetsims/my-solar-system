// Copyright 2022-2023, University of Colorado Boulder

/**
 * Generates the information column for values depending on the type of Value used.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { AlignBox, AlignGroup, Circle, Color, Node, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import KeypadDialog from '../../../../scenery-phet/js/keypad/KeypadDialog.js';

const LABEL_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );
const CONTENT_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );
const MASS_SLIDER_STEP = SolarSystemCommonConstants.MASS_SLIDER_STEP;

const MASS_RANGE = new RangeWithValue( 0.1, 300, 100 );
const POSITION_X_RANGE = new RangeWithValue( -8, 8, 0 );
const POSITION_Y_RANGE = new RangeWithValue( -4, 4, 0 );
const VELOCITY_RANGE = new RangeWithValue( -100, 100, 0 );

const MASS_DECIMAL_PLACES = 1;
const POSITION_DECIMAL_PLACES = 2;
const VELOCITY_DECIMAL_PLACES = 2;

export default class ValuesColumnNode extends VBox {
  public constructor( model: MySolarSystemModel, columnType: ValuesColumnTypes, keypadDialog: KeypadDialog, tandem: Tandem ) {

    const labelStringProperty =
      columnType === ValuesColumnTypes.POSITION_X ? MySolarSystemStrings.dataPanel.XStringProperty :
      columnType === ValuesColumnTypes.POSITION_Y ? MySolarSystemStrings.dataPanel.YStringProperty :
      columnType === ValuesColumnTypes.VELOCITY_X ? MySolarSystemStrings.dataPanel.VxStringProperty :
      columnType === ValuesColumnTypes.VELOCITY_Y ? MySolarSystemStrings.dataPanel.VyStringProperty :
      ''; // ValuesColumnTypes.BODY_ICONS

    const labelNode = new RichText( labelStringProperty,
      combineOptions<RichTextOptions>( {}, SolarSystemCommonConstants.COLUMN_TITLE_OPTIONS, {
        maxWidth: 60
      } ) );

    // Create content for each Body.
    const contentChildren = model.bodies.map( body => ValuesColumnNode.createContentNode( body, columnType, model, keypadDialog, tandem ) );

    // Arrange the content for each Body in a vertical column.
    const contentContainer = new VBox( {
      children: contentChildren,
      spacing: 3.5,
      stretch: true
    } );

    super( {
      children: [ LABEL_ALIGN_GROUP.createBox( labelNode ), contentContainer ],
      stretch: true,
      tandem: tandem
    } );
  }

  private static createContentNode( body: Body, columnType: ValuesColumnTypes, model: MySolarSystemModel,
                                    keypadDialog: KeypadDialog, parentTandem: Tandem ): AlignBox {

    // Flag that references the contentNode.
    let contentNode;

    const clearPathsCallback = () => {
      model.clearPaths();
    };

    // Create the contentNode based on the columnType.
    if ( columnType === ValuesColumnTypes.BODY_ICONS ) {

      // Circle representation of the Body.
      const ballCircle = new Circle( 10.5, {
        fill: body.colorProperty,
        stroke: Color.BLACK
      } );

      // Labels the index of the Body
      const indexText = new Text( body.index, {
        font: new PhetFont( { size: 18, weight: 600 } ),
        center: ballCircle.center,
        stroke: Color.BLACK,
        fill: Color.WHITE
      } );

      contentNode = new Node( { children: [ ballCircle, indexText ] } );
    }
    else if ( columnType === ValuesColumnTypes.MASS_SLIDER ) {
      contentNode = new SolarSystemCommonNumberControl( body.massProperty, MASS_RANGE, {
        sliderOptions: {
          keyboardStep: MASS_SLIDER_STEP,
          pageKeyboardStep: 2 * MASS_SLIDER_STEP,
          thumbFill: body.colorProperty,
          thumbFillHighlighted: new DerivedProperty( [ body.colorProperty ], color => color.colorUtilsBrighter( 0.7 ) ),
          constrainValue: value => MASS_RANGE.constrainValue( MASS_SLIDER_STEP * Utils.roundSymmetric( value / MASS_SLIDER_STEP ) )
        },
        startCallback: () => { body.userControlledMassProperty.value = true; },
        endCallback: () => { body.userControlledMassProperty.value = false; },
        arrowButtonOptions: {
          fireOnDown: true
        },
        tandem: parentTandem.createTandem( `mass${body.index}NumberControl` ),
        phetioVisiblePropertyInstrumented: false
      } );
    }
    else if ( columnType === ValuesColumnTypes.MASS ) {
      contentNode = new InteractiveNumberDisplay(
        body.massProperty,
        MASS_RANGE,
        MASS_DECIMAL_PLACES,
        MySolarSystemStrings.units.kgStringProperty,
        body.userControlledMassProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          useExponential: true,
          hideSmallValues: true,
          tandem: parentTandem.createTandem( `mass${body.index}Display` )
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
        POSITION_X_RANGE,
        POSITION_DECIMAL_PLACES,
        SolarSystemCommonStrings.units.AUStringProperty,
        body.userControlledPositionProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          onEditCallback: clearPathsCallback,
          tandem: parentTandem.createTandem( `x${body.index}Display` )
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
        POSITION_Y_RANGE,
        POSITION_DECIMAL_PLACES,
        SolarSystemCommonStrings.units.AUStringProperty,
        body.userControlledPositionProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          onEditCallback: clearPathsCallback,
          tandem: parentTandem.createTandem( `y${body.index}Display` )
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
        VELOCITY_RANGE,
        VELOCITY_DECIMAL_PLACES,
        SolarSystemCommonStrings.units.kmsStringProperty,
        body.userControlledVelocityProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          onEditCallback: clearPathsCallback,
          tandem: parentTandem.createTandem( `vx${body.index}Display` )
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
        VELOCITY_RANGE,
        VELOCITY_DECIMAL_PLACES,
        SolarSystemCommonStrings.units.kmsStringProperty,
        body.userControlledVelocityProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          onEditCallback: clearPathsCallback,
          tandem: parentTandem.createTandem( `vy${body.index}Display` )
        }
      );
    }
    else {
      //TODO https://github.com/phetsims/my-solar-system/issues/237 this should throw an Error
      contentNode = new Node();
    }

    // Wrap the contentNode in a AlignBox to match the height of all ContentNodes.
    return CONTENT_ALIGN_GROUP.createBox( contentNode, {
      visibleProperty: body.isActiveProperty // visible when the Body is active
    } );
  }
}

mySolarSystem.register( 'ValuesColumnNode', ValuesColumnNode );
