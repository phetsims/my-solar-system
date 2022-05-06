// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
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
import IntroModel from '../../intro/model/IntroModel.js';
import MySolarSystemGridNode from './MySolarSystemGridNode.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const pathString = mySolarSystemStrings.path;
const gridString = mySolarSystemStrings.grid;
const massString = mySolarSystemStrings.mass;

// constants
const FONT = new PhetFont( 18 );
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
  //REVIEW: Why a maxWidth here? Looks good to get rid of that
  maxWidth: 240,
  spacing: SPACING
};

//REVIEW: We decided to always just call these `SelfOptions`
type CheckboxNodeSelfOptions = {};

type CheckboxNodeOptions = CheckboxNodeSelfOptions & VBoxOptions;

//REVIEW: If you want, run the Sun demo, look to the 4th screen (Layout) and go to the checkboxes with icons example.
//REVIEW: Relevant code is https://github.com/phetsims/sun/blob/dcc2b0ea89c31559a3db6c579fd308d0ce080515/js/demo/LayoutScreenView.ts#L174-L221
//REVIEW: That's my recommendation on how to handle this case

//REVIEW: The naming "CheckboxNode" makes it sound like it's a single Checkbox. I'd recommend a more informative name
//REVIEW: (and one that provides more information than just "checkboxes").
class CheckboxNode extends VBox {

  constructor( model: IntroModel, providedOptions?: CheckboxNodeOptions ) {

    const children = [];
    //REVIEW: optionize, and then a cast won't be needed. `optionize<CheckboxNodeOptions, SelfOptions, VBoxOptions>()( ... )`
    const options = merge( { tandem: Tandem.OPTIONAL }, providedOptions ) as Required<CheckboxNodeOptions>;

    //REVIEW: These are used only in one place, I'd recommend inlining them
    const massTextNode = new Text( massString, TEXT_OPTIONS );
    const pathTextNode = new Text( pathString, TEXT_OPTIONS );
    const gridTextNode = new Text( gridString, TEXT_OPTIONS );
    //REVIEW: optionize here
    const optionsWithTandem = ( tandemName: string ) => merge( { tandem: options.tandem.createTandem( tandemName ) }, CHECKBOX_OPTIONS );

    const pathIconImageNode = new Image( pathIcon_png, { scale: 0.25 } );
    //REVIEW: profileName will be a string. Shouldn't be typed as any.
    colorProfileProperty.lazyLink( ( profileName: any ) => {
      //REVIEW: recommend NOT having an assertion here. Use the main icon usually, UNLESS it is the "projector" color
      //REVIEW: profile. Projector colors here are inversed, and most colors won't be.
      //REVIEW: Extra credit: instead link to the background color of whatever it's over, see if it's "darkish" or
      //REVIEW: "lightish", and pick the contrasting color-based image.
      assert && assert( profileName === SceneryConstants.DEFAULT_COLOR_PROFILE || profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE );
      pathIconImageNode.setImage( profileName === SceneryConstants.PROJECTOR_COLOR_PROFILE ? pathIconProjector_png : pathIcon_png );
    } );

    // path checkbox
    //REVIEW: optionize should be used instead of merge. likely `optionize3<HBoxOptions, {}, HBoxOptions>()( {}, HBOX_OPTIONS, { ... } )
    //REVIEW: However to factor out just spacing... that seems excessive. Have SPACING be a constant if desired, and just
    //REVIEW: use it in each place?
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
          gridTextNode,
          new MySolarSystemGridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
              stroke: MySolarSystemColors.gridIconStrokeColorProperty,
              lineWidth: 1.5
          } )
        ]
      }, HBOX_OPTIONS ) ),
      model.gridVisibleProperty, optionsWithTandem( 'gridCheckbox' ) ) );

    // mass checkbox
    if ( model.centerOfMassVisibleProperty ) {
      children.push( new Checkbox( new HBox( merge( {
          children: [
            massTextNode
          ]
        }, HBOX_OPTIONS ) ),
        model.centerOfMassVisibleProperty, optionsWithTandem( 'massCheckbox' ) ) );
    }

    // increase the touch area of the checkboxes
    //REVIEW: Typically we'll do `children.forEach( child => ... )` instead of a simple for loop, when performance is
    //REVIEW: not critical.
    const touchAreaHeight = 32;
    for ( let i = 0; i < children.length; i++ ) {
      const checkboxNode = children[ i ];
      const bounds = checkboxNode.parentToLocalBounds( checkboxNode.bounds );
      //REVIEW: Why is this ts-ignore here? It's not erroring on my copy
      // @ts-ignore
      checkboxNode.touchArea = Shape.rectangle( -5, bounds.centerY - touchAreaHeight / 2, bounds.width + 10, touchAreaHeight );
    }

    super( optionize<CheckboxNodeOptions, CheckboxNodeSelfOptions, VBoxOptions>()( {
      //REVIEW: This is the default value for VBox, and thus shouldn't be included here
      excludeInvisibleChildrenFromBounds: true,
      children: children,
      spacing: SPACING,
      align: 'left',
      //REVIEW: Usually we don't put positioning like this in this location. Perhaps we can discuss where this came from?
      bottom: -12,
      tandem: Tandem.REQUIRED
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'CheckboxNode', CheckboxNode );
export default CheckboxNode;