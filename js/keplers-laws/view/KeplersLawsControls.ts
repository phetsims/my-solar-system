// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { FlowBox, Node, Text, VDivider } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import ArrowsCheckboxNode from '../../common/view/ArrowsCheckboxNode.js';
import VisibilityInformation from '../../common/view/VisibilityInformation.js';
import mySolarSystem from '../../mySolarSystem.js';
import mySolarSystemStrings from '../../mySolarSystemStrings.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsOrbitalInformation from './KeplersLawsOrbitalInformation.js';

const orbitalInformationString = mySolarSystemStrings.orbital;

const TEXT_OPTIONS = {
  font: MySolarSystemConstants.TITLE_FONT,
  fill: MySolarSystemColors.foregroundProperty
};

const VDIVIDER_OPTIONS = {
  lineWidth: 2,
  stroke: MySolarSystemConstants.CONTROL_PANEL_STROKE,
  layoutOptions: {
    yMargin: 5
  }
};

type SelfOptions = {
  tandem: Tandem;
};

type KeplersLawsControlsOptions = SelfOptions & PanelOptions;

class KeplersLawsControls extends Panel {

  constructor(
    model: KeplersLawsModel,
    topLayer: Node,
    providedOptions?: KeplersLawsControlsOptions
    ) {
    super( new FlowBox( {
      children: [
        new Text( orbitalInformationString, TEXT_OPTIONS ),
        new KeplersLawsOrbitalInformation( model ),
        new VDivider( VDIVIDER_OPTIONS ),
        new ArrowsCheckboxNode( model ),
        new VDivider( VDIVIDER_OPTIONS ),
        new VisibilityInformation( model )
      ],
      spacing: 4,
      align: 'left',
      stretch: true,
      orientation: 'vertical'
    } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );
  }

}

mySolarSystem.register( 'KeplersLawsControls', KeplersLawsControls );
export default KeplersLawsControls;