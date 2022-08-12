// Copyright 2022, University of Colorado Boulder

/**
 * Controls time in MySolarSystem
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import TimeControlNode, { TimeControlNodeOptions } from '../../../../scenery-phet/js/TimeControlNode.js';
import RestartButton from '../../../../scenery-phet/js/buttons/RestartButton.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MySolarSystemColors from '../MySolarSystemColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import CommonModel from '../model/CommonModel.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 34;
const STEP_BUTTON_RADIUS = 23;
const PUSH_BUTTON_SPACING = 8;

type SelfOptions = {
  restartListener: () => void;
  stepForwardListener: () => void;
};

type MySolarSystemTimeControlNodeOptions = SelfOptions & TimeControlNodeOptions & PickRequired<TimeControlNodeOptions, 'tandem'>;

class MySolarSystemTimeControlNode extends TimeControlNode {
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
      speedRadioButtonGroupOnLeft: false,
      speedRadioButtonGroupOptions: {
        labelOptions: {
          font: new PhetFont( 20 ),
          fill: MySolarSystemColors.foregroundProperty,
          maxWidth: 200
        }
      },
      tandem: providedOptions.tandem
    }, providedOptions );

    super( model.isPlayingProperty, options );

    const restartButton = new RestartButton( {
      enabled: true,
      radius: STEP_BUTTON_RADIUS,
      xMargin: 9.5,
      yMargin: 9.5,
      listener: options.restartListener,
      center: this.getPlayPauseButtonCenter().minusXY( PLAY_PAUSE_BUTTON_RADIUS + STEP_BUTTON_RADIUS + PUSH_BUTTON_SPACING, 0 ),
      tandem: providedOptions.tandem.createTandem( 'restartButton' )
    } );
    this.addChild( restartButton );
  }
}

mySolarSystem.register( 'MySolarSystemTimeControlNode', MySolarSystemTimeControlNode );
export default MySolarSystemTimeControlNode;