// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model that controls the logic for the Lab Screen.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import mySolarSystem from '../../mySolarSystem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import OrbitalSystem from './OrbitalSystem.js';
import OrbitalSystemInfoProperty from './OrbitalSystemInfoProperty.js';
import MySolarSystemModel from '../../common/model/MySolarSystemModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import BodyInfo from '../../../../solar-system-common/js/model/BodyInfo.js';
import MySolarSystemColors from '../../common/MySolarSystemColors.js';

export default class LabModel extends MySolarSystemModel {

  // The OrbitalSystem that is currently selected
  public readonly orbitalSystemProperty: EnumerationProperty<OrbitalSystem>;

  // Orbital systems that can be viewed and customized only via PhET-iO. They are private because they can be accessed
  // only via PhET-iO API or Studio. See https://github.com/phetsims/my-solar-system/issues/233
  private readonly orbitalSystem1Property: OrbitalSystemInfoProperty;
  private readonly orbitalSystem2Property: OrbitalSystemInfoProperty;
  private readonly orbitalSystem3Property: OrbitalSystemInfoProperty;
  private readonly orbitalSystem4Property: OrbitalSystemInfoProperty;

  public constructor( tandem: Tandem ) {
    super( {
      // MySolarSystemModelOptions
      defaultBodyInfo: [
        new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -2.3446 ) } ),
        new BodyInfo( { isActive: true, mass: 25, position: new Vector2( 2.00, 0 ), velocity: new Vector2( 0, 23.4457 ) } ),
        new BodyInfo( { isActive: false, mass: 0.1, position: new Vector2( 1.00, 0 ), velocity: new Vector2( 0, 31.6834 ) } ),
        new BodyInfo( { isActive: false, mass: 0.1, position: new Vector2( -1.00, -1.00 ), velocity: new Vector2( 25.3467, 0 ) } )
      ],
      bodyColors: [
        MySolarSystemColors.body1ColorProperty,
        MySolarSystemColors.body2ColorProperty,
        MySolarSystemColors.body3ColorProperty,
        MySolarSystemColors.body4ColorProperty
      ],
      numberOfActiveBodiesPropertyPhetioReadOnly: false,
      isLab: true,
      tandem: tandem
    } );

    this.orbitalSystemProperty = new EnumerationProperty( OrbitalSystem.SUN_PLANET, {
      tandem: tandem.createTandem( 'orbitalSystemProperty' ),
      phetioFeatured: true
    } );

    const maxNumberOfBodies = this.bodies.length;
    const phetioOrbitalSystemsTandem = tandem.createTandem( 'phetioOrbitalSystems' );
    this.orbitalSystem1Property = new OrbitalSystemInfoProperty( OrbitalSystem.ORBITAL_SYSTEM_1,
      this.orbitalSystemProperty, maxNumberOfBodies, phetioOrbitalSystemsTandem.createTandem( 'orbitalSystem1Property' ) );
    this.orbitalSystem2Property = new OrbitalSystemInfoProperty( OrbitalSystem.ORBITAL_SYSTEM_2,
      this.orbitalSystemProperty, maxNumberOfBodies, phetioOrbitalSystemsTandem.createTandem( 'orbitalSystem2Property' ) );
    this.orbitalSystem3Property = new OrbitalSystemInfoProperty( OrbitalSystem.ORBITAL_SYSTEM_3,
      this.orbitalSystemProperty, maxNumberOfBodies, phetioOrbitalSystemsTandem.createTandem( 'orbitalSystem3Property' ) );
    this.orbitalSystem4Property = new OrbitalSystemInfoProperty( OrbitalSystem.ORBITAL_SYSTEM_4,
      this.orbitalSystemProperty, maxNumberOfBodies, phetioOrbitalSystemsTandem.createTandem( 'orbitalSystem4Property' ) );

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
        if ( !orbitalSystem.isPhetioConfigurable ) {
          this.followCenterOfMass();
        }
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
  }

  public override reset(): void {
    super.reset();

    // Change orbitalSystemProperty briefly to custom so the reset actually triggers the listeners.
    // If this is not done, orbitalSystemProperty listeners (including the one added in the constructor above) won't be called.
    this.orbitalSystemProperty.value = OrbitalSystem.CUSTOM;
    this.orbitalSystemProperty.reset();

    // Do not reset phetioOrbitalSystem*Property, since they are for PhET-iO only.

    super.restart();
  }
}

mySolarSystem.register( 'LabModel', LabModel );