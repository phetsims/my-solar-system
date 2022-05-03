// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Jonathan Olson
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import mySolarSystem from '../../mySolarSystem.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import BodyNode from '../../common/view/BodyNode.js';
import Body from '../../common/model/Body.js';
import MySolarSystemTimeControlNode from '../../common/view/MySolarSystemTimeControlNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MySolarSystemControls from '../../common/view/MySolarSystemControls.js';

// constants
const MARGIN = 5;

class MySolarSystemScreenView extends ScreenView {

  constructor( model: MySolarSystemModel, tandem: Tandem ) {
    assert && assert( model instanceof MySolarSystemModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {
      tandem: tandem
    } );

    const bodyNodesMap = new Map<Body, BodyNode>();

    const addBodyNode = ( body: Body ) => {
      const bodyNode = new BodyNode( body );
      bodyNodesMap.set( body, bodyNode );
      this.addChild( bodyNode );
    };

    const removeBodyNode = ( body: Body ) => {
      const bodyNode = bodyNodesMap.get( body )!;
      this.removeChild( bodyNode );
    };

    model.bodies.forEach( addBodyNode );
    model.bodies.elementAddedEmitter.addListener( addBodyNode );
    model.bodies.elementRemovedEmitter.addListener( removeBodyNode );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - MySolarSystemConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MySolarSystemConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );


    // Add play/pause, rewind, and step buttons
    const timeControlNode = new MySolarSystemTimeControlNode( model,
      {
        restartListener: () => model.restart(),
        stepForwardListener: () => model.stepForward(),
        tandem: tandem.createTandem( 'timeControlNode' )
      } );
    this.addChild( timeControlNode );
    timeControlNode.setPlayPauseButtonCenter( new Vector2( this.layoutBounds.centerX - 117, this.layoutBounds.bottom - timeControlNode.height / 2 - MARGIN ) );

    // spacing to put the SpeedRadioButtonGroup at the edge of the layout bounds - current spacing
    // plus distance from the left of the TimeControlNode to left edge of layout bounds
    // timeControlNode.setButtonGroupXSpacing( timeControlNode.getButtonGroupXSpacing() + timeControlNode.left - this.layoutBounds.left - MARGIN );

    // const checkboxPanel = new CheckboxPanel( model );
    const controlPanel = new MySolarSystemControls( model );
    this.addChild( controlPanel );
  }


  /**
   * Resets the view.
   */
  reset(): void {
    //TODO
  }

  override step( dt: number ): void {
    //TODO
  }
}

mySolarSystem.register( 'MySolarSystemScreenView', MySolarSystemScreenView );
export default MySolarSystemScreenView;