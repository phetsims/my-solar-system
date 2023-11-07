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

  // Orbital systems that can be viewed and customized only via PhET-iO. Private because they can be accessed
  // only via PhET-iO API or Studio. See https://github.com/phetsims/my-solar-system/issues/233
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

    this.orbitalSystemProperty.link( orbitalSystem => {
      this.clearPaths();
      if ( orbitalSystem !== OrbitalSystem.CUSTOM ) {
        this.isPlayingProperty.value = false;
        this.isAnyBodyCollidedProperty.reset();
        this.timeProperty.reset();
        this.loadBodyInfo( orbitalSystem.bodyInfo );
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

    this.phetioOrbitalSystem1Property = new PhetioOrbitalSystemProperty( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_1,
      this.orbitalSystemProperty, phetioOrbitalSystemsTandem.createTandem( 'phetioOrbitalSystem1Property' ) );

    this.phetioOrbitalSystem2Property = new PhetioOrbitalSystemProperty( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_2,
      this.orbitalSystemProperty, phetioOrbitalSystemsTandem.createTandem( 'phetioOrbitalSystem2Property' ) );

    this.phetioOrbitalSystem3Property = new PhetioOrbitalSystemProperty( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_3,
      this.orbitalSystemProperty, phetioOrbitalSystemsTandem.createTandem( 'phetioOrbitalSystem3Property' ) );

    this.phetioOrbitalSystem4Property = new PhetioOrbitalSystemProperty( OrbitalSystem.PHET_IO_ORBITAL_SYSTEM_4,
      this.orbitalSystemProperty, phetioOrbitalSystemsTandem.createTandem( 'phetioOrbitalSystem4Property' ) );
  }

  public override reset(): void {
    super.reset();

    // Change orbitalSystemProperty briefly to custom so the reset actually triggers the listeners.
    // If this is not done, orbitalSystemProperty listeners (including the one added in the constructor above) won't be called.
    this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
    this.orbitalSystemProperty.reset();

    super.restart();
  }
}

/**
 * PhetioOrbitalSystemProperty is the Property used by a PhET-iO client to customize an orbital system.
 */
class PhetioOrbitalSystemProperty extends Property<BodyInfo[]> {

  public constructor( orbitalSystem: OrbitalSystem,
                      orbitalSystemProperty: Property<OrbitalSystem>,
                      tandem: Tandem ) {

    super( orbitalSystem.bodyInfo, {
      tandem: tandem,
      phetioValueType: ArrayIO( BodyInfo.BodyInfoIO )
    } );

    this.lazyLink( bodyInfo => {
      orbitalSystem.bodyInfo = bodyInfo;

      // For a refresh if the system that we're changing is the selected system.
      if ( orbitalSystemProperty.value === orbitalSystem ) {
        orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
        orbitalSystemProperty.value = orbitalSystem;
      }
    } );
  }
}

mySolarSystem.register( 'LabModel', LabModel );