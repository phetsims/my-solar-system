// Copyright 2021-2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { colorProfileProperty, HBox, Image, SceneryConstants, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import pathIcon_png from '../../../images/pathIcon_png.js';
import pathIconProjector_png from '../../../images/pathIconProjector_png.js';
import mySolarSystem from '../../mySolarSystem.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MySolarSystemModel from '../../my-solar-system/model/MySolarSystemModel.js';

const gravityForceString = mySolarSystemStrings.gravityForce;
const gridString = mySolarSystemStrings.grid;
const massString = mySolarSystemStrings.mass;
const pathString = mySolarSystemStrings.path;
const velocityString = mySolarSystemStrings.velocity;

// constants
const FONT = new PhetFont( 18 );
const ARROW_Y_COORDINATE = -10;
const CHECKBOX_OPTIONS = {
  scale: 0.8,
  checkboxColor: MySolarSystemColors.foregroundProperty,
  checkboxColorBackground: MySolarSystemColors.backgroundProperty
};
const TEXT_OPTIONS = {
  font: FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const SPACING = 10;

const HBOX_OPTIONS = {
  maxWidth: 240,
  spacing: SPACING
};

type CheckboxPanelSelfOptions = {};

type CheckboxPanelOptions = CheckboxPanelSelfOptions & VBoxOptions;

class CheckboxPanel extends VBox {

  constructor( model: MySolarSystemModel, providedOptions?: CheckboxPanelOptions ) {

    const children = [];
    const options = merge( { tandem: Tandem.OPTIONAL }, providedOptions ) as Required<CheckboxPanelOptions>;

    const gravityForceTextNode = new Text( gravityForceString, TEXT_OPTIONS );
    const velocityTextNode = new Text( velocityString, TEXT_OPTIONS );
    const massTextNode = new Text( massString, TEXT_OPTIONS );
    const pathTextNode = new Text( pathString, TEXT_OPTIONS );
    const gridTextNode = new Text( gridString, TEXT_OPTIONS );
    const optionsWithTandem = ( tandemName: string ) => merge( { tandem: options.tandem.createTandem( tandemName ) }, CHECKBOX_OPTIONS );

    // gravity force checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          gravityForceTextNode,
          new ArrowNode( 135, ARROW_Y_COORDINATE, 180, ARROW_Y_COORDINATE, { fill: '#4380C2' } )
        ]
      }, HBOX_OPTIONS ) ),
      model.gravityVisibleProperty, optionsWithTandem( 'gravityForceCheckbox' ) ) );

    // velocity checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          velocityTextNode,
          new ArrowNode( 95, ARROW_Y_COORDINATE, 140, ARROW_Y_COORDINATE, { fill: PhetColorScheme.VELOCITY } )
        ]
      }, HBOX_OPTIONS ) ),
      model.velocityVisibleProperty, optionsWithTandem( 'velocityCheckbox' ) ) );

    // mass checkbox
    if ( model.centerOfMassVisibleProperty ) {
      children.push( new Checkbox( new HBox( merge( {
          children: [
            massTextNode
          ]
        }, HBOX_OPTIONS ) ),
        model.centerOfMassVisibleProperty, optionsWithTandem( 'massCheckbox' ) ) );
    }

    const pathIconImageNode = new Image( pathIcon_png, { scale: 0.25 } );
    colorProfileProperty.lazyLink( ( profileName: any ) => {
      assert && assert( profileName === SceneryConstants.DEFAULT_COLOR_PROFILE || profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE );
      pathIconImageNode.setImage( profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE ? pathIconProjector_png : pathIcon_png );
    } );

    // path checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          pathTextNode,
          pathIconImageNode
        ]
      }, HBOX_OPTIONS ) ),
      model.pathVisibleProperty, optionsWithTandem( 'pathCheckbox' ) ) );

    // grid checkbox
    children.push( new Checkbox( new HBox( merge( {
        children: [
          gridTextNode
          // new mySolarSystemGridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
          //     stroke: MySolarSystemColors.gridIconStrokeColorProperty,
          //     lineWidth: 1.5
          // } )
        ]
      }, HBOX_OPTIONS ) ),
      model.gridVisibleProperty, optionsWithTandem( 'gridCheckbox' ) ) );

    // increase the touch area of the checkboxes
    const touchAreaHeight = 32;
    for ( let i = 0; i < children.length; i++ ) {
      const checkboxNode = children[ i ];
      const bounds = checkboxNode.parentToLocalBounds( checkboxNode.bounds );
      // @ts-ignore
      checkboxNode.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
    }

    super( optionize<CheckboxPanelOptions, CheckboxPanelSelfOptions, VBoxOptions>()( {
      excludeInvisibleChildrenFromBounds: true,
      children: children,
      spacing: SPACING,
      align: 'left',
      bottom: -12,
      tandem: Tandem.REQUIRED
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'CheckboxPanel', CheckboxPanel );
export default CheckboxPanel;