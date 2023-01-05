// Copyright 2022, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Font, HBox, HBoxOptions, Node, Path, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import LawMode from '../model/LawMode.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dialog from '../../../../sun/js/Dialog.js';
import { Shape } from '../../../../kite/js/imports.js';

// constants
const CHECKBOX_OPTIONS = {
  boxWidth: 14,
  checkboxColor: MySolarSystemColors.foregroundProperty,
  checkboxColorBackground: MySolarSystemColors.backgroundProperty
};
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const TITLE_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

type SelfOptions = EmptySelfOptions;

export type KeplersLawsOrbitalInformationOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

class KeplersLawsOrbitalInformationBox extends VBox {

  public constructor( model: KeplersLawsModel, providedOptions: KeplersLawsOrbitalInformationOptions ) {

    // Draw an Ellipse with minor and major axis
    const axisShape = new Shape().moveTo( 0, 0 ).ellipse( 0, 0, 10, 5, 0 );
    axisShape.moveTo( -10, 0 ).lineTo( 10, 0 );
    axisShape.moveTo( 0, -5 ).lineTo( 0, 5 );

     const axisIconImageNode = new Path(
       axisShape, {
       stroke: MySolarSystemColors.foregroundProperty,
       lineWidth: 1
     } );

    const dialog = new Dialog( new Node(), {
      titleAlign: 'center',
      title: new Text( 'Title', { font: new Font( { size: 32 } ) } ),
      tandem: providedOptions.tandem.createTandem( 'unitsDialog' )
    } );

    const getCheckboxOptions = ( name: string ) => {
      return combineOptions<CheckboxOptions>( {}, CHECKBOX_OPTIONS, {
        tandem: providedOptions.tandem.createTandem( name )
      } );
    };

    const createCheckbox = (
      property: LinkableProperty<boolean>,
      text: TReadOnlyProperty<string>,
      tandemName: string,
      icon: Node = new Node(),
      options?: CheckboxOptions
    ) => {
      return new Checkbox( property, new HBox( {
        children: [
          new Text( text, TEXT_OPTIONS ),
          icon
        ],
        spacing: 10
      } ), getCheckboxOptions( tandemName ) );
    };

    const orbitalInformationNode = new HBox( {
      spacing: 10,
      children: [
        new Text( MySolarSystemStrings.orbitalStringProperty, TITLE_OPTIONS ),
        new InfoButton( {
          scale: 0.5,
          iconFill: 'rgb( 41, 106, 163 )',
          listener: () => dialog.show(),
          tandem: providedOptions.tandem.createTandem( 'keplerInfoButton' )
        } )
      ]
    } );

    const secondLawChildren = [
      createCheckbox(
        model.axisVisibleProperty,
        MySolarSystemStrings.axisStringProperty,
        'axisVisibleCheckbox',
        axisIconImageNode
        ),
      createCheckbox(
        model.apoapsisVisibleProperty,
        MySolarSystemStrings.apoapsisStringProperty,
        'apoapsisVisibleCheckbox',
        new XNode( {
          fill: 'cyan',
          stroke: 'white',
          scale: 0.5
        } )
      ),
      createCheckbox(
        model.periapsisVisibleProperty,
        MySolarSystemStrings.periapsisStringProperty,
        'periapsisVisibleCheckbox',
        new XNode( {
          fill: 'gold',
          stroke: 'white',
          scale: 0.5
        } )
      )
    ];

    const thirdLawChildren = [
      createCheckbox(
        model.semimajorAxisVisibleProperty,
        MySolarSystemStrings.graph.aStringProperty,
        'semimajorAxisVisibleCheckbox'
        // axisIconImageNode TODO
      ),
      createCheckbox(
        model.periodVisibleProperty,
        MySolarSystemStrings.graph.tStringProperty,
        'periodVisibleCheckbox'
        // periodIconImageNode TODO
      )
      ];

    super( optionize<KeplersLawsOrbitalInformationOptions, SelfOptions, HBoxOptions>()( {
      spacing: 5,
      align: 'left',
      stretch: true
    }, providedOptions ) );

    model.selectedLawProperty.link( law => {
      this.children = [
        orbitalInformationNode,
        // TODO: Add first law children here
        ...( law === LawMode.THIRD_LAW ? thirdLawChildren : secondLawChildren )
      ];
    } );
  }
}

mySolarSystem.register( 'KeplersLawsOrbitalInformationBox', KeplersLawsOrbitalInformationBox );
export default KeplersLawsOrbitalInformationBox;