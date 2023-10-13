// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model that controls the logic for the Lab Screen.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { BodyInfo } from '../../../../solar-system-common/js/model/Body.js';
import OrbitalSystem from './OrbitalSystem.js';
import MySolarSystemModel from '../../common/model/MySolarSystemModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

export default class LabModel extends MySolarSystemModel {

  public readonly labModeProperty: EnumerationProperty<OrbitalSystem>;
  private readonly modeMap: Map<OrbitalSystem, BodyInfo[]>;

  public constructor( tandem: Tandem ) {
    super( {
      // MySolarSystemModelOptions
      defaultBodyInfo: [
        { isActive: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -11.1 ) },
        { isActive: true, mass: 25, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 111 ) },
        { isActive: false, mass: 0.1, position: new Vector2( 100, 0 ), velocity: new Vector2( 0, 150 ) },
        { isActive: false, mass: 0.1, position: new Vector2( -100, -100 ), velocity: new Vector2( 120, 0 ) }
      ],
      isLab: true,
      tandem: tandem
    } );

    this.labModeProperty = new EnumerationProperty( OrbitalSystem.SUN_PLANET, {
      tandem: tandem.createTandem( 'labModeProperty' )
    } );

    this.labModeProperty.lazyLink( mode => {
      if ( mode !== OrbitalSystem.CUSTOM ) {
        this.userControlledProperty.value = true;
        this.clearPaths();
      }
    } );

    this.userInteractingEmitter.addListener( () => {
      this.labModeProperty.value = OrbitalSystem.CUSTOM;
    } );

    this.modeMap = new Map<OrbitalSystem, BodyInfo[]>();
    this.initializeModeMap();

    this.labModeProperty.link( mode => {
      if ( mode !== OrbitalSystem.CUSTOM ) {
        this.isPlayingProperty.value = false;
        this.hasPlayedProperty.value = false;
        this.userControlledProperty.value = false;
        this.isAnyBodyCollidedProperty.reset();
        this.timeProperty.reset();
        const modeInfo = this.modeMap.get( mode );
        this.loadBodyInfo( modeInfo! );
        this.numberOfActiveBodiesProperty.value = this.bodies.length;
        this.followCenterOfMass();
        this.saveStartingBodyInfo();
        this.forceScaleProperty.reset();

        if ( mode === OrbitalSystem.FOUR_STAR_BALLET ) {
          this.forceScaleProperty.value = -1.1;
        }
      }
    } );

    this.numberOfActiveBodiesProperty.link( numberOfActiveBodies => {
      if ( numberOfActiveBodies !== this.bodies.length ) {
        this.isPlayingProperty.value = false;
        this.labModeProperty.value = OrbitalSystem.CUSTOM;
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

    // Change the Lab Mode briefly to custom so the reset actually triggers the listeners.
    // If this is not done, labModeProperty listeners (including the one added in the constructor above) won't be called.
    this.labModeProperty.value = OrbitalSystem.CUSTOM;
    this.labModeProperty.reset();

    this.userControlledProperty.reset();
    super.restart();
  }

  /**
   * Initializes the keys and values for this.modeMap.
   */
  private initializeModeMap(): void {
    this.modeMap.set( OrbitalSystem.SUN_PLANET, [
      { isActive: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -11.1 ) },
      { isActive: true, mass: 25, position: new Vector2( 200, 0 ), velocity: new Vector2( 0, 111 ) }
    ] );
    this.modeMap.set( OrbitalSystem.SUN_PLANET_MOON, [
      { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { isActive: true, mass: 10, position: new Vector2( 160, 0 ), velocity: new Vector2( 0, 120 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( 140, 0 ), velocity: new Vector2( 0, 53 ) }
    ] );
    this.modeMap.set( OrbitalSystem.SUN_PLANET_COMET, [
      { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { isActive: true, mass: 1, position: new Vector2( 150, 0 ), velocity: new Vector2( 0, 120 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( -220, 130 ), velocity: new Vector2( -20, -35 ) }
    ] );
    this.modeMap.set( OrbitalSystem.TROJAN_ASTEROIDS, [
      { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) },
      { isActive: true, mass: 5, position: new Vector2( 150, 0 ), velocity: new Vector2( 0, 119 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( 75, -130 ), velocity: new Vector2( 103, 60 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( 75, 130 ), velocity: new Vector2( -103, 60 ) }
    ] );
    this.modeMap.set( OrbitalSystem.ELLIPSES, [
      { isActive: true, mass: 250, position: new Vector2( -200, 0 ), velocity: new Vector2( 0, 0 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( -115, 0 ), velocity: new Vector2( 0, 151 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( 50, 0 ), velocity: new Vector2( 0, 60 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( 220, 0 ), velocity: new Vector2( 0, 37 ) }
    ] );
    this.modeMap.set( OrbitalSystem.HYPERBOLIC, [
      { isActive: true, mass: 250, position: new Vector2( 0, 25 ), velocity: new Vector2( 0, 0 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( -250, -70 ), velocity: new Vector2( 120, 0 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( -250, -140 ), velocity: new Vector2( 120, 0 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( -250, -210 ), velocity: new Vector2( 120, 0 ) }
    ] );
    this.modeMap.set( OrbitalSystem.SLINGSHOT, [
      { isActive: true, mass: 200, position: new Vector2( 1, 0 ), velocity: new Vector2( 0, -1 ) },
      { isActive: true, mass: 10, position: new Vector2( 131, 55 ), velocity: new Vector2( -55, 115 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( -6, -128 ), velocity: new Vector2( 83, 0 ) }
    ] );
    this.modeMap.set( OrbitalSystem.DOUBLE_SLINGSHOT, [
      { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -1 ) },
      { isActive: true, mass: 5, position: new Vector2( 0, -112 ), velocity: new Vector2( 134, 0 ) },
      { isActive: true, mass: 5, position: new Vector2( 186, -5 ), velocity: new Vector2( 1, 111 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( 70, 72 ), velocity: new Vector2( -47, 63 ) }
    ] );
    this.modeMap.set( OrbitalSystem.BINARY_STAR_PLANET, [
      { isActive: true, mass: 150, position: new Vector2( -100, 0 ), velocity: new Vector2( 0, -60 ) },
      { isActive: true, mass: 120, position: new Vector2( 100, 0 ), velocity: new Vector2( 0, 50 ) },
      { isActive: true, mass: 0.000001, position: new Vector2( -50, 0 ), velocity: new Vector2( 0, 120 ) }
    ] );
    this.modeMap.set( OrbitalSystem.FOUR_STAR_BALLET, [
      { isActive: true, mass: 120, position: new Vector2( -100, 100 ), velocity: new Vector2( -50, -50 ) },
      { isActive: true, mass: 120, position: new Vector2( 100, 100 ), velocity: new Vector2( -50, 50 ) },
      { isActive: true, mass: 120, position: new Vector2( 100, -100 ), velocity: new Vector2( 50, 50 ) },
      { isActive: true, mass: 120, position: new Vector2( -100, -100 ), velocity: new Vector2( 50, -50 ) }
    ] );
    this.modeMap.set( OrbitalSystem.DOUBLE_DOUBLE, [
      { isActive: true, mass: 60, position: new Vector2( -115, -3 ), velocity: new Vector2( 0, -154 ) },
      { isActive: true, mass: 70, position: new Vector2( 102, 0 ), velocity: new Vector2( 1, 150 ) },
      { isActive: true, mass: 55, position: new Vector2( -77, -2 ), velocity: new Vector2( -1, 42 ) },
      { isActive: true, mass: 62, position: new Vector2( 135, 0 ), velocity: new Vector2( -1, -52 ) }
    ] );
    this.modeMap.set( OrbitalSystem.CUSTOM, [
      { isActive: true, mass: 120, position: new Vector2( -100, 100 ), velocity: new Vector2( -50, -50 ) },
      { isActive: true, mass: 120, position: new Vector2( 100, 100 ), velocity: new Vector2( -50, 50 ) },
      { isActive: true, mass: 120, position: new Vector2( 100, -100 ), velocity: new Vector2( 50, 50 ) },
      { isActive: true, mass: 120, position: new Vector2( -100, -100 ), velocity: new Vector2( 50, -50 ) }
    ] );
  }
}

mySolarSystem.register( 'LabModel', LabModel );