// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { Node, Text, VBox, VBoxOptions, VDivider } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IntroModel from '../../intro/model/IntroModel.js';
import mySolarSystem from '../../mySolarSystem.js';
import LabModes from '../model/LabModes.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';
import ArrowsCheckboxNode from './ArrowsCheckboxNode.js';
import OrbitalInformation from './OrbitalInformation.js';
import VisibilityInformation from './VisibilityInformation.js';

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.PANEL_FONT
};

/**
 * The possible pre-sets for the lab are:
    Sun and planet
    Sun, planet, moon
    Sun, planet, comet
    Trojan asteroid 
    Ellipses
    Hyperbolic
    Slingshot
    Double Slingshot
    Binary star, planet 
    Four-star ballet
    Double double
    Custom
 */

type SelfOptions = {
  tandem: Tandem;
};

type MySolarSystemControlsOptions = SelfOptions & VBoxOptions;

export default class MySolarSystemControls extends VBox {

  constructor(
    model: IntroModel,
    topLayer: Node,
    providedOptions?: MySolarSystemControlsOptions
    ) {
    super( {
      children: [
        ...( model.isLab ? [ new ComboBox( [
          new ComboBoxItem( new Text( 'Sun and Planet', TEXT_OPTIONS ), LabModes.SUN_PLANET ),
          new ComboBoxItem( new Text( 'Sun, Planet and Moon', TEXT_OPTIONS ), LabModes.SUN_PLANET_MOON ),
          new ComboBoxItem( new Text( 'Sun, Planet and Comet', TEXT_OPTIONS ), LabModes.SUN_PLANET_COMET ),
          new ComboBoxItem( new Text( 'Trojan Asteroids', TEXT_OPTIONS ), LabModes.TROJAN_ASTEROIDS ),
          new ComboBoxItem( new Text( 'Ellipses', TEXT_OPTIONS ), LabModes.ELLIPSES ),
          new ComboBoxItem( new Text( 'Hyperbolic', TEXT_OPTIONS ), LabModes.HYPERBOLIC ),
          new ComboBoxItem( new Text( 'Slingshot', TEXT_OPTIONS ), LabModes.SLINGSHOT ),
          new ComboBoxItem( new Text( 'Double Slingshot', TEXT_OPTIONS ), LabModes.DOUBLE_SLINGSHOT ),
          new ComboBoxItem( new Text( 'Binary Star, Planet', TEXT_OPTIONS ), LabModes.BINARY_STAR_PLANET ),
          new ComboBoxItem( new Text( 'Four Star Ballet', TEXT_OPTIONS ), LabModes.FOUR_STAR_BALLET ),
          new ComboBoxItem( new Text( 'Double Double', TEXT_OPTIONS ), LabModes.DOUBLE_DOUBLE ),
          new ComboBoxItem( new Text( 'Custom', TEXT_OPTIONS ), LabModes.CUSTOM )
        ], model.labModeProperty, topLayer ) ] : [] ),
        new OrbitalInformation( model ),
        new VDivider( MySolarSystemConstants.VDIVIDER_OPTIONS ),
        new ArrowsCheckboxNode( model ),
        new VDivider( MySolarSystemConstants.VDIVIDER_OPTIONS ),
        new VisibilityInformation( model )
      ],
      spacing: 4,
      align: 'left',
      stretch: true
    } );
  }

}

mySolarSystem.register( 'MySolarSystemControls', MySolarSystemControls );