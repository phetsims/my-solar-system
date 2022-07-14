// Copyright 2022, University of Colorado Boulder


/**
 * Visual representation of space object's property checkbox.
 *
 * @author Agustín Vallejo
 */

import { VBox, VDivider } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import ArrowsCheckboxNode from '../../common/view/ArrowsCheckboxNode.js';
import VisibilityInformation from '../../common/view/VisibilityInformation.js';
import mySolarSystem from '../../mySolarSystem.js';
import KeplersLawsModel from '../model/KeplersLawsModel.js';
import KeplersLawsOrbitalInformation from './KeplersLawsOrbitalInformation.js';

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

  public constructor(
    model: KeplersLawsModel,
    providedOptions?: KeplersLawsControlsOptions
  ) {
    super( new VBox( {
      children: [
        new KeplersLawsOrbitalInformation( model ),
        new VDivider( VDIVIDER_OPTIONS ),
        new ArrowsCheckboxNode( model ),
        new VDivider( VDIVIDER_OPTIONS ),
        new VisibilityInformation( model )
        ],
        spacing: 4,
        align: 'left',
        stretch: true
      } ), MySolarSystemConstants.CONTROL_PANEL_OPTIONS );
  }

}

mySolarSystem.register( 'KeplersLawsControls', KeplersLawsControls );
export default KeplersLawsControls;