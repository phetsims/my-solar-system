// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model that controls the logic for the Lab Screen.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { BodyInfo } from '../../../../solar-system-common/js/model/SolarSystemCommonModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import LabMode from '../../../../solar-system-common/js/model/LabMode.js';
import NumericalEngine from '../../common/model/NumericalEngine.js';
import MySolarSystemModel, { MySolarSystemModelOptions } from '../../common/model/MySolarSystemModel.js';

type SuperTypeOptions = MySolarSystemModelOptions;

type LabModelOptions = StrictOmit<SuperTypeOptions, 'engineFactory' | 'isLab'>;

export default class LabModel extends MySolarSystemModel {
  private readonly modeMap: Map<LabMode, BodyInfo[]>;
  private readonly modeSetter: ( mode: LabMode ) => void;

  public constructor( providedOptions: LabModelOptions ) {
    const options = optionize<LabModelOptions, EmptySelfOptions, SuperTypeOptions>()( {
      engineFactory: bodies => new NumericalEngine( bodies ),
      isLab: true
    }, providedOptions );
    super( options );

    this.labModeProperty.lazyLink( mode => {
      if ( mode !== LabMode.CUSTOM ) {
        this.userControlledProperty.value = true;
        this.clearPaths();
      }
    } );

    this.userInteractingEmitter.addListener( () => {
      this.labModeProperty.value = LabMode.CUSTOM;
    } );

    this.modeMap = new Map<LabMode, BodyInfo[]>();
    this.setModesToMap();

    this.modeSetter = ( mode: LabMode ) => {
      if ( mode !== LabMode.CUSTOM ) {
        this.isPlayingProperty.value = false;
        this.hasPlayedProperty.value = false;
        this.userControlledProperty.value = false;
        this.isAnyBodyCollidedProperty.reset();
        this.timeProperty.reset();
        const modeInfo = this.modeMap.get( mode );
        this.loadBodyStates( modeInfo! );
        this.numberOfActiveBodiesProperty.value = this.bodies.length;
        this.followCenterOfMass();
        this.saveStartingBodyState();
        this.forceScaleProperty.reset();

        if ( mode === LabMode.FOUR_STAR_BALLET ) {
          this.forceScaleProperty.value = -1.1;
        }
      }
    };

    this.labModeProperty.link( this.modeSetter );

    this.numberOfActiveBodiesProperty.link( numberOfActiveBodies => {
      if ( numberOfActiveBodies !== this.bodies.length ) {
        this.isPlayingProperty.value = false;
        this.labModeProperty.value = LabMode.CUSTOM;
        if ( numberOfActiveBodies > this.bodies.length ) {
          this.addNextBody();
        }
        else {
          this.removeLastBody();
        }
      }
    } );
  }

  public override reset(): void {
    super.reset();

    // Changing the Lab Mode briefly to custom so the reset actually triggers the listeners
    // If this is not done, the modeSetter wont be called.
    this.labModeProperty.value = LabMode.CUSTOM;
    this.labModeProperty.reset();

    this.userControlledProperty.reset();
    super.restart();
  }

  public setModesToMap(): void {
    this.modeMap.set( LabMode.SUN_PLANET, [
      { active: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -11.1 ) },
      { active: true, mass: 25, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 111 ) }
    ] );
    this.modeMap.set( LabMode.SUN_PLANET_MOON, [
      { active: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { active: true, mass: 10, position: new Vector2( 160, 0 ), velocity: new Vector2( 0, 120 ) },
      { active: true, mass: 0.000001, position: new Vector2( 140, 0 ), velocity: new Vector2( 0, 53 ) }
    ] );
    this.modeMap.set( LabMode.SUN_PLANET_COMET, [
      { active: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { active: true, mass: 1, position: new Vector2( 150, 0 ), velocity: new Vector2( 0, 120 ) },
      { active: true, mass: 0.000001, position: new Vector2( -220, 130 ), velocity: new Vector2( -20, -35 ) }
    ] );
    this.modeMap.set( LabMode.TROJAN_ASTEROIDS, [
      { active: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { active: true, mass: 5, position: new Vector2( 150, 0 ), velocity: new Vector2( 0, 119 ) },
      { active: true, mass: 0.000001, position: new Vector2( 75, -130 ), velocity: new Vector2( 103, 60 ) },
      { active: true, mass: 0.000001, position: new Vector2( 75, 130 ), velocity: new Vector2( -103, 60 ) }
    ] );
    this.modeMap.set( LabMode.ELLIPSES, [
      { active: true, mass: 250, position: new Vector2( -200, 0 ), velocity: new Vector2( 0, 0 ) },
      { active: true, mass: 0.000001, position: new Vector2( -115, 0 ), velocity: new Vector2( 0, 151 ) },
      { active: true, mass: 0.000001, position: new Vector2( 50, 0 ), velocity: new Vector2( 0, 60 ) },
      { active: true, mass: 0.000001, position: new Vector2( 220, 0 ), velocity: new Vector2( 0, 37 ) }
    ] );
    this.modeMap.set( LabMode.HYPERBOLIC, [
      { active: true, mass: 250, position: new Vector2( 0, 25 ), velocity: new Vector2( 0, 0 ) },
      { active: true, mass: 0.000001, position: new Vector2( -250, -70 ), velocity: new Vector2( 120, 0 ) },
      { active: true, mass: 0.000001, position: new Vector2( -250, -140 ), velocity: new Vector2( 120, 0 ) },
      { active: true, mass: 0.000001, position: new Vector2( -250, -210 ), velocity: new Vector2( 120, 0 ) }
    ] );
    this.modeMap.set( LabMode.SLINGSHOT, [
      { active: true, mass: 200, position: new Vector2( 1, 0 ), velocity: new Vector2( 0, -1 ) },
      { active: true, mass: 10, position: new Vector2( 131, 55 ), velocity: new Vector2( -55, 115 ) },
      { active: true, mass: 0.000001, position: new Vector2( -6, -128 ), velocity: new Vector2( 83, 0 ) }
    ] );
    this.modeMap.set( LabMode.DOUBLE_SLINGSHOT, [
      { active: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -1 ) },
      { active: true, mass: 5, position: new Vector2( 0, -112 ), velocity: new Vector2( 134, 0 ) },
      { active: true, mass: 5, position: new Vector2( 186, -5 ), velocity: new Vector2( 1, 111 ) },
      { active: true, mass: 0.000001, position: new Vector2( 70, 72 ), velocity: new Vector2( -47, 63 ) }
    ] );
    this.modeMap.set( LabMode.BINARY_STAR_PLANET, [
      { active: true, mass: 150, position: new Vector2( -100, 0 ), velocity: new Vector2( 0, -60 ) },
      { active: true, mass: 120, position: new Vector2( 100, 0 ), velocity: new Vector2( 0, 50 ) },
      { active: true, mass: 0.000001, position: new Vector2( -50, 0 ), velocity: new Vector2( 0, 120 ) }
    ] );
    this.modeMap.set( LabMode.FOUR_STAR_BALLET, [
      { active: true, mass: 120, position: new Vector2( -100, 100 ), velocity: new Vector2( -50, -50 ) },
      { active: true, mass: 120, position: new Vector2( 100, 100 ), velocity: new Vector2( -50, 50 ) },
      { active: true, mass: 120, position: new Vector2( 100, -100 ), velocity: new Vector2( 50, 50 ) },
      { active: true, mass: 120, position: new Vector2( -100, -100 ), velocity: new Vector2( 50, -50 ) }
    ] );
    this.modeMap.set( LabMode.DOUBLE_DOUBLE, [
      { active: true, mass: 60, position: new Vector2( -115, -3 ), velocity: new Vector2( 0, -154 ) },
      { active: true, mass: 70, position: new Vector2( 102, 0 ), velocity: new Vector2( 1, 150 ) },
      { active: true, mass: 55, position: new Vector2( -77, -2 ), velocity: new Vector2( -1, 42 ) },
      { active: true, mass: 62, position: new Vector2( 135, 0 ), velocity: new Vector2( -1, -52 ) }
    ] );
    this.modeMap.set( LabMode.CUSTOM, [
      { active: true, mass: 120, position: new Vector2( -100, 100 ), velocity: new Vector2( -50, -50 ) },
      { active: true, mass: 120, position: new Vector2( 100, 100 ), velocity: new Vector2( -50, 50 ) },
      { active: true, mass: 120, position: new Vector2( 100, -100 ), velocity: new Vector2( 50, 50 ) },
      { active: true, mass: 120, position: new Vector2( -100, -100 ), velocity: new Vector2( 50, -50 ) }
    ] );
  }
}

mySolarSystem.register( 'LabModel', LabModel );