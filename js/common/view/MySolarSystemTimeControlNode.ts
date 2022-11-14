// Copyright 2022, University of Colorado Boulder

/**
 * Controls time in MySolarSystem
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import TimeControlNode, { TimeControlNodeOptions } from '../../../../scenery-phet/js/TimeControlNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CommonModel from '../model/CommonModel.js';
import MySolarSystemConstants from '../MySolarSystemConstants.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 34;
const STEP_BUTTON_RADIUS = 23;
const PUSH_BUTTON_SPACING = 8;

type SelfOptions = {
  restartListener: () => void;
  stepForwardListener: () => void;
};

export type MySolarSystemTimeControlNodeOptions = SelfOptions & TimeControlNodeOptions & PickRequired<TimeControlNodeOptions, 'tandem'>;

export default class MySolarSystemTimeControlNode extends TimeControlNode {
  public constructor(
    model: CommonModel,
    providedOptions: MySolarSystemTimeControlNodeOptions
  ) {

    const options = optionize<MySolarSystemTimeControlNodeOptions, SelfOptions, TimeControlNodeOptions>()( {
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: [ TimeSpeed.FAST, TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      playPauseStepButtonOptions: {
        playPauseStepXSpacing: PUSH_BUTTON_SPACING,
        playPauseButtonOptions: {
          radius: PLAY_PAUSE_BUTTON_RADIUS
        },
        stepForwardButtonOptions: {
          radius: STEP_BUTTON_RADIUS,
          listener: providedOptions.stepForwardListener
        }
      },
      buttonGroupXSpacing: 20,
      speedRadioButtonGroupOnLeft: false,
      speedRadioButtonGroupOptions: {
        labelOptions: {
          font: MySolarSystemConstants.PANEL_FONT,
          fill: MySolarSystemColors.foregroundProperty,
          maxWidth: 70
        },
        touchAreaXDilation: 10
      }
    }, providedOptions );

    super( model.isPlayingProperty, options );
  }
}

mySolarSystem.register( 'MySolarSystemTimeControlNode', MySolarSystemTimeControlNode );