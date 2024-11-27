// Copyright 2022-2023, University of Colorado Boulder

/**
 * The panel that shows the numeric values of Mass, Position and Velocity.
 * Depending on model.moreDataProperty it will show either NumberDisplays or mass sliders.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeypadDialog from '../../../../scenery-phet/js/keypad/KeypadDialog.js';
import { AlignGroup, HBox, Node, RichText, RichTextOptions, VBox } from '../../../../scenery/js/imports.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import ValuesColumnNode from './ValuesColumnNode.js';
import ValuesColumnTypes from './ValuesColumnTypes.js';

const COMPONENT_COLUMN_GROUP_ALIGN_GROUP = new AlignGroup( { matchHorizontal: true, matchVertical: false } );
const HBOX_SPACING = 12;

// AlignGroup for the title-labels that are placed above each group (like "Position (m)"). This is made to match the
// vertical height of each title-label across screens, regardless of their scaling.
const TITLE_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );
const TITLE_MAX_WIDTH = 150;

export default class ValuesPanel extends Panel {

  public constructor( model: MySolarSystemModel, moreDataVisibleProperty: BooleanProperty, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {

      // PanelOptions
      isDisposable: false,
      xMargin: 12,
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true,
      phetioDocumentation: 'Panel that contains controls for setting the values of body Properties',
      inputEnabledPropertyOptions: {
        phetioFeatured: true
      }
    } );

    // Keypad dialog that is shared by UI components that make up this panel
    const keypadDialog = new KeypadDialog( {
      useRichTextRange: true,
      keypadOptions: {
        accumulatorOptions: {

          // Max is 300, but we need 4 digits to support numbers like 123.4
          maxDigits: 5,
          maxDigitsRightOfMantissa: 2
        }
      },
      tandem: tandem.createTandem( 'keypadDialog' )
    } );

    // Parent tandems for each section
    const massSectionTandem = tandem.createTandem( 'massSection' );
    const positionSectionTandem = model.isLab ? tandem.createTandem( 'positionSection' ) : Tandem.OPT_OUT;
    const velocitySectionTandem = model.isLab ? tandem.createTandem( 'velocitySection' ) : Tandem.OPT_OUT;

    //----------------------------------------------------------------------------------------
    // Create columns of interactive UI components.

    const iconsColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.BODY_ICONS, keypadDialog, Tandem.OPT_OUT );
    const massColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.MASS, keypadDialog, massSectionTandem.createTandem( 'massColumn' ) );
    const massNumberControlColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.MASS_NUMBER_CONTROL, keypadDialog, massSectionTandem.createTandem( 'massNumberControlColumn' ) );
    const positionXColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.POSITION_X, keypadDialog, positionSectionTandem.createTandem( 'xColumn' ) );
    const positionYColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.POSITION_Y, keypadDialog, positionSectionTandem.createTandem( 'yColumn' ) );
    const velocityXColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.VELOCITY_X, keypadDialog, velocitySectionTandem.createTandem( 'VxColumn' ) );
    const velocityYColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.VELOCITY_Y, keypadDialog, velocitySectionTandem.createTandem( 'VyColumn' ) );

    // Put a wrapper around massNumberControlColumnNode, so that PhET-iO clients have independent control over the visibility
    // of sliders. Use a VBox so that we have dynamic layout.
    const massNumberControlColumnWrapper = new VBox( {
      children: [ massNumberControlColumnNode ],

      // In the Lab screen, the mass NumberControls are not visible when 'More Data' is selected.
      visibleProperty: new DerivedProperty( [ moreDataVisibleProperty ], moreDataVisible => !( moreDataVisible && model.isLab ) )
    } );

    const componentColumnsSpacing = 12;
    const positionColumnGroup = new HBox( {
      children: [ positionXColumnNode, positionYColumnNode ],
      spacing: componentColumnsSpacing
    } );
    const velocityColumnGroup = new HBox( {
      children: [ velocityXColumnNode, velocityYColumnNode ],
      spacing: componentColumnsSpacing
    } );

    //----------------------------------------------------------------------------------------
    // Create titles for each section

    const massTitleNode = model.isLab ?
                          createTitleText( MySolarSystemStrings.dataPanel.massStringProperty, MySolarSystemStrings.units.kgStringProperty ) :
                          TITLE_ALIGN_GROUP.createBox( new RichText( MySolarSystemStrings.massStringProperty,
                            combineOptions<RichTextOptions>( {}, SolarSystemCommonConstants.COLUMN_TITLE_OPTIONS, {
                              maxWidth: TITLE_MAX_WIDTH
                            } ) ) );
    const positionTitleNode = createTitleText( MySolarSystemStrings.dataPanel.positionStringProperty, SolarSystemCommonStrings.units.AUStringProperty );
    const velocityTitleNode = createTitleText( MySolarSystemStrings.dataPanel.velocityStringProperty, SolarSystemCommonStrings.units.kmsStringProperty );

    //----------------------------------------------------------------------------------------
    // Create the sections

    const massSectionNode = new HBox( {
      spacing: HBOX_SPACING,
      align: 'bottom',
      children: [
        createSectionNode( massTitleNode, massColumnNode, Tandem.OPT_OUT, false ),
        massNumberControlColumnWrapper
      ],
      tandem: massSectionTandem,
      phetioVisiblePropertyInstrumented: model.isLab, // only for the Lab screen
      visiblePropertyOptions: {
        phetioFeatured: model.isLab
      },
      phetioInputEnabledPropertyInstrumented: true, // to support disabling input for the entire section
      inputEnabledPropertyOptions: {
        phetioFeatured: true
      }
    } );

    const positionAndVelocitySectionsNode = new HBox( {
      spacing: HBOX_SPACING,
      align: 'bottom',
      children: [
        createSectionNode( positionTitleNode, positionColumnGroup, positionSectionTandem ),
        createSectionNode( velocityTitleNode, velocityColumnGroup, velocitySectionTandem )
      ],

      // Position and velocity sections are only visible when 'More Data' is selected.
      visibleProperty: moreDataVisibleProperty
    } );

    super( new HBox( {
      spacing: HBOX_SPACING,
      align: 'bottom',
      children: [
        iconsColumnNode,
        massSectionNode,
        positionAndVelocitySectionsNode
      ]
    } ), options );
  }
}

/**
 * Creates the title that appears above a section.
 */
function createTitleText( label: TReadOnlyProperty<string>, units: TReadOnlyProperty<string> ): Node {
  const titleStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.labelParenthesesUnitsStringProperty, {
    label: label,
    units: units
  } );

  // Wrap the text in an AlignGroup to match height.
  return TITLE_ALIGN_GROUP.createBox( new RichText( titleStringProperty,
    combineOptions<RichTextOptions>( {}, SolarSystemCommonConstants.COLUMN_TITLE_OPTIONS, {
      maxWidth: TITLE_MAX_WIDTH
    } ) ) );
}

/**
 * Creates a "section" of the Panel, which is one or more columns with a title above it.
 */
function createSectionNode( titleNode: Node, columnGroup: Node, tandem: Tandem, isComponentColumnGroup = true ): Node {
  return new VBox( {
    children: [
      titleNode,

      // If the group is a grouping of component columns, wrap the column group in an align group to match width.
      isComponentColumnGroup ? COMPONENT_COLUMN_GROUP_ALIGN_GROUP.createBox( columnGroup ) : columnGroup
    ],
    spacing: 0.5,
    tandem: tandem,
    phetioInputEnabledPropertyInstrumented: true, // to support disabling input for the entire section
    inputEnabledPropertyOptions: {
      phetioFeatured: true
    },
    phetioVisiblePropertyInstrumented: true,
    visiblePropertyOptions: {
      phetioFeatured: true
    }
  } );
}

mySolarSystem.register( 'ValuesPanel', ValuesPanel );