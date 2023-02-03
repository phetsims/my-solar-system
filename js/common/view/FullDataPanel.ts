// Copyright 2022-2023, University of Colorado Boulder

/**
 * The panel that shows the numeric values of Mass, Position and Velocity.
 * Depending on model.moreDataProperty it will show either NumberDisplays or mass sliders.
 * 
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import { AlignBox, AlignGroup, HBox, RichText, VBox, Node, Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ValuesColumnTypes from './ValuesColumnTypes.js';
import ValuesColumnNode from './ValuesColumnNode.js';
import CommonModel from '../model/CommonModel.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const COMPONENT_COLUMN_GROUP_ALIGN_GROUP = new AlignGroup( { matchHorizontal: true, matchVertical: false } );

// AlignGroup for the title-labels that are placed above each group (like "Position (m)"). This is made to match the
// vertical height of each title-label across screens, regardless of their scaling.
const TITLE_ALIGN_GROUP = new AlignGroup( { matchHorizontal: false, matchVertical: true } );

type SelfOptions = {
  //REVIEW: I don't see this option ever being used, can it be removed?
  bodyIconColumnSpacing?: number;

  //REVIEW: I don't see this option ever being used, can it be removed?
  componentColumnsSpacing?: number;

  //REVIEW: I don't see this option ever being used, can it be removed?
  columnGroupSpacing?: number;

  //REVIEW: I don't see this option ever being used, can it be removed?
  titleLabelSpacing?: number;
};

export type FullDataPanelOptions = PanelOptions & SelfOptions;

export default class FullDataPanel extends Panel {
  public constructor( model: CommonModel, providedOptions?: FullDataPanelOptions ) {
    const options = optionize<FullDataPanelOptions, SelfOptions, PanelOptions>()( {
      bodyIconColumnSpacing: 12,   // {number} - x-spacing between the ball-icons and the first column.
      componentColumnsSpacing: 12, // {number} - x-spacing between the x and y components of NumberDisplay columns.
      columnGroupSpacing: 21,      // {number} - x-spacing between each group of columns.
      titleLabelSpacing: 0.5,      // {number} - y-margin between the column groups and the title-labels above them.

      fill: '#f0f0f0',

      xMargin: 12
    }, providedOptions );

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
    const createTitleLabel = ( label: TReadOnlyProperty<string>, units: TReadOnlyProperty<string>, useUnits: TReadOnlyProperty<boolean> | boolean = true ) => {
      const titleStringProperty = new PatternStringProperty( MySolarSystemStrings.pattern.labelParenthesesUnitsStringProperty, {
        label: label,
        units: units
      } );

      // Wrap the text in an AlignGroup to match height.
      return TITLE_ALIGN_GROUP.createBox( new RichText( titleStringProperty, {
        font: MySolarSystemConstants.TITLE_FONT,
        maxWidth: 135
      } ) );
    };

    const massTitleWithoutUnits = TITLE_ALIGN_GROUP.createBox( new Text( MySolarSystemStrings.massStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      maxWidth: 200
    } ) );
    const massTitleWithUnits = createTitleLabel( MySolarSystemStrings.dataPanel.MassStringProperty, MySolarSystemStrings.units.kgStringProperty );
    const massTitleNode = model.isLab ? massTitleWithUnits : massTitleWithoutUnits;

    //REVIEW: This capitalization of things is throwing me off. Why is the "Position" capitalized?
    const positionTitleNode = createTitleLabel( MySolarSystemStrings.dataPanel.PositionStringProperty, MySolarSystemStrings.units.AUStringProperty );
    const velocityTitleNode = createTitleLabel( MySolarSystemStrings.dataPanel.VelocityStringProperty, MySolarSystemStrings.units.kmsStringProperty );

    //----------------------------------------------------------------------------------------

    // Convenience function to create each section of the Panel, which includes the column group and a title above it.
    const createSectionNode = ( titleNode: AlignBox, columnGroup: Node, isComponentColumnGroup = true ) => {
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
      bottom: 0,
      spacing: options.columnGroupSpacing
    } );

    // The content of the entire Panel when "More Data" is not checked.
    const lessDataBox = new HBox( {
      //REVIEW: Why an HBox with one child? Can't we just skip it
      children: [
        massSliderColumnNode
      ],
      bottom: 0,
      grow: 1,
      spacing: options.columnGroupSpacing
    } );

    moreDataBox.boundsProperty.link( bounds => {
      lessDataBox.preferredWidth = bounds.width;
    } );

    // Observe when the moreDataVisibleProperty changes and update the visibility of the content of the Panel.
    // Link is not removed since BallValuesPanels are never disposed.
    model.moreDataProperty.link( moreDataVisible => {
      moreDataBox.visible = moreDataVisible && model.isLab;
      lessDataBox.visible = !moreDataVisible || !model.isLab;
    } );

    const dataNode = new Node( {
      children: [
        moreDataBox,
        lessDataBox
      ]
    } );

    super( new HBox( {
      spacing: options.bodyIconColumnSpacing,
      children: [ ballIconsColumnNode, massSectionNode, dataNode ],
      align: 'bottom'
    } ), options );
  }
}

mySolarSystem.register( 'FullDataPanel', FullDataPanel );