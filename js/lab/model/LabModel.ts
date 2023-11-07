// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model that controls the logic for the Lab Screen.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import OrbitalSystem from './OrbitalSystem.js';
import MySolarSystemModel from '../../common/model/MySolarSystemModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import BodyInfo from '../../../../solar-system-common/js/model/BodyInfo.js';
import Property from '../../../../axon/js/Property.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';

export default class LabModel extends MySolarSystemModel {

  // The OrbitalSystem that is currently selected
  public readonly orbitalSystemProperty: EnumerationProperty<OrbitalSystem>;

  // Maps an OrbitalSystem to the BodyInfo[] that describes the configuration of Bodies in that system
  private readonly orbitalSystemMap: Map<OrbitalSystem, BodyInfo[]>;

  // Orbital systems that can be viewed and customized only via PhET-iO
  // See https://github.com/phetsims/my-solar-system/issues/233
  private readonly phetioOrbitalSystem1Property: Property<BodyInfo[]>;
  private readonly phetioOrbitalSystem2Property: Property<BodyInfo[]>;
  private readonly phetioOrbitalSystem3Property: Property<BodyInfo[]>;
  private readonly phetioOrbitalSystem4Property: Property<BodyInfo[]>;

  public constructor( tandem: Tandem ) {
    super( {
      // MySolarSystemModelOptions
      defaultBodyInfo: [
        new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -2.3446 ) } ),
        new BodyInfo( { isActive: true, mass: 25, position: new Vector2( 2.00, 0 ), velocity: new Vector2( 0, 23.4457 ) } ),
        new BodyInfo( { isActive: false, mass: 0.1, position: new Vector2( 1.00, 0 ), velocity: new Vector2( 0, 31.6834 ) } ),
        new BodyInfo( { isActive: false, mass: 0.1, position: new Vector2( -1.00, -1.00 ), velocity: new Vector2( 25.3467, 0 ) } )
      ],
      numberOfActiveBodiesPropertyPhetioReadOnly: false,
      isLab: true,
      tandem: tandem
    } );

    this.orbitalSystemProperty = new EnumerationProperty( OrbitalSystem.SUN_PLANET, {
      tandem: tandem.createTandem( 'orbitalSystemProperty' )
    } );

    this.userInteractingEmitter.addListener( () => {
      this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
    } );

    this.orbitalSystemMap = new Map<OrbitalSystem, BodyInfo[]>();
    this.initializeModeMap();

    this.orbitalSystemProperty.link( orbitalSystem => {
      this.clearPaths();
      if ( orbitalSystem !== OrbitalSystem.CUSTOM ) {
        this.isPlayingProperty.value = false;
        this.isAnyBodyCollidedProperty.reset();
        this.timeProperty.reset();
        const modeInfo = this.orbitalSystemMap.get( orbitalSystem );
        this.loadBodyInfo( modeInfo! );
        this.numberOfActiveBodiesProperty.value = this.activeBodies.length;
        this.followCenterOfMass();
        this.saveStartingBodyInfo();
        this.gravityForceScalePowerProperty.reset();

        if ( orbitalSystem === OrbitalSystem.FOUR_STAR_BALLET ) {
          this.gravityForceScalePowerProperty.value = -1.1;
        }
      }
    } );

    this.numberOfActiveBodiesProperty.link( numberOfActiveBodies => {
      if ( numberOfActiveBodies !== this.activeBodies.length ) {
        this.isPlayingProperty.value = false;
        this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
        let count = 0;
        while ( numberOfActiveBodies !== this.activeBodies.length ) {
          // addNextBody and removeLastBody should trigger updates in this.activeBodies, otherwise this loop wouldn't close.
          assert && assert( count++ < this.bodies.length, 'Infinite loop detected' );
          if ( numberOfActiveBodies > this.activeBodies.length ) {
            this.addNextBody();
          }
          else {
            this.removeLastBody();
          }
        }
      }
    } );

    const phetioOrbitalSystemsTandem = tandem.createTandem( 'phetioOrbitalSystems' );

    //TODO https://github.com/phetsims/my-solar-system/issues/233 eliminate duplication for phetioOrbitalSystem1Property, etc.
    this.phetioOrbitalSystem1Property = new Property( this.orbitalSystemMap.get( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_1 )!, {
      tandem: phetioOrbitalSystemsTandem.createTandem( 'phetioOrbitalSystem1Property' ),
      phetioValueType: ArrayIO( BodyInfo.BodyInfoIO )
    } );
    this.phetioOrbitalSystem1Property.lazyLink( bodyInfo => {
      this.orbitalSystemMap.set( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_1, bodyInfo );
      if ( this.orbitalSystemProperty.value === OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_1 ) {
        this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
        this.orbitalSystemProperty.value = OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_1;
      }
    } );

    this.phetioOrbitalSystem2Property = new Property( this.orbitalSystemMap.get( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_2 )!, {
      tandem: phetioOrbitalSystemsTandem.createTandem( 'phetioOrbitalSystem2Property' ),
      phetioValueType: ArrayIO( BodyInfo.BodyInfoIO )
    } );
    this.phetioOrbitalSystem2Property.lazyLink( bodyInfo => {
      this.orbitalSystemMap.set( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_2, bodyInfo );
      if ( this.orbitalSystemProperty.value === OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_2 ) {
        this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
        this.orbitalSystemProperty.value = OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_2;
      }
    } );

    this.phetioOrbitalSystem3Property = new Property( this.orbitalSystemMap.get( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_3 )!, {
      tandem: phetioOrbitalSystemsTandem.createTandem( 'phetioOrbitalSystem3Property' ),
      phetioValueType: ArrayIO( BodyInfo.BodyInfoIO )
    } );
    this.phetioOrbitalSystem3Property.lazyLink( bodyInfo => {
      this.orbitalSystemMap.set( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_3, bodyInfo );
      if ( this.orbitalSystemProperty.value === OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_3 ) {
        this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
        this.orbitalSystemProperty.value = OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_3;
      }
    } );

    this.phetioOrbitalSystem4Property = new Property( this.orbitalSystemMap.get( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_4 )!, {
      tandem: phetioOrbitalSystemsTandem.createTandem( 'phetioOrbitalSystem4Property' ),
      phetioValueType: ArrayIO( BodyInfo.BodyInfoIO )
    } );
    this.phetioOrbitalSystem4Property.lazyLink( bodyInfo => {
      this.orbitalSystemMap.set( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_4, bodyInfo );
      if ( this.orbitalSystemProperty.value === OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_4 ) {
        this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
        this.orbitalSystemProperty.value = OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_4;
      }
    } );
  }

  public override reset(): void {
    super.reset();
    // Change the Lab Mode briefly to custom so the reset actually triggers the listeners.
    // If this is not done, orbitalSystemProperty listeners (including the one added in the constructor above) won't be called.
    this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
    this.orbitalSystemProperty.reset();

    super.restart();
  }

  //TODO https://github.com/phetsims/my-solar-system/issues/233 eliminate orbitalSystemMap, move BodyInfo[] to OrbitalSystem enum
  /**
   * Initializes the keys and values for this.orbitalSystemMap.
   */
  private initializeModeMap(): void {
    this.orbitalSystemMap.set( OrbitalSystem.SUN_PLANET, [
      new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -2.3446 ) } ),
      new BodyInfo( { isActive: true, mass: 25, position: new Vector2( 2.00, 0 ), velocity: new Vector2( 0, 23.4457 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.SUN_PLANET_MOON, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 10, position: new Vector2( 1.60, 0 ), velocity: new Vector2( 0, 25.3467 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 1.40, 0 ), velocity: new Vector2( 0, 11.1948 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.SUN_PLANET_COMET, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 1, position: new Vector2( 1.50, 0 ), velocity: new Vector2( 0, 25.3467 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -2.20, 1.30 ), velocity: new Vector2( -4.2244, -7.3928 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.TROJAN_ASTEROIDS, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 5, position: new Vector2( 1.50, 0 ), velocity: new Vector2( 0, 25.1355 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 0.75, -1.30 ), velocity: new Vector2( 21.7559, 12.6733 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 0.75, 1.30 ), velocity: new Vector2( -21.7559, 12.6733 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.ELLIPSES, [
      new BodyInfo( { isActive: true, mass: 250, position: new Vector2( -1.00, 0 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -0.15, 0 ), velocity: new Vector2( 0, 31.8946 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 1.50, 0 ), velocity: new Vector2( 0, 12.6733 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 3.20, 0 ), velocity: new Vector2( 0, 7.8152 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.HYPERBOLIC, [
      new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 0.25 ), velocity: new Vector2( 0, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -2.50, -0.70 ), velocity: new Vector2( 25.3467, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -2.50, -1.40 ), velocity: new Vector2( 25.3467, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -2.50, -2.10 ), velocity: new Vector2( 25.3467, 0 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.SLINGSHOT, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0.01, 0 ), velocity: new Vector2( 0, -0.2112 ) } ),
      new BodyInfo( { isActive: true, mass: 10, position: new Vector2( 1.31, 0.55 ), velocity: new Vector2( -11.6172, 24.2906 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -0.06, -1.28 ), velocity: new Vector2( 17.5315, 0 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.DOUBLE_SLINGSHOT, [
      new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -0.2112 ) } ),
      new BodyInfo( { isActive: true, mass: 5, position: new Vector2( 0, -1.12 ), velocity: new Vector2( 28.3038, 0 ) } ),
      new BodyInfo( { isActive: true, mass: 5, position: new Vector2( 1.86, -0.05 ), velocity: new Vector2( 0.2112, 23.4457 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 0.70, 0.72 ), velocity: new Vector2( -9.9275, 13.307 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.BINARY_STAR_PLANET, [
      new BodyInfo( { isActive: true, mass: 150, position: new Vector2( -1.00, 0 ), velocity: new Vector2( 0, -12.6733 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 1.00, 0 ), velocity: new Vector2( 0, 10.5611 ) } ),
      new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -0.50, 0 ), velocity: new Vector2( 0, 25.3467 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.FOUR_STAR_BALLET, [
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( -1.00, 1.00 ), velocity: new Vector2( -10.5611, -10.5611 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 1.00, 1.00 ), velocity: new Vector2( -10.5611, 10.5611 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 1.00, -1.00 ), velocity: new Vector2( 10.5611, 10.5611 ) } ),
      new BodyInfo( { isActive: true, mass: 120, position: new Vector2( -1.00, -1.00 ), velocity: new Vector2( 10.5611, -10.5611 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.DOUBLE_DOUBLE, [
      new BodyInfo( { isActive: true, mass: 60, position: new Vector2( -1.15, -0.03 ), velocity: new Vector2( 0, -32.5283 ) } ),
      new BodyInfo( { isActive: true, mass: 70, position: new Vector2( 1.02, 0 ), velocity: new Vector2( 0.2112, 31.6834 ) } ),
      new BodyInfo( { isActive: true, mass: 55, position: new Vector2( -0.77, -0.02 ), velocity: new Vector2( -0.2112, 8.8713 ) } ),
      new BodyInfo( { isActive: true, mass: 62, position: new Vector2( 1.35, 0 ), velocity: new Vector2( -0.2112, -10.9836 ) } )
    ] );

    // Custom gets set to whatever other orbital system is currently selected, so it has an empty BodyInfo[].
    this.orbitalSystemMap.set( OrbitalSystem.CUSTOM, [] );

    // Orbital systems that can be viewed and customized only via PhET-iO
    // See https://github.com/phetsims/my-solar-system/issues/233
    this.orbitalSystemMap.set( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_1, [
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -3, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -1, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 1, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 3, 0 ), velocity: new Vector2( 0, 10 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_2, [
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -3, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -1, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 1, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 3, 0 ), velocity: new Vector2( 0, 10 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_3, [
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -3, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -1, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 1, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 3, 0 ), velocity: new Vector2( 0, 10 ) } )
    ] );
    this.orbitalSystemMap.set( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_4, [
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -3, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -1, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 1, 0 ), velocity: new Vector2( 0, 10 ) } ),
      new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 3, 0 ), velocity: new Vector2( 0, 10 ) } )
    ] );
  }
}

mySolarSystem.register( 'LabModel', LabModel );