// Copyright 2023, University of Colorado Boulder

/**
 * OrbitalSystem enumerates the preset and custom configurations of bodies in the Lab Screen.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import solarSystemCommon from '../../../../solar-system-common/js/solarSystemCommon.js';
import BodyInfo from '../../../../solar-system-common/js/model/BodyInfo.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// BodyInfo[] shared by all systems that can be configured via PhET-iO
const PHET_IO_ORBITAL_SYSTEM_BODY_INFO = [
  new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -3, 0 ), velocity: new Vector2( 0, 10 ) } ),
  new BodyInfo( { isActive: true, mass: 100, position: new Vector2( -1, 0 ), velocity: new Vector2( 0, 10 ) } ),
  new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 1, 0 ), velocity: new Vector2( 0, 10 ) } ),
  new BodyInfo( { isActive: true, mass: 100, position: new Vector2( 3, 0 ), velocity: new Vector2( 0, 10 ) } )
];

export default class OrbitalSystem extends EnumerationValue {

  // Preset systems that cannot be changed.
  public static readonly SUN_PLANET = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -2.3446 ) } ),
    new BodyInfo( { isActive: true, mass: 25, position: new Vector2( 2.00, 0 ), velocity: new Vector2( 0, 23.4457 ) } )
  ] );
  public static readonly SUN_PLANET_MOON = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) } ),
    new BodyInfo( { isActive: true, mass: 10, position: new Vector2( 1.60, 0 ), velocity: new Vector2( 0, 25.3467 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 1.40, 0 ), velocity: new Vector2( 0, 11.1948 ) } )
  ] );
  public static readonly SUN_PLANET_COMET = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) } ),
    new BodyInfo( { isActive: true, mass: 1, position: new Vector2( 1.50, 0 ), velocity: new Vector2( 0, 25.3467 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -2.20, 1.30 ), velocity: new Vector2( -4.2244, -7.3928 ) } )
  ] );
  public static readonly TROJAN_ASTEROIDS = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, 0 ) } ),
    new BodyInfo( { isActive: true, mass: 5, position: new Vector2( 1.50, 0 ), velocity: new Vector2( 0, 25.1355 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 0.75, -1.30 ), velocity: new Vector2( 21.7559, 12.6733 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 0.75, 1.30 ), velocity: new Vector2( -21.7559, 12.6733 ) } )
  ] );
  public static readonly ELLIPSES = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 250, position: new Vector2( -1.00, 0 ), velocity: new Vector2( 0, 0 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -0.15, 0 ), velocity: new Vector2( 0, 31.8946 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 1.50, 0 ), velocity: new Vector2( 0, 12.6733 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 3.20, 0 ), velocity: new Vector2( 0, 7.8152 ) } )
  ] );
  public static readonly HYPERBOLIC = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 250, position: new Vector2( 0, 0.25 ), velocity: new Vector2( 0, 0 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -2.50, -0.70 ), velocity: new Vector2( 25.3467, 0 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -2.50, -1.40 ), velocity: new Vector2( 25.3467, 0 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -2.50, -2.10 ), velocity: new Vector2( 25.3467, 0 ) } )
  ] );
  public static readonly SLINGSHOT = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0.01, 0 ), velocity: new Vector2( 0, -0.2112 ) } ),
    new BodyInfo( { isActive: true, mass: 10, position: new Vector2( 1.31, 0.55 ), velocity: new Vector2( -11.6172, 24.2906 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -0.06, -1.28 ), velocity: new Vector2( 17.5315, 0 ) } )
  ] );
  public static readonly DOUBLE_SLINGSHOT = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 200, position: new Vector2( 0, 0 ), velocity: new Vector2( 0, -0.2112 ) } ),
    new BodyInfo( { isActive: true, mass: 5, position: new Vector2( 0, -1.12 ), velocity: new Vector2( 28.3038, 0 ) } ),
    new BodyInfo( { isActive: true, mass: 5, position: new Vector2( 1.86, -0.05 ), velocity: new Vector2( 0.2112, 23.4457 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( 0.70, 0.72 ), velocity: new Vector2( -9.9275, 13.307 ) } )
  ] );
  public static readonly BINARY_STAR_PLANET = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 150, position: new Vector2( -1.00, 0 ), velocity: new Vector2( 0, -12.6733 ) } ),
    new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 1.00, 0 ), velocity: new Vector2( 0, 10.5611 ) } ),
    new BodyInfo( { isActive: true, mass: 0.000001, position: new Vector2( -0.50, 0 ), velocity: new Vector2( 0, 25.3467 ) } )
  ] );
  public static readonly FOUR_STAR_BALLET = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 120, position: new Vector2( -1.00, 1.00 ), velocity: new Vector2( -10.5611, -10.5611 ) } ),
    new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 1.00, 1.00 ), velocity: new Vector2( -10.5611, 10.5611 ) } ),
    new BodyInfo( { isActive: true, mass: 120, position: new Vector2( 1.00, -1.00 ), velocity: new Vector2( 10.5611, 10.5611 ) } ),
    new BodyInfo( { isActive: true, mass: 120, position: new Vector2( -1.00, -1.00 ), velocity: new Vector2( 10.5611, -10.5611 ) } )
  ] );
  public static readonly DOUBLE_DOUBLE = new OrbitalSystem( [
    new BodyInfo( { isActive: true, mass: 60, position: new Vector2( -1.15, -0.03 ), velocity: new Vector2( 0, -32.5283 ) } ),
    new BodyInfo( { isActive: true, mass: 70, position: new Vector2( 1.02, 0 ), velocity: new Vector2( 0.2112, 31.6834 ) } ),
    new BodyInfo( { isActive: true, mass: 55, position: new Vector2( -0.77, -0.02 ), velocity: new Vector2( -0.2112, 8.8713 ) } ),
    new BodyInfo( { isActive: true, mass: 62, position: new Vector2( 1.35, 0 ), velocity: new Vector2( -0.2112, -10.9836 ) } )
  ] );

  // Orbital systems that can be viewed and customized only via PhET-iO
  // See https://github.com/phetsims/my-solar-system/issues/233
  public static readonly ORBITAL_SYSTEM_1 = new OrbitalSystem( PHET_IO_ORBITAL_SYSTEM_BODY_INFO );
  public static readonly ORBITAL_SYSTEM_2 = new OrbitalSystem( PHET_IO_ORBITAL_SYSTEM_BODY_INFO );
  public static readonly ORBITAL_SYSTEM_3 = new OrbitalSystem( PHET_IO_ORBITAL_SYSTEM_BODY_INFO );
  public static readonly ORBITAL_SYSTEM_4 = new OrbitalSystem( PHET_IO_ORBITAL_SYSTEM_BODY_INFO );

  // CUSTOM gets set to whatever other orbital system is currently selected, so it has empty BodyInfo[].
  public static readonly CUSTOM = new OrbitalSystem( [] );

  public static readonly enumeration = new Enumeration( OrbitalSystem );

  // Must be writeable to support customization of PHET_IO_ORBITAL_SYSTEM_*
  public bodyInfo: BodyInfo[];

  public constructor( bodyInfo: BodyInfo[] ) {
    super();
    this.bodyInfo = bodyInfo;
  }
}

solarSystemCommon.register( 'OrbitalSystem', OrbitalSystem );