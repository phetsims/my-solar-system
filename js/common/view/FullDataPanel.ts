// Copyright 2022-2023, University of Colorado Boulder

/**
 * The panel that shows the numeric values of Mass, Position and Velocity.
 * Depending on model.moreDataProperty it will show either NumberDisplays or mass sliders.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import { AlignBox, AlignGroup, HBox, Node, RichText, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
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

const COMPONENT_COLUMN_GROUP_ALIGN_GROUP = new AlignGroup( { matchHorizontal: true, matchVertical: false } );

// AlignGroup for the title-labels that are placed above each group (like "Position (m)"). This is made to match the
// vertical height of each title-label across screens, regardless of their scaling.
const TITLE_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );
const TEXT_MAX_WIDTH = 150;

export default class FullDataPanel extends Panel {
  public constructor( model: MySolarSystemModel ) {
    const options = {
      xMargin: 12,
      stroke: null,
      fill: SolarSystemCommonColors.controlPanelFillProperty
    };

    //----------------------------------------------------------------------------------------
    // Create Values Columns for each ValuesColumnType available, for them to be later added to the panel
    const massColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.MASS );
    const massSliderColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.MASS_SLIDER );
    const positionXColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.POSITION_X );
    const positionYColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.POSITION_Y );
    const velocityXColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.VELOCITY_X );
    const velocityYColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.VELOCITY_Y );
    const ballIconsColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.BODY_ICONS );

    const componentColumnsSpacing = 12;
    const positionColumnGroup = new HBox( { children: [ positionXColumnNode, positionYColumnNode ], spacing: componentColumnsSpacing } );
    const velocityColumnGroup = new HBox( { children: [ velocityXColumnNode, velocityYColumnNode ], spacing: componentColumnsSpacing } );
    //----------------------------------------------------------------------------------------

    // Convenience function to create the title-label that appears above each column group.
    const createTitleLabel = ( label: TReadOnlyProperty<string>, units: TReadOnlyProperty<string>, useUnits: TReadOnlyProperty<boolean> | boolean = true ) => {
      const titleStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.labelParenthesesUnitsStringProperty, {
        label: label,
        units: units
      } );

      // Wrap the text in an AlignGroup to match height.
      return TITLE_ALIGN_GROUP.createBox( new RichText( titleStringProperty,
        combineOptions<TextOptions>( {
          maxWidth: TEXT_MAX_WIDTH
        }, SolarSystemCommonConstants.TEXT_OPTIONS ) ) );
    };

    const massTitleWithoutUnits = TITLE_ALIGN_GROUP.createBox( new Text( MySolarSystemStrings.massStringProperty,
      combineOptions<TextOptions>( {
        maxWidth: TEXT_MAX_WIDTH
      }, SolarSystemCommonConstants.TEXT_OPTIONS ) ) );
    const massTitleWithUnits = createTitleLabel( MySolarSystemStrings.dataPanel.massStringProperty, MySolarSystemStrings.units.kgStringProperty );
    const massTitleNode = model.isLab ? massTitleWithUnits : massTitleWithoutUnits;
    const positionTitleNode = createTitleLabel( MySolarSystemStrings.dataPanel.positionStringProperty, SolarSystemCommonStrings.units.AUStringProperty );
    const velocityTitleNode = createTitleLabel( MySolarSystemStrings.dataPanel.velocityStringProperty, SolarSystemCommonStrings.units.kmsStringProperty );

    //----------------------------------------------------------------------------------------

    // Convenience function to create each section of the Panel, which includes the column group and a title above it.
    const createSectionNode = ( titleNode: AlignBox, columnGroup: Node, isComponentColumnGroup = true ) => {
      return new VBox( {
        children: [
          titleNode,

          // If the group is a grouping of component columns, wrap the column group in an align group to match width.
          isComponentColumnGroup ? COMPONENT_COLUMN_GROUP_ALIGN_GROUP.createBox( columnGroup ) : columnGroup
        ],
        spacing: 0.5
      } );
    };

    // Horizontally group the column groups with their respective title-labels.
    const massSectionNode = createSectionNode( massTitleNode, massColumnNode, false );
    const positionSectionNode = createSectionNode( positionTitleNode, positionColumnGroup );
    const velocitySectionNode = createSectionNode( velocityTitleNode, velocityColumnGroup );

    const columnGroupSpacing = 21;

    // The content of the entire Panel when "More Data" is checked.
    const moreDataBox = new HBox( {
      children: [
        positionSectionNode,
        velocitySectionNode
      ],
      bottom: 0,
      spacing: columnGroupSpacing
    } );

    // The content of the entire Panel when "More Data" is not checked.
    const lessDataBox = massSliderColumnNode;
    lessDataBox.bottom = 0;

    moreDataBox.boundsProperty.link( bounds => {
      lessDataBox.preferredWidth = bounds.width;
    } );

    // Observe when the moreDataVisibleProperty changes and update the visibility of the content of the Panel.
    // Link is not removed since BallValuesPanels are never disposed.
    model.moreDataProperty.link( moreDataVisible => {
      moreDataBox.visible = moreDataVisible && model.isLab;
      lessDataBox.visible = !moreDataVisible || !model.isLab;
    } );

    const dataNode = new HBox( {
      align: 'bottom',
      children: [
        moreDataBox,
        lessDataBox
      ]
    } );

    super( new HBox( {
      spacing: 12,
      children: [ ballIconsColumnNode, massSectionNode, dataNode ],
      align: 'bottom'
    } ), options );
  }
}

mySolarSystem.register( 'FullDataPanel', FullDataPanel );