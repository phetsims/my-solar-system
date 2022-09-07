// Copyright 2022, University of Colorado Boulder


//REVIEW: Sometimes there are extra blank lines above the top documentation and under the copyright header.
//REVIEW: Prefer just one blank line between the copyright header and the top documentation.
/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { HBox, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemStrings from '../../MySolarSystemStrings.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MySolarSystemGridNode from './MySolarSystemGridNode.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import CommonModel from '../model/CommonModel.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import MySolarSystemCheckbox from './MySolarSystemCheckbox.js';

// constants
const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const SPACING = 10;

type SelfOptions = EmptySelfOptions;

//REVIEW: These types should be exported, since it's the type of options the type expects. If we'd want to use this in
//REVIEW: another file, we'd have to change this here to export it, so it's good to proactively export them.
type VisibilityInformationOptions = SelfOptions & VBoxOptions;

//REVIEW: The "Information" suffix usually doesn't indicate a node/view to me. We'd usually use "Panel" or "Node" for that.
//REVIEW: "VisibilityControlNode" or "VisibilityInformationNode" / "VisibilityBox" or something might work better.
//REVIEW: thoughts?
//REVIEW: I've seen a lot of places where you export default at the class declaration. I think we should be consistent,
//REVIEW: so I'd prefer we export default in this location as well.
class VisibilityInformation extends VBox {

  public constructor( model: CommonModel, providedOptions?: VisibilityInformationOptions ) {

    const measuringTapeIcon = MeasuringTapeNode.createIcon( { scale: 0.3 } );

    const children = [
      new MySolarSystemCheckbox( model.gridVisibleProperty, new HBox( {
        spacing: 10,
        children: [
          new Text( MySolarSystemStrings.gridStringProperty, TEXT_OPTIONS ),
          //REVIEW: Usually prefer Vector2.ZERO to new Vector2( 0, 0 ) - it's a bit easier, and doesn't create a new vector
          new MySolarSystemGridNode( new Property( ModelViewTransform2.createIdentity() ), 10, new Vector2( 0, 0 ), 1, {
            stroke: MySolarSystemColors.gridIconStrokeColorProperty,
            lineWidth: 1.5
          } )
        ]
      } ) ),
      new MySolarSystemCheckbox( model.measuringTapeVisibleProperty, new HBox( {
        spacing: 10,
        children: [
          new Text( MySolarSystemStrings.measuringTapeStringProperty, TEXT_OPTIONS ),
          measuringTapeIcon
        ]
      } ) ),
      //REVIEW: Is this HBox here for consistency? This HBox probably doesn't need to exist
      new MySolarSystemCheckbox( model.valuesVisibleProperty, new HBox( {
        spacing: 10,
        children: [
          new Text( MySolarSystemStrings.valuesStringProperty, TEXT_OPTIONS )
        ]
      } ) )
    ];

    super( optionize<VisibilityInformationOptions, SelfOptions, VBox>()( {
      children: children,
      //REVIEW: SPACING is used once here, consider using the constant above, or inlining it (OR having a constant
      //REVIEW: in the constants file).
      spacing: SPACING,
      align: 'left',
      stretch: true
    }, providedOptions ) );
  }
}

mySolarSystem.register( 'VisibilityInformation', VisibilityInformation );
export default VisibilityInformation;