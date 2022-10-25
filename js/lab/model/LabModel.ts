// Copyright 2022, University of Colorado Boulder

/**
 * Model that controls the logic for the Lab Screen.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CommonModel, { BodyInfo, CommonModelOptions } from '../../common/model/CommonModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import LabModes from '../../common/model/LabModes.js';
import NumericalEngine from '../../common/model/NumericalEngine.js';

type SuperTypeOptions = CommonModelOptions<NumericalEngine>;

type LabModelOptions = StrictOmit<SuperTypeOptions, 'engineFactory' | 'isLab'>;

class LabModel extends CommonModel<NumericalEngine> {
  private readonly modeMap: Map<LabModes, BodyInfo[]>;
  private readonly modeSetter: ( mode: LabModes ) => void;
  private lastSelectedMode: LabModes;

  public constructor( providedOptions: LabModelOptions ) {
    const options = optionize<LabModelOptions, EmptySelfOptions, SuperTypeOptions>()( {
      engineFactory: bodies => new NumericalEngine( bodies ),
      isLab: true
    }, providedOptions );
    super( options );

    this.lastSelectedMode = LabModes.SUN_PLANET;
    this.modeMap = new Map<LabModes, BodyInfo[]>();
    this.setModesToMap();

    this.modeSetter = ( mode: LabModes ) => {
      this.isPlayingProperty.value = false;
      if ( mode !== LabModes.CUSTOM ) {
        this.lastSelectedMode = mode;
        const modeInfo = this.modeMap.get( mode );
        this.createBodies( modeInfo! );
        this.numberOfActiveBodiesProperty.value = this.bodies.length;
      }
    };

    this.labModeProperty.link( this.modeSetter );

    this.numberOfActiveBodiesProperty.link( numberOfActiveBodies => {
      if ( numberOfActiveBodies !== this.bodies.length ) {
        this.isPlayingProperty.value = false;
        this.labModeProperty.value = LabModes.CUSTOM;
        this.bodies.clear();
        this.bodies.push( ...this.availableBodies.slice( 0, numberOfActiveBodies ) );
        this.bodySoundManager.playBodyNumberSound( numberOfActiveBodies - 1 );
      }
    } );
  }

  // Restart is for when the time controls are brought back to 0
  public override restart(): void {
    this.isPlayingProperty.value = false;
    this.modeSetter( this.lastSelectedMode );
    this.update();

    // Time property is set to 0 to restart the clock timer
    this.timeProperty.value = 0;
  }

  public setModesToMap(): void {
    this.modeMap.set( LabModes.SUN_PLANET, [
      { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -5 ) },
      { mass: 10, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 100 ) }
    ] );
    this.modeMap.set( LabModes.SUN_PLANET_MOON, [
      { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { mass: 10, position: new Vector2( 160, 0 ), velocity: new Vector2( 0, 120 ) },
      { mass: 0.000001, position: new Vector2( 140, 0 ), velocity: new Vector2( 0, 53 ) }
    ] );
    this.modeMap.set( LabModes.SUN_PLANET_COMET, [
      { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { mass: 1, position: new Vector2( 150, 0 ), velocity: new Vector2( 0, 120 ) },
      { mass: 0.000001, position: new Vector2( -220, 130 ), velocity: new Vector2( -15, -28 ) }
    ] );
    this.modeMap.set( LabModes.TROJAN_ASTEROIDS, [
      { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { mass: 5, position: new Vector2( 150, 0 ), velocity: new Vector2( 0, 119 ) },
      { mass: 0.000001, position: new Vector2( 75, -130 ), velocity: new Vector2( 103, 60 ) },
      { mass: 0.000001, position: new Vector2( 75, 130 ), velocity: new Vector2( -103, 60 ) }
    ] );
    this.modeMap.set( LabModes.ELLIPSES, [
      { mass: 250, position: new Vector2( -200, 0 ), velocity: new Vector2( 0, 0 ) },
      { mass: 0.000001, position: new Vector2( -115, 0 ), velocity: new Vector2( 0, 151 ) },
      { mass: 0.000001, position: new Vector2( 50, 0 ), velocity: new Vector2( 0, 60 ) },
      { mass: 0.000001, position: new Vector2( 220, 0 ), velocity: new Vector2( 0, 37 ) }
    ] );
    this.modeMap.set( LabModes.HYPERBOLIC, [
      { mass: 250, position: new Vector2( -50, -25 ), velocity: new Vector2( 0, 0 ) },
      { mass: 0.000001, position: new Vector2( -300, 70 ), velocity: new Vector2( 120, 0 ) },
      { mass: 0.000001, position: new Vector2( -300, 140 ), velocity: new Vector2( 120, 0 ) },
      { mass: 0.000001, position: new Vector2( -300, 210 ), velocity: new Vector2( 120, 0 ) }
    ] );
    this.modeMap.set( LabModes.SLINGSHOT, [
      { mass: 200, position: new Vector2( 1, 0 ), velocity: new Vector2( 0, -1 ) },
      { mass: 10, position: new Vector2( 131, 55 ), velocity: new Vector2( -55, 115 ) },
      { mass: 0.000001, position: new Vector2( -6, -128 ), velocity: new Vector2( 83, 0 ) }
    ] );
    this.modeMap.set( LabModes.DOUBLE_SLINGSHOT, [
      { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -1 ) },
      { mass: 5, position: new Vector2( 0, -112 ), velocity: new Vector2( 134, 0 ) },
      { mass: 5, position: new Vector2( 186, -5 ), velocity: new Vector2( 1, 111 ) },
      { mass: 0.000001, position: new Vector2( 70, 72 ), velocity: new Vector2( -47, 63 ) }
    ] );
    this.modeMap.set( LabModes.BINARY_STAR_PLANET, [
      { mass: 150, position: new Vector2( -100, 0 ), velocity: new Vector2( 0, -60 ) },
      { mass: 120, position: new Vector2( 100, 0 ), velocity: new Vector2( 0, 50 ) },
      { mass: 0.000001, position: new Vector2( -50, 0 ), velocity: new Vector2( 0, 120 ) }
    ] );
    this.modeMap.set( LabModes.FOUR_STAR_BALLET, [
      { mass: 120, position: new Vector2( -100, 100 ), velocity: new Vector2( -50, -50 ) },
      { mass: 120, position: new Vector2( 100, 100 ), velocity: new Vector2( -50, 50 ) },
      { mass: 120, position: new Vector2( 100, -100 ), velocity: new Vector2( 50, 50 ) },
      { mass: 120, position: new Vector2( -100, -100 ), velocity: new Vector2( 50, -50 ) }
    ] );
    this.modeMap.set( LabModes.DOUBLE_DOUBLE, [
      { mass: 60, position: new Vector2( -115, -3 ), velocity: new Vector2( 0, -154 ) },
      { mass: 70, position: new Vector2( 102, 0 ), velocity: new Vector2( 1, 150 ) },
      { mass: 55, position: new Vector2( -77, -2 ), velocity: new Vector2( -1, 42 ) },
      { mass: 62, position: new Vector2( 135, 0 ), velocity: new Vector2( -1, -52 ) }
    ] );
    this.modeMap.set( LabModes.CUSTOM, [
      { mass: 120, position: new Vector2( -100, 100 ), velocity: new Vector2( -50, -50 ) },
      { mass: 120, position: new Vector2( 100, 100 ), velocity: new Vector2( -50, 50 ) },
      { mass: 120, position: new Vector2( 100, -100 ), velocity: new Vector2( 50, 50 ) },
      { mass: 120, position: new Vector2( -100, -100 ), velocity: new Vector2( 50, -50 ) }
    ] );
  }
}

mySolarSystem.register( 'LabModel', LabModel );
export default LabModel;