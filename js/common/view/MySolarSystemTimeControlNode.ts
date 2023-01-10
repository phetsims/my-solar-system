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
import { HBox, Path, Rectangle } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

// constants
const PLAY_PAUSE_BUTTON_RADIUS = 34;
const STEP_BUTTON_RADIUS = 23;
const PUSH_BUTTON_SPACING = 8;


// Restart Icon ---------------------------------------------------------------------------
// constants
const scale = 0.75;
const vscale = 1.15;
const barWidth = 4 * scale;
const barHeight = 19 * scale * vscale;
const triangleWidth = 15 * scale;
const triangleHeight = 19 * scale * vscale;
const barPath = new Rectangle( 0, 0, barWidth, barHeight, { fill: 'black' } );
const trianglePath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
  fill: 'black'
} );
const trianglePath2 = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
  fill: 'black'
} );
const restartIcon = new HBox( { children: [ barPath, trianglePath, trianglePath2 ], spacing: -1 } );

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

    const restartButton = new RoundPushButton( {
      content: restartIcon,
      enabledProperty: new DerivedProperty(
        [ model.timeProperty ],
        time => time !== 0
      ),
      radius: STEP_BUTTON_RADIUS,
      xMargin: 9.5,
      yMargin: 9.5,
      listener: () => model.restart(),
      center: this.getPlayPauseButtonCenter().minusXY( PLAY_PAUSE_BUTTON_RADIUS + STEP_BUTTON_RADIUS + PUSH_BUTTON_SPACING, 0 ),
      tandem: providedOptions.tandem.createTandem( 'restartButton' ),
      // touchAreaXDilation: 7,
      // touchAreaYDilation: 7,
      layoutOptions: {
        xMargin: MySolarSystemConstants.MARGIN / 2
      }
    } );

    this.addChild( restartButton );

    this.speedRadioButtonGroupParent!.center = this.getPlayPauseButtonCenter().plusXY(
      0,
      PLAY_PAUSE_BUTTON_RADIUS + STEP_BUTTON_RADIUS + 3 * PUSH_BUTTON_SPACING
    );
  }
}

mySolarSystem.register( 'MySolarSystemTimeControlNode', MySolarSystemTimeControlNode );