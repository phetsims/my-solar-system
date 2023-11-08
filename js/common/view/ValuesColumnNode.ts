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
import Range from '../../../../dot/js/Range.js';
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
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

const LABEL_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );
const CONTENT_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );
const MASS_SLIDER_STEP = SolarSystemCommonConstants.MASS_SLIDER_STEP;

const POSITION_X_RANGE = new Range( -8, 8 );
const POSITION_Y_RANGE = new Range( -4, 4 );
const VELOCITY_RANGE = new Range( -100, 100 );

const MASS_DECIMAL_PLACES = 1;
const POSITION_DECIMAL_PLACES = 2;
const VELOCITY_DECIMAL_PLACES = 2;

export default class ValuesColumnNode extends VBox {
  public constructor( model: MySolarSystemModel, columnType: ValuesColumnTypes, keypadDialog: KeypadDialog, tandem: Tandem ) {

    const titleStringProperty =
      columnType === ValuesColumnTypes.POSITION_X ? MySolarSystemStrings.dataPanel.XStringProperty :
      columnType === ValuesColumnTypes.POSITION_Y ? MySolarSystemStrings.dataPanel.YStringProperty :
      columnType === ValuesColumnTypes.VELOCITY_X ? MySolarSystemStrings.dataPanel.VxStringProperty :
      columnType === ValuesColumnTypes.VELOCITY_Y ? MySolarSystemStrings.dataPanel.VyStringProperty :
      ''; // ValuesColumnTypes.BODY_ICONS has no title

    // Title for the column
    const titleText = new RichText( titleStringProperty,
      combineOptions<RichTextOptions>( {}, SolarSystemCommonConstants.COLUMN_TITLE_OPTIONS, {
        maxWidth: 60
      } ) );

    // UI components for each Body, arranged in a column
    const uiComponents = new VBox( {
      children: model.bodies.map( body => ValuesColumnNode.createUIComponent( body, model, columnType, keypadDialog, tandem ) ),
      spacing: 3.5,
      stretch: true
    } );

    super( {
      isDisposable: false,
      children: [ LABEL_ALIGN_GROUP.createBox( titleText ), uiComponents ],
      stretch: true,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: ( columnType === ValuesColumnTypes.MASS_NUMBER_CONTROL ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );
  }

  /**
   * Creates a UI component for editing some Property of Body.
   */
  private static createUIComponent( body: Body, model: MySolarSystemModel, columnType: ValuesColumnTypes,
                                    keypadDialog: KeypadDialog, parentTandem: Tandem ): AlignBox {

    let uiComponent: Node;

    // Our minimum for the mass is larger than the body's minimum massProperty value
    const MASS_RANGE = new Range( 0.1, body.massProperty.range.max );

    const clearPathsCallback = () => model.clearPaths();

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

      uiComponent = new Node( { children: [ ballCircle, indexText ] } );
    }
    else if ( columnType === ValuesColumnTypes.MASS_NUMBER_CONTROL ) {
      uiComponent = new SolarSystemCommonNumberControl( body.massProperty, MASS_RANGE, {
        sliderOptions: {
          keyboardStep: MASS_SLIDER_STEP,
          pageKeyboardStep: 2 * MASS_SLIDER_STEP,
          thumbFill: body.colorProperty,
          thumbFillHighlighted: new DerivedProperty( [ body.colorProperty ], color => color.colorUtilsBrighter( 0.7 ) ),
          constrainValue: value => MASS_RANGE.constrainValue( MASS_SLIDER_STEP * Utils.roundSymmetric( value / MASS_SLIDER_STEP ) )
        },
        startCallback: () => { body.userIsControllingMassProperty.value = true; },
        endCallback: () => { body.userIsControllingMassProperty.value = false; },
        arrowButtonOptions: {
          fireOnDown: true
        },
        tandem: parentTandem.createTandem( `mass${body.index}NumberControl` ),
        phetioFeatured: true,
        phetioVisiblePropertyInstrumented: false
      } );
      uiComponent.addLinkedElement( body.massProperty );
    }
    else if ( columnType === ValuesColumnTypes.MASS ) {
      uiComponent = new InteractiveNumberDisplay(
        body.massProperty,
        MASS_RANGE,
        MASS_DECIMAL_PLACES,
        MySolarSystemStrings.units.kgStringProperty,
        body.userIsControllingMassProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          useExponential: true,
          minDisplayedValue: 0.1,
          tandem: parentTandem.createTandem( `mass${body.index}Display` )
        } );
      uiComponent.addLinkedElement( body.massProperty );
    }
    else if ( columnType === ValuesColumnTypes.POSITION_X ) {

      const positionXMappedProperty = new MappedProperty( body.positionProperty, {
        phetioValueType: NumberIO,
        reentrant: true,
        bidirectional: true,
        map: position => position.x,
        inverseMap: ( x: number ) => new Vector2( x, body.positionProperty.value.y ),
        tandem: parentTandem.createTandem( `positionX${body.index}MappedProperty` )
      } );

      uiComponent = new InteractiveNumberDisplay(
        positionXMappedProperty,
        POSITION_X_RANGE,
        POSITION_DECIMAL_PLACES,
        SolarSystemCommonStrings.units.AUStringProperty,
        body.userIsControllingPositionProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          onEditCallback: clearPathsCallback,
          tandem: parentTandem.createTandem( `x${body.index}Display` )
        }
      );
      uiComponent.addLinkedElement( body.positionProperty );
    }
    else if ( columnType === ValuesColumnTypes.POSITION_Y ) {

      const positionYMappedProperty = new MappedProperty( body.positionProperty, {
        phetioValueType: NumberIO,
        reentrant: true,
        bidirectional: true,
        map: position => position.y,
        inverseMap: ( y: number ) => new Vector2( body.positionProperty.value.x, y ),
        tandem: parentTandem.createTandem( `positionY${body.index}MappedProperty` )
      } );

      uiComponent = new InteractiveNumberDisplay(
        positionYMappedProperty,
        POSITION_Y_RANGE,
        POSITION_DECIMAL_PLACES,
        SolarSystemCommonStrings.units.AUStringProperty,
        body.userIsControllingPositionProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          onEditCallback: clearPathsCallback,
          tandem: parentTandem.createTandem( `y${body.index}Display` )
        }
      );
      uiComponent.addLinkedElement( body.positionProperty );
    }
    else if ( columnType === ValuesColumnTypes.VELOCITY_X ) {

      const velocityXMappedProperty = new MappedProperty( body.velocityProperty, {
        phetioValueType: NumberIO,
        reentrant: true,
        bidirectional: true,
        map: velocity => velocity.x,
        inverseMap: ( x: number ) => new Vector2( x, body.velocityProperty.value.y ),
        tandem: parentTandem.createTandem( `velocityX${body.index}MappedProperty` )
      } );

      uiComponent = new InteractiveNumberDisplay(
        velocityXMappedProperty,
        VELOCITY_RANGE,
        VELOCITY_DECIMAL_PLACES,
        SolarSystemCommonStrings.units.kmsStringProperty,
        body.userIsControllingVelocityProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          onEditCallback: clearPathsCallback,
          tandem: parentTandem.createTandem( `Vx${body.index}Display` )
        }
      );
      uiComponent.addLinkedElement( body.velocityProperty );
    }
    else if ( columnType === ValuesColumnTypes.VELOCITY_Y ) {

      const velocityYMappedProperty = new MappedProperty( body.velocityProperty, {
        phetioValueType: NumberIO,
        reentrant: true,
        bidirectional: true,
        map: velocity => velocity.y,
        inverseMap: ( y: number ) => new Vector2( body.velocityProperty.value.x, y ),
        tandem: parentTandem.createTandem( `velocityY${body.index}MappedProperty` )
      } );

      uiComponent = new InteractiveNumberDisplay(
        velocityYMappedProperty,
        VELOCITY_RANGE,
        VELOCITY_DECIMAL_PLACES,
        SolarSystemCommonStrings.units.kmsStringProperty,
        body.userIsControllingVelocityProperty,
        body.colorProperty,
        model.isPlayingProperty,
        keypadDialog,
        {
          onEditCallback: clearPathsCallback,
          tandem: parentTandem.createTandem( `Vy${body.index}Display` )
        }
      );
      uiComponent.addLinkedElement( body.velocityProperty );
    }
    else {
      assert && assert( false, `unsupported ValuesColumnTypes: ${columnType}` );
      uiComponent = new Node(); // allow the sim to continue running if assertions are disabled
    }

    // Wrap the uiComponent in a AlignBox to match the height of all ContentNodes.
    return CONTENT_ALIGN_GROUP.createBox( uiComponent, {
      visibleProperty: body.isActiveProperty // visible when the Body is active
    } );
  }
}

mySolarSystem.register( 'ValuesColumnNode', ValuesColumnNode );
