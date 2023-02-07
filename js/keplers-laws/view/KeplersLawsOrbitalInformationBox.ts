// Copyright 2022-2023, University of Colorado Boulder

/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { AlignBox, HBox, HBoxOptions, Image, Node, Path, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import XNode from '../../../../scenery-phet/js/XNode.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import semiaxisIcon_png from '../../../images/semiaxisIcon_png.js';
import eccentricityIcon_png from '../../../images/eccentricityIcon_png.js';
import fociIcon_png from '../../../images/fociIcon_png.js';
import stringsIcon_png from '../../../images/stringsIcon_png.js';

// Const
const ICON_OPTIONS = {
  scale: 0.38
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

    const getCheckboxOptions = ( name: string, options: CheckboxOptions = {} ) => {
      return combineOptions<CheckboxOptions>( options, MySolarSystemConstants.CHECKBOX_OPTIONS, {
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
          new Text( text, MySolarSystemConstants.TEXT_OPTIONS ),
          icon
        ],
        spacing: 10
      } ), getCheckboxOptions( tandemName, options ) );
    };

    const firstLawChildren = [
      createCheckbox(
        model.fociVisibleProperty,
        MySolarSystemStrings.fociStringProperty,
        'fociVisibleCheckbox',
        new Image( fociIcon_png, ICON_OPTIONS )
      ),
      new AlignBox(
        createCheckbox(
          model.stringsVisibleProperty,
          MySolarSystemStrings.stringsStringProperty,
          'stringsVisibleCheckbox',
          new Image( stringsIcon_png, ICON_OPTIONS ),
          {
            enabledProperty: model.fociVisibleProperty
          }
        ), {
          leftMargin: 20,
          layoutOptions: { stretch: true }
        } ),
      createCheckbox(
        model.axisVisibleProperty,
        MySolarSystemStrings.axisStringProperty,
        'axisVisibleCheckbox',
        axisIconImageNode
      ),
      new AlignBox(
        createCheckbox(
          model.semiaxisVisibleProperty,
          MySolarSystemStrings.semiaxisStringProperty,
          'semiAxisVisibleCheckbox',
          new Image( semiaxisIcon_png, ICON_OPTIONS ),
          {
            enabledProperty: model.axisVisibleProperty
          }
        ), {
          leftMargin: 20,
          layoutOptions: { stretch: true }
        } ),
      new AlignBox(
        createCheckbox(
          model.eccentricityVisibleProperty,
          MySolarSystemStrings.eccentricityStringProperty,
          'eccentricityVisibleCheckbox',
          new Image( eccentricityIcon_png, ICON_OPTIONS ),
          {
            enabledProperty: model.axisVisibleProperty
          }
        ), {
          leftMargin: 20,
          layoutOptions: { stretch: true }
        } )
    ];

    const secondLawChildren = [
      createCheckbox(
        model.apoapsisVisibleProperty,
        MySolarSystemStrings.apoapsisStringProperty,
        'apoapsisVisibleCheckbox',
        new XNode( {
          fill: MySolarSystemColors.secondBodyColorProperty,
          stroke: MySolarSystemColors.foregroundProperty,
          scale: 0.5
        } )
      ),
      createCheckbox(
        model.periapsisVisibleProperty,
        MySolarSystemStrings.periapsisStringProperty,
        'periapsisVisibleCheckbox',
        new XNode( {
          fill: 'gold',
          stroke: MySolarSystemColors.foregroundProperty,
          scale: 0.5
        } )
      )
    ];

    const thirdLawChildren = [
      createCheckbox(
        model.semiMajorAxisVisibleProperty,
        MySolarSystemStrings.graph.aStringProperty,
        'semiMajorAxisVisibleCheckbox'
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

    model.lawUpdatedEmitter.addListener( () => {
      this.children = [
        ...( model.isFirstLawProperty.value ? firstLawChildren :
             model.isSecondLawProperty.value ? secondLawChildren :
             model.isThirdLawProperty.value ? thirdLawChildren : [] )
      ];
    } );

    model.lawUpdatedEmitter.emit();
  }
}

mySolarSystem.register( 'KeplersLawsOrbitalInformationBox', KeplersLawsOrbitalInformationBox );
export default KeplersLawsOrbitalInformationBox;