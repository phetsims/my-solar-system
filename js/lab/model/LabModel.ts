// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Body from '../../common/model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Engine from '../../common/model/Engine.js';
import CommonModel, { CommonModelOptions } from '../../common/model/CommonModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import LabModes from '../../common/model/LabModes.js';

type LabModelOptions = StrictOmit<CommonModelOptions, 'engineFactory' | 'isLab'>;

class LabModel extends CommonModel {
  private readonly modeMap: Map<LabModes, Body[]>;
  private readonly availableBodies: Body[];

  public constructor( providedOptions: LabModelOptions ) {
    const options = optionize<LabModelOptions, EmptySelfOptions, CommonModelOptions>()( {
      engineFactory: bodies => new Engine( bodies ),
      isLab: true
    }, providedOptions );
    super( options );

    this.modeMap = new Map<LabModes, Body[]>();
    this.setModesToMap();

    this.availableBodies = _.flatten( Object.values( this.modeMap ) ); // all the bodies

    this.labModeProperty.link( mode => {
      this.isPlayingProperty.value = false;
      this.bodies.clear();
      this.bodies.push( ...this.modeMap.get( mode )! );
    } );
  }

  public createBodies(): void {
    this.bodies.clear();
    this.bodies.push( new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -6 ) ) );
    this.bodies.push( new Body( 10, new Vector2( 150, 0 ), new Vector2( 0, 120 ) ) );
  }

  public setModesToMap(): void {
    this.modeMap.set( LabModes.SUN_PLANET, [
      new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -6 ) ),
      new Body( 10, new Vector2( 150, 0 ), new Vector2( 0, 120 ) )
    ] );
    this.modeMap.set( LabModes.SUN_PLANET_MOON, [
      new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, 0 ) ),
      new Body( 10, new Vector2( 160, 0 ), new Vector2( 0, 120 ) ),
      new Body( 0.000001, new Vector2( 140, 0 ), new Vector2( 0, 53 ) )
    ] );
    this.modeMap.set( LabModes.SUN_PLANET_COMET, [
      new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, 0 ) ),
      new Body( 1, new Vector2( 150, 0 ), new Vector2( 0, 120 ) ),
      new Body( 0.000001, new Vector2( -220, 130 ), new Vector2( -15, -28 ) )
    ] );
    this.modeMap.set( LabModes.TROJAN_ASTEROIDS, [
      new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, 0 ) ),
      new Body( 5, new Vector2( 150, 0 ), new Vector2( 0, 119 ) ),
      new Body( 0.000001, new Vector2( 75, -130 ), new Vector2( 103, 60 ) ),
      new Body( 0.000001, new Vector2( 75, 130 ), new Vector2( -103, 60 ) )
    ] );
    this.modeMap.set( LabModes.ELLIPSES, [
      new Body( 250, new Vector2( -200, 0 ), new Vector2( 0, 0 ) ),
      new Body( 0.000001, new Vector2( -115, 0 ), new Vector2( 0, 151 ) ),
      new Body( 0.000001, new Vector2( 50, 0 ), new Vector2( 0, 60 ) ),
      new Body( 0.000001, new Vector2( 220, 0 ), new Vector2( 0, 37 ) )
    ] );
    this.modeMap.set( LabModes.HYPERBOLIC, [
      new Body( 250, new Vector2( -50, -25 ), new Vector2( 0, 0 ) ),
      new Body( 0.000001, new Vector2( 300, 50 ), new Vector2( -120, 0 ) ),
      new Body( 0.000001, new Vector2( 300, 120 ), new Vector2( -120, 0 ) ),
      new Body( 0.000001, new Vector2( 300, 190 ), new Vector2( -120, 0 ) )
    ] );
    this.modeMap.set( LabModes.SLINGSHOT, [
      new Body( 200, new Vector2( 1, 0 ), new Vector2( 0, -1 ) ),
      new Body( 10, new Vector2( 131, 55 ), new Vector2( -55, 115 ) ),
      new Body( 0.000001, new Vector2( -6, -128 ), new Vector2( 83, 0 ) )
    ] );
    this.modeMap.set( LabModes.DOUBLE_SLINGSHOT, [
      new Body( 200, new Vector2( 0, 0 ), new Vector2( 0, -1 ) ),
      new Body( 5, new Vector2( 0, -112 ), new Vector2( 134, 0 ) ),
      new Body( 4, new Vector2( 186, -5 ), new Vector2( 1, 111 ) ),
      new Body( 0.000001, new Vector2( 70, 72 ), new Vector2( -47, 63 ) )
    ] );
    this.modeMap.set( LabModes.BINARY_STAR_PLANET, [
      new Body( 150, new Vector2( -100, 0 ), new Vector2( 0, -60 ) ),
      new Body( 120, new Vector2( 100, 0 ), new Vector2( 0, 50 ) ),
      new Body( 0.000001, new Vector2( -50, 0 ), new Vector2( 0, 120 ) )
    ] );
    this.modeMap.set( LabModes.FOUR_STAR_BALLET, [
      new Body( 120, new Vector2( -100, 100 ), new Vector2( -50, -50 ) ),
      new Body( 120, new Vector2( 100, 100 ), new Vector2( -50, 50 ) ),
      new Body( 120, new Vector2( 100, -100 ), new Vector2( 50, 50 ) ),
      new Body( 120, new Vector2( -100, -100 ), new Vector2( 50, -50 ) )
    ] );
    this.modeMap.set( LabModes.DOUBLE_DOUBLE, [
      new Body( 60, new Vector2( -115, -3 ), new Vector2( 0, -154 ) ),
      new Body( 70, new Vector2( 102, 0 ), new Vector2( 1, 150 ) ),
      new Body( 55, new Vector2( -77, -2 ), new Vector2( -1, 42 ) ),
      new Body( 62, new Vector2( 135, 0 ), new Vector2( -1, -52 ) )
    ] );
    this.modeMap.set( LabModes.CUSTOM, [
      new Body( 120, new Vector2( -100, 100 ), new Vector2( -50, -50 ) ),
      new Body( 120, new Vector2( 100, 100 ), new Vector2( -50, 50 ) ),
      new Body( 120, new Vector2( 100, -100 ), new Vector2( 50, 50 ) ),
      new Body( 120, new Vector2( -100, -100 ), new Vector2( 50, -50 ) )
    ] );
  }
}

mySolarSystem.register( 'LabModel', LabModel );
export default LabModel;