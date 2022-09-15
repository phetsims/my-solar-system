// Copyright 2022, University of Colorado Boulder

/**
 * The panel that shows the numeric values of Mass, Position and Velocity.
 * Depending on model.moreDataProperty it will show either NumberDisplays or mass sliders.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { AlignBox, AlignGroup, HBox, RichText, VBox } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ValuesColumnTypes from './ValuesColumnTypes.js';
import ValuesColumnNode from './ValuesColumnNode.js';
import CommonModel from '../model/CommonModel.js';

const COMPONENT_COLUMN_GROUP_ALIGN_GROUP = new AlignGroup( { matchHorizontal: true, matchVertical: false } );

// AlignGroup for the title-labels that are placed above each group (like "Position (m)"). This is made to match the
// vertical height of each title-label across screens, regardless of their scaling.
const TITLE_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );

type SelfOptions = {
  bodyIconColumnSpacing?: number;
  componentColumnsSpacing?: number;
  columnGroupSpacing?: number;
  titleLabelSpacing?: number;
};

export type FullDataPanelOptions = PanelOptions & SelfOptions;

export default class FullDataPanel extends Panel {
  public constructor( model: CommonModel, providedOptions?: FullDataPanelOptions ) {
    const options = optionize<FullDataPanelOptions, SelfOptions, PanelOptions>()(
      {
        bodyIconColumnSpacing: 12,   // {number} - x-spacing between the ball-icons and the first column.
        componentColumnsSpacing: 12, // {number} - x-spacing between the x and y components of NumberDisplay columns.
        columnGroupSpacing: 21,      // {number} - x-spacing between each group of columns.
        titleLabelSpacing: 0.5      // {number} - y-margin between the column groups and the title-labels above them.
      },
      providedOptions
    );

    //----------------------------------------------------------------------------------------
    // Create Values Columns for each ValuesColumnType available, for them to be later added to the panel
    const massColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.MASS );
    const massSliderColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.MASS_SLIDER );
    const positionXColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.POSITION_X );
    const positionYColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.POSITION_Y );
    const velocityXColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.VELOCITY_X );
    const velocityYColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.VELOCITY_Y );
    const ballIconsColumnNode = new ValuesColumnNode( model, ValuesColumnTypes.BODY_ICONS );

    const positionColumnGroup = new HBox( { children: [ positionXColumnNode, positionYColumnNode ], spacing: options.componentColumnsSpacing } );
    const velocityColumnGroup = new HBox( { children: [ velocityXColumnNode, velocityYColumnNode ], spacing: options.componentColumnsSpacing } );
    //----------------------------------------------------------------------------------------

    // Convenience function to create the title-label that appears above each column group.
    const createTitleLabel = ( label: TReadOnlyProperty<string>, units: TReadOnlyProperty<string> ) => {
      const titleString = StringUtils.fillIn( MySolarSystemStrings.pattern.labelParenthesesUnits, {
        label: label,
        units: units
      } );

      // Wrap the text in an AlignGroup to match height.
      return TITLE_ALIGN_GROUP.createBox( new RichText( titleString, { font: MySolarSystemConstants.TITLE_FONT } ) );
    };

    const massTitleNode = createTitleLabel( MySolarSystemStrings.dataPanel.MassStringProperty, MySolarSystemStrings.units.MjupStringProperty );
    const positionTitleNode = createTitleLabel( MySolarSystemStrings.dataPanel.PositionStringProperty, MySolarSystemStrings.units.AUStringProperty );
    const velocityTitleNode = createTitleLabel( MySolarSystemStrings.dataPanel.VelocityStringProperty, MySolarSystemStrings.units.kmsStringProperty );

    //----------------------------------------------------------------------------------------

    // Convenience function to create each section of the Panel, which includes the column group and a title above it.
    const createSectionNode = ( titleNode: AlignBox, columnGroup: HBox, isComponentColumnGroup = true ) => {
      return new VBox( {
        children: [
          titleNode,

          // If the group is a grouping of component columns, wrap the column group in an align group to match width.
          isComponentColumnGroup ? COMPONENT_COLUMN_GROUP_ALIGN_GROUP.createBox( columnGroup ) : columnGroup
        ],
        spacing: options.titleLabelSpacing
      } );
    };

    // Horizontally group the column groups with their respective title-labels.
    const massSectionNode = createSectionNode( massTitleNode, massColumnNode, false );
    const positionSectionNode = createSectionNode( positionTitleNode, positionColumnGroup );
    const velocitySectionNode = createSectionNode( velocityTitleNode, velocityColumnGroup );

    // The content of the entire Panel when "More Data" is checked.
    const moreDataBox = new HBox( {
      children: [
        positionSectionNode,
        velocitySectionNode
      ],
      align: 'bottom',
      spacing: options.columnGroupSpacing
    } );

    // The content of the entire Panel when "More Data" is not checked.
    const lessDataBox = new HBox( {
      children: [
        massSliderColumnNode
      ],
      align: 'bottom',
      spacing: options.columnGroupSpacing
    } );

    // Observe when the moreDataVisibleProperty changes and update the visibility of the content of the Panel.
    // Link is not removed since BallValuesPanels are never disposed.
    model.moreDataProperty.link( moreDataVisible => {
      moreDataBox.visible = moreDataVisible && model.isLab;
      lessDataBox.visible = !moreDataVisible || !model.isLab;
    } );

    super( new HBox( {
      spacing: options.bodyIconColumnSpacing,
      children: [ ballIconsColumnNode, massSectionNode, moreDataBox, lessDataBox ],
      align: 'bottom'
    } ), options );
    }
}

mySolarSystem.register( 'FullDataPanel', FullDataPanel );