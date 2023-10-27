// Copyright 2023, University of Colorado Boulder

/**
 * TimePanel is the panel that contains UI elements related to time control and display.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import SolarSystemCommonTimeControlNode from '../../../../solar-system-common/js/view/SolarSystemCommonTimeControlNode.js';
import MySolarSystemModel from '../model/MySolarSystemModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import SolarSystemCommonStrings from '../../../../solar-system-common/js/SolarSystemCommonStrings.js';
import { HBox, VBox } from '../../../../scenery/js/imports.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import SolarSystemCommonConstants from '../../../../solar-system-common/js/SolarSystemCommonConstants.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import mySolarSystem from '../../mySolarSystem.js';
import Property from '../../../../axon/js/Property.js';
import SolarSystemCommonColors from '../../../../solar-system-common/js/SolarSystemCommonColors.js';

export default class TimePanel extends Panel {

  public constructor( model: MySolarSystemModel, playingAllowedProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const timeControlNode = new SolarSystemCommonTimeControlNode( model, {
      enabledProperty: playingAllowedProperty,
      restartListener: () => model.restart(),
      stepForwardListener: () => model.stepOnce( 1 / 8 ),
      speedRadioButtonGroupOnRight: false,
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    const clockNode = new ClockNode( model.timeProperty, tandem.createTandem( 'clockNode' ) );

    const content = new VBox( {
      children: [ timeControlNode, clockNode ],
      spacing: 10
    } );

    super( content, combineOptions<PanelOptions>( {}, SolarSystemCommonConstants.PANEL_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

/**
 * ClockNode includes the time display, and a 'Clear' button that resets timeProperty.
 */
class ClockNode extends HBox {

  public constructor( timeProperty: Property<number>, tandem: Tandem ) {

    const timeStringPatternProperty = new PatternStringProperty( SolarSystemCommonStrings.pattern.labelUnitsStringProperty, {
      units: SolarSystemCommonStrings.units.yearsStringProperty
    } );

    const timeDisplay = new NumberDisplay( timeProperty, new Range( 0, 1000 ), {
      backgroundFill: null,
      backgroundStroke: null,
      textOptions: {
        font: new PhetFont( 16 ),
        fill: SolarSystemCommonColors.foregroundProperty,
        maxWidth: 80
      },
      xMargin: 0,
      yMargin: 0,
      valuePattern: timeStringPatternProperty,
      decimalPlaces: 2
    } );

    const clearButton = new TextPushButton( SolarSystemCommonStrings.clearStringProperty, {
      font: new PhetFont( 16 ),
      enabledProperty: new DerivedProperty( [ timeProperty ], time => ( time > 0 ) ),
      listener: () => timeProperty.reset(),
      maxTextWidth: 65,
      touchAreaXDilation: 10,
      touchAreaYDilation: 5,
      tandem: tandem.createTandem( 'clearButton' )
    } );

    super( {
      children: [ timeDisplay, clearButton ],
      spacing: 10,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );
  }
}

mySolarSystem.register( 'TimePanel', TimePanel );