// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author {{AUTHOR}}
 */

import mySolarSystem from '../../mySolarSystem.js';
import LabModel from '../model/LabModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CommonScreenView, { CommonScreenViewOptions } from '../../common/view/CommonScreenView.js';

type SelfOptions = {
 //TODO add options that are specific to LabScreenView here
};

type LabScreenViewOptions = SelfOptions & CommonScreenViewOptions;

class LabScreenView extends CommonScreenView {

  constructor( model: LabModel, providedOptions: LabScreenViewOptions ) {

    const options = optionize<LabScreenViewOptions, SelfOptions, CommonScreenViewOptions>()( {
      tandem: providedOptions.tandem
    }, providedOptions );

    super( model, options );
  }
}

mySolarSystem.register( 'LabScreenView', LabScreenView );
export default LabScreenView;