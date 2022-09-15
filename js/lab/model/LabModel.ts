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

  public constructor( providedOptions: LabModelOptions ) {
    const options = optionize<LabModelOptions, EmptySelfOptions, SuperTypeOptions>()( {
      engineFactory: bodies => new NumericalEngine( bodies ),
      isLab: true
    }, providedOptions );
    super( options );

    this.modeMap = new Map<LabModes, BodyInfo[]>();
    this.setModesToMap();

    this.labModeProperty.link( mode => {
      this.isPlayingProperty.value = false;
      if ( mode !== LabModes.CUSTOM ) {
        const modeInfo = this.modeMap.get( mode );
        this.createBodies( modeInfo! );
        this.numberOfActiveBodiesProperty.value = this.bodies.length;
      }
    } );

    this.numberOfActiveBodiesProperty.link( numberOfActiveBodiesProperty => {
      if ( numberOfActiveBodiesProperty !== this.bodies.length ) {
        this.labModeProperty.value = LabModes.CUSTOM;
        this.bodies.clear();
        this.bodies.push( ...this.availableBodies.slice( 0, numberOfActiveBodiesProperty ) );
      }
    } );
  }

  public setModesToMap(): void {
    this.modeMap.set( LabModes.SUN_PLANET, [
      { mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -6 ) },
      { mass: 10, position: new Vector2( 150, 0 ), velocity: new Vector2( 0, 120 ) }
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
      { mass: 0.000001, position: new Vector2( 300, 50 ), velocity: new Vector2( -120, 0 ) },
      { mass: 0.000001, position: new Vector2( 300, 120 ), velocity: new Vector2( -120, 0 ) },
      { mass: 0.000001, position: new Vector2( 300, 190 ), velocity: new Vector2( -120, 0 ) }
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

  // Restart is for when the time controls are brought back to 0
  public override restart(): void {
    this.isPlayingProperty.value = false;
    this.bodies.forEach( body => body.reset() );
    //REVIEW: We set the timeProperty to zero after the update... is there a reason for that? If so, it should be documented.
    this.update();
    this.timeProperty.value = 0;
  }
}

mySolarSystem.register( 'LabModel', LabModel );
export default LabModel;