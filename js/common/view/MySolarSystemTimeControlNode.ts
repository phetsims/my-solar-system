// Copyright 2021-2022, University of Colorado Boulder

/**
 * Controls time in MySolarSystem
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import TimeControlNode, { TimeControlNodeOptions } from '../../../../scenery-phet/js/TimeControlNode.js';
import RestartButton from '../../../../scenery-phet/js/buttons/RestartButton.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MySolarSystemModel from '../../my-solar-system/model/MySolarSystemModel.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MySolarSystemColors from '../MySolarSystemColors.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 34;
const STEP_BUTTON_RADIUS = 23;
const PUSH_BUTTON_SPACING = 8;

type SelfOptions = {};

type MySolarSystemListener = () => void;

type MySolarSystemTimeControlNodeOptions = SelfOptions & PickRequired<TimeControlNodeOptions, 'tandem'>;

class MySolarSystemTimeControlNode extends TimeControlNode {
  constructor(
    model: MySolarSystemModel,
    restartListener: MySolarSystemListener,
    stepForwardListener: MySolarSystemListener,
    providedOptions: MySolarSystemTimeControlNodeOptions
  ) {

    super( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: [ TimeSpeed.FAST, TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      playPauseStepButtonOptions: {
        playPauseStepXSpacing: PUSH_BUTTON_SPACING,
        playPauseButtonOptions: {
          radius: PLAY_PAUSE_BUTTON_RADIUS
        },
        stepForwardButtonOptions: {
          radius: STEP_BUTTON_RADIUS,
          listener: stepForwardListener
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
    } );

    const restartButton = new RestartButton( {
      enabled: true,
      radius: STEP_BUTTON_RADIUS,
      xMargin: 9.5,
      yMargin: 9.5,
      listener: restartListener,
      center: this.getPlayPauseButtonCenter().minusXY( PLAY_PAUSE_BUTTON_RADIUS + STEP_BUTTON_RADIUS + PUSH_BUTTON_SPACING, 0 ),
      tandem: providedOptions.tandem.createTandem( 'restartButton' )
    } );
    this.addChild( restartButton );
  }
}

mySolarSystem.register( 'MySolarSystemTimeControlNode', MySolarSystemTimeControlNode );
export default MySolarSystemTimeControlNode;