// Copyright 2022-2023, University of Colorado Boulder

/**
 * The panel that shows the numeric values of Mass, Position and Velocity.
 * Depending on model.moreDataProperty it will show either NumberDisplays or mass sliders.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import { AlignGroup, HBox, Node, RichText, RichTextOptions, VBox } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Panel from '../../../../sun/js/Panel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ValuesColumnTypes from './ValuesColumnTypes.js';
import ValuesColumnNode from './ValuesColumnNode.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import KeypadDialog from '../../../../scenery-phet/js/keypad/KeypadDialog.js';

const COMPONENT_COLUMN_GROUP_ALIGN_GROUP = new AlignGroup( { matchHorizontal: true, matchVertical: false } );

// AlignGroup for the title-labels that are placed above each group (like "Position (m)"). This is made to match the
// vertical height of each title-label across screens, regardless of their scaling.
const TITLE_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );
const TITLE_MAX_WIDTH = 150;

export default class ValuesPanel extends Panel {

  public constructor( model: MySolarSystemModel, tandem: Tandem ) {

    const options = {

      // PanelOptions
      xMargin: 12,
      stroke: null,
      fill: SolarSystemCommonColors.controlPanelFillProperty,
      tandem: tandem
    };

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
    const positionSectionTandem = tandem.createTandem( 'positionSection' );
    const velocitySectionTandem = tandem.createTandem( 'velocitySection' );

    //----------------------------------------------------------------------------------------
    // Create Values Columns for each ValuesColumnType available, for them to be later added to the panel
    const ballIconsColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.BODY_ICONS, keypadDialog, tandem.createTandem( 'iconsColumn' ) );
    const massColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.MASS, keypadDialog, massSectionTandem.createTandem( 'massColumn' ) );
    const massSliderColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.MASS_SLIDER, keypadDialog, massSectionTandem.createTandem( 'massSliderColumn' ) );
    const positionXColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.POSITION_X, keypadDialog, positionSectionTandem.createTandem( 'xColumn' ) );
    const positionYColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.POSITION_Y, keypadDialog, positionSectionTandem.createTandem( 'yColumn' ) );
    const velocityXColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.VELOCITY_X, keypadDialog, velocitySectionTandem.createTandem( 'VxColumn' ) );
    const velocityYColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.VELOCITY_Y, keypadDialog, velocitySectionTandem.createTandem( 'VyColumn' ) );

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

    const massSectionNode = createSectionNode( massTitleNode, massColumnNode, massSectionTandem, false );
    const positionSectionNode = createSectionNode( positionTitleNode, positionColumnGroup, positionSectionTandem );
    const velocitySectionNode = createSectionNode( velocityTitleNode, velocityColumnGroup, velocitySectionTandem );

    // Observe when the moreDataVisibleProperty changes and update the visibility of the content of the Panel.
    // Link is not removed since BallValuesPanels are never disposed.
    model.moreDataProperty.link( moreDataVisible => {
      massSliderColumnNode.visible = !( moreDataVisible && model.isLab );
      positionSectionNode.visible = moreDataVisible && model.isLab;
      velocitySectionNode.visible = moreDataVisible && model.isLab;
    } );

    super( new HBox( {
      spacing: 12,
      children: [
        ballIconsColumnNode,
        massSectionNode,
        massSliderColumnNode,
        positionSectionNode,
        velocitySectionNode
      ],
      align: 'bottom'
    } ), options );
  }
}

/**
 * Creates the title that appears above a section.
 */
function createTitleText( label: TReadOnlyProperty<string>, units: TReadOnlyProperty<string>, useUnits: TReadOnlyProperty<boolean> | boolean = true ): Node {
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
    tandem: tandem
  } );
}

mySolarSystem.register( 'ValuesPanel', ValuesPanel );