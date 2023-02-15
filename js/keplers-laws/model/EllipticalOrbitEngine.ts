// Copyright 2022-2023, University of Colorado Boulder
/**
 * The Elliptical Orbit model element. Evolves the body and
 * keeps track of orbital elements.
 * Serves as the Engine for the Kepler's Laws Model
 *
 * Variable definitions:
 * r: position vector
 * v: velocity vector
 * rAngle: heading of r
 * vAngle: heading of v
 * a: semi-major axis
 * b: semi-minor axis
 * c: focal distance
 * e: eccentricity
 * nu: true anomaly ( angular position of the body seen from main focus )
 * w: argument of periapsis ( angular deviation of periapsis from the 0° heading )
 * M: Initial mean anomaly ( angular position of the body seen from the center of the ellipse )
 * W: angular velocity
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Body from '../../common/model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import Engine from '../../common/model/Engine.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MySolarSystemConstants from '../../common/MySolarSystemConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import OrbitTypes from './OrbitTypes.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import OrbitalArea from './OrbitalArea.js';
import Property from '../../../../axon/js/Property.js';

const TWOPI = 2 * Math.PI;

// Scaling down factor for the escape velocity to avoid unwanted errors
const epsilon = 0.99;

// Creation of children classes
class Ellipse {
  public constructor(
    public a: number,
    public b: number,
    public c: number,
    public e: number,
    public w: number,
    public M: number,
    public W: number
  ) {}
}

export default class EllipticalOrbitEngine extends Engine {
  public mu = 2e6; // mu = G * Mass_sun, and G in this sim is 1e4
  public readonly sun: Body;
  public readonly body: Body;
  public readonly sunMassProperty: Property<number>;
  public readonly changedEmitter = new Emitter();
  public periodDivisions = 4;
  public orbitalAreas: OrbitalArea[] = [];
  public updateAllowed = true;
  public retrograde = false;
  public alwaysCircles = false;

  public semiMajorAxisProperty = new NumberProperty( 1 );
  public semiMinorAxisProperty = new NumberProperty( 1 );
  public focalDistanceProperty = new NumberProperty( 1 );
  public periodProperty = new NumberProperty( 1 );
  public eccentricityProperty = new NumberProperty( 0 );

  // These variable names are letters to compare and read more easily the equations they are in
  public a = 1;  // semi-major axis
  public b = 0;  // semi-minor axis
  public c = 0;  // focal distance
  public e = 0;  // eccentricity
  public w = 0;  // argument of periapsis
  public M = 0;  // mean anomaly
  public W = 0;  // angular velocity
  public T = 1;  // period
  public nu = 0; // true anomaly
  public L = 0;  // angular momentum

  // Keeps track of the validity of the orbit. True if elliptic, false either if parabolic or collision orbit.
  public allowedOrbitProperty = new BooleanProperty( false );
  public readonly orbitTypeProperty: EnumerationProperty<OrbitTypes>;
  public readonly escapeSpeedProperty = new NumberProperty( 0 );
  public readonly escapeRadiusProperty = new NumberProperty( 0 );

  public totalArea = 1;
  public segmentArea = 1;

  public constructor( bodies: ObservableArray<Body> ) {
    super( bodies );

    this.orbitTypeProperty = new EnumerationProperty( OrbitTypes.STABLE_ORBIT );

    // In the case of this screen, the body 0 is the sun, and the body 1 is the planet
    this.sun = bodies[ 0 ];
    this.body = bodies[ 1 ];
    this.sunMassProperty = bodies[ 0 ].massProperty;

    // Populate the orbital areas
    for ( let i = 0; i < MySolarSystemConstants.MAX_ORBITAL_DIVISIONS; i++ ) {
      this.orbitalAreas.push( new OrbitalArea() );
    }

    // Multilink to update the orbit based on the bodies position and velocity
    Multilink.multilink(
      [
        this.body.positionProperty,
        this.body.velocityProperty,
        this.bodies[ 0 ].massProperty
      ],
      (
        position: Vector2,
        velocity: Vector2,
        mass: number
      ) => {
        const rMagnitude = position.magnitude;
        const vMagnitude = velocity.magnitude;

        this.mu = 1e4 * mass;

        this.escapeRadiusProperty.value = 2 * this.mu / ( vMagnitude * vMagnitude ) * epsilon * epsilon;
        this.escapeSpeedProperty.value = Math.sqrt( 2 * this.mu / rMagnitude ) * epsilon;
      } );

    // Multilink to release orbital updates when the user is controlling the body
    Multilink.multilink(
      [
        this.body.userControlledPositionProperty,
        this.body.userControlledVelocityProperty,
        this.bodies[ 0 ].userControlledMassProperty
      ],
      (
        userControlledPosition: boolean,
        userControlledVelocity: boolean,
        userControlledMass: boolean
      ) => {
        this.updateAllowed = userControlledPosition || userControlledVelocity || userControlledMass;
        this.resetOrbitalAreas();
        this.update();
      } );
  }

  public thirdLaw( a: number ): number {
    return Math.pow( 2e6 * a * a * a / this.mu, 1 / 2 );
  }

  public override run( dt: number ): void {
    // Prevent the orbit from updating if the body is orbiting
    this.updateAllowed = false;

    // Calculate the new position and velocity of the body
    this.M += dt * this.W;
    this.nu = this.getTrueAnomaly( this.M );

    // Update the position and velocity of the body
    const currentPosition = this.body.positionProperty.value;
    const newPosition = this.createPolar( this.nu, this.w );
    const newVelocity = newPosition.minus( currentPosition ).normalize();
    const newAngularMomentum = newPosition.crossScalar( newVelocity );
    newVelocity.multiplyScalar( this.L / newAngularMomentum );

    this.body.positionProperty.value = newPosition;
    this.body.velocityProperty.value = newVelocity;

    this.updateForces( newPosition );

    this.calculateOrbitalDivisions( true );
    this.changedEmitter.emit();
  }

  public updateForces( position: Vector2 ): void {
    const force = position.timesScalar( -this.mu * this.body.massProperty.value / Math.pow( position.magnitude, 3 ) );
    this.body.forceProperty.value = force;
    this.body.accelerationProperty.value = force.timesScalar( 1 / this.body.massProperty.value );
    this.sun.forceProperty.value = force.timesScalar( -1 );
  }
  /**
   * Based on the current position and velocity of the body
   * Updates the orbital elements of the body using Orbital Mechanics Analytic Equations
   */
  public override update(): void {
    this.resetOrbitalAreas();

    const r = this.body.positionProperty.value;
    this.updateForces( r );

    let escaped = false;
    if ( this.alwaysCircles ) {
      this.enforceCircularOrbit( r );
    }
    else {
      escaped = this.body.velocityProperty.value.magnitude >= this.escapeSpeedProperty.value * epsilon;
      if ( escaped ) {
        this.enforceEscapeSpeed();
        this.allowedOrbitProperty.value = false;
        this.orbitTypeProperty.value = OrbitTypes.ESCAPE_ORBIT;
        this.eccentricityProperty.value = 1;
      }
    }

    const v = this.body.velocityProperty.value;
    this.L = r.crossScalar( v );

    const { a, b, c, e, w, M, W } = this.calculateEllipse( r, v );
    this.a = a;
    this.b = b;
    this.c = c;
    this.e = e;
    this.w = w;
    this.M = M;
    this.W = W;

    this.nu = this.getTrueAnomaly( this.M );

    this.T = this.thirdLaw( this.a );

    this.totalArea = Math.PI * this.a * this.b;
    this.segmentArea = this.totalArea / this.periodDivisions;

    this.semiMajorAxisProperty.value = this.a * MySolarSystemConstants.POSITION_MULTIPLIER;
    this.semiMinorAxisProperty.value = this.b * MySolarSystemConstants.POSITION_MULTIPLIER;
    this.focalDistanceProperty.value = this.c * MySolarSystemConstants.POSITION_MULTIPLIER;
    this.periodProperty.value = this.T * MySolarSystemConstants.TIME_MULTIPLIER / 218;

    if ( this.collidedWithSun( a, e ) ) {
      this.allowedOrbitProperty.value = false;
      this.orbitTypeProperty.value = OrbitTypes.CRASH_ORBIT;
    }
    else if ( !escaped ) {
      this.allowedOrbitProperty.value = true;
      this.orbitTypeProperty.value = OrbitTypes.STABLE_ORBIT;
      this.calculateOrbitalDivisions( false );
    }

    if ( e !== this.eccentricityProperty.value && this.orbitTypeProperty.value !== OrbitTypes.ESCAPE_ORBIT ) {
      if ( this.alwaysCircles || this.e < 0.01 ) {
        this.eccentricityProperty.value = 0;
      }
      else {
        this.eccentricityProperty.value = e;
      }
    }

    this.changedEmitter.emit();
  }

  private enforceCircularOrbit( position: Vector2 ): void {
    // Always set the velocity to be perpendicular to the position and circular
    const direction = this.retrograde ? -1 : 1;
    this.body.velocityProperty.value =
      position.perpendicular.normalize().
      multiplyScalar( direction * 1.0001 * Math.sqrt( this.mu / position.magnitude ) );
    // TODO: Velocity a bit over circular orbit to avoid some errors, but they shouldnt be happening
  }

  private enforceEscapeSpeed(): void {
    this.body.velocityProperty.value = this.body.velocityProperty.value.normalized().multiplyScalar( this.escapeSpeedProperty.value );
  }

  private collidedWithSun( a: number, e: number ): boolean {
    return a * ( 1 - e ) < Body.massToRadius( this.bodies[ 0 ].massProperty.value );
  }

  public createPolar( nu: number, w = 0 ): Vector2 {
    return Vector2.createPolar( this.calculateR( this.a, this.e, nu ), nu + w );
  }

  /**
   * Based on the number of divisions provided by the model,
   * divides the orbit in equal time sections.
   */
  private calculateOrbitalDivisions( fillAreas: boolean ): void {
    // Nu is the angular position of the body as seen from the main focus
    let previousNu = 0;
    let bodyAngle = -this.nu;

    this.segmentArea = this.totalArea / this.periodDivisions;

    this.orbitalAreas.forEach( ( orbitalArea, i ) => {
      if ( i < this.periodDivisions && this.allowedOrbitProperty.value ) {
        // Calculate true anomaly
        // ( i + 1 ) because first angle is always nu = 0
        const M = ( i + 1 ) * TWOPI / this.periodDivisions;
        const nu = this.getTrueAnomaly( M );

        // Update orbital areas angles, constrained by the startAngle
        let startAngle = previousNu;
        let endAngle = Utils.moduloBetweenDown( nu, startAngle, startAngle + TWOPI );
        bodyAngle = Utils.moduloBetweenDown( bodyAngle, startAngle, startAngle + TWOPI );

        if ( fillAreas ) {
          // Body inside the area
          if ( startAngle <= bodyAngle && bodyAngle < endAngle ) {
            orbitalArea.insideProperty.value = true;
            orbitalArea.alreadyEntered = true;

            // Map opacity from 0 to 1 based on BodyAngle from startAngle to endAngle (inside area)
            const completionRate = ( bodyAngle - startAngle ) / ( endAngle - startAngle );
            if ( this.retrograde ) {
              startAngle = bodyAngle;
              orbitalArea.completion = ( 1 - completionRate );
            }
            else {
              endAngle = bodyAngle;
              orbitalArea.completion = completionRate;
            }
            orbitalArea.sweptArea = this.calculateSweptArea( startAngle, endAngle );
          }
          // OUTSIDE THE AREA
          else {
            orbitalArea.insideProperty.value = false;
            // Map completion from 1 to 0 based on BodyAngle from startAngle to endAngle (outside area)
            let completionFalloff = ( bodyAngle - startAngle - TWOPI ) / ( endAngle - startAngle - TWOPI );

            // Correct for negative values
            completionFalloff = Utils.moduloBetweenDown( completionFalloff, 0, 1 );

            orbitalArea.completion = this.retrograde ? ( 1 - completionFalloff ) : completionFalloff;
          }
        }

        // Update orbital area properties
        if ( !orbitalArea.alreadyEntered ) {
          orbitalArea.completion = 0; // Set it to 0 if it hasn't entered yet
        }
        orbitalArea.dotPosition = this.createPolar( nu ); // Position for the dots
        orbitalArea.startPosition = this.createPolar( startAngle );
        orbitalArea.endPosition = this.createPolar( endAngle );
        orbitalArea.active = true;

        previousNu = nu;
      }
      else {
        orbitalArea.completion = 0;
        orbitalArea.active = false;
        orbitalArea.insideProperty.value = false;
      }
    } );
  }

  private calculateSweptArea( startAngle: number, endAngle: number ): number {
    // Convert angles from foci to center to get the correct area
    startAngle = this.getMeanAnomaly( startAngle, this.e );
    endAngle = this.getMeanAnomaly( endAngle, this.e );
    return Math.abs( 0.5 * this.a * this.b * ( endAngle - startAngle ) );
  }

  private calculate_a( r: Vector2, v: Vector2 ): number {
    const rMagnitude = r.magnitude;
    const vMagnitude = v.magnitude;

    return rMagnitude * this.mu / ( 2 * this.mu - rMagnitude * vMagnitude * vMagnitude );
  }

  private calculate_e( r: Vector2, v: Vector2, a: number ): number {
    const rMagnitude = r.magnitude;
    const vMagnitude = v.magnitude;
    const rAngle = r.angle;
    const vAngle = v.angle;

    return Math.pow(
      1 - Math.pow( rMagnitude * vMagnitude * Math.sin( vAngle - rAngle ), 2 )
      / ( a * this.mu ), 0.5 );
  }

  /**
   * Calculates the different angles present in the ellipse
   */
  private calculateAngles( r: Vector2, v: Vector2, a: number, e: number ): number[] {
    const rMagnitude = r.magnitude;

    // Position and velocity angles
    const rAngle = r.angle;
    const vAngle = v.angle;

    // Circular orbit case
    let nu = rAngle;

    // Elliptical orbit case
    if ( e > 0 ) {
      // True anomaly comes from the polar ellipse equation. Based on rMagnitude, at what angle should it be
      nu = Math.acos( Utils.clamp( ( 1 / e ) * ( a * ( 1 - e * e ) / rMagnitude - 1 ), -1, 1 ) );

      // Determine the cuadrant of the true anomaly
      if ( Math.cos( rAngle - vAngle ) > 0 ) {
        nu *= -1;
      }
    }

    // Mean angular velocity
    let W = -500 / this.thirdLaw( a );

    this.retrograde = r.crossScalar( v ) > 0;
    if ( this.retrograde ) {
      nu *= -1;
      W *= -1;
    }

    // Calculate Mean Anomaly
    const M = this.getMeanAnomaly( nu, e );

    // Calculate the argument of periapsis
    const w = rAngle - nu;

    return [ w, M, W ];
  }

  private calculateEllipse( r: Vector2, v: Vector2 ): Ellipse {
    const a = this.calculate_a( r, v );
    const e = this.calculate_e( r, v, a );
    const b = a * Math.sqrt( 1 - e * e );
    const c = a * e;
    const [ w, M, W ] = this.calculateAngles( r, v, a, e );
    return new Ellipse( a, b, c, e, w, M, W );
  }

  private calculateR( a: number, e: number, nu: number ): number {
    return a * ( 1 - e * e ) / ( 1 + e * Math.cos( nu ) );
  }

  // Numerical solution to Kepler's Equations for Eccentric Anomaly (E) and then True Anomaly (nu)
  private getTrueAnomaly( M: number ): number {
    const E1 = M + this.e * Math.sin( M );
    const E2 = M + this.e * Math.sin( E1 );
    const E = M + this.e * Math.sin( E2 );
    const nu = Math.atan2( Math.pow( 1 - this.e * this.e, 0.5 ) * Math.sin( E ), Math.cos( E ) - this.e );
    return Utils.moduloBetweenDown( nu, 0, TWOPI );
  }

  private getMeanAnomaly( nu: number, e: number ): number {
    // Calculate Eccentric Anomaly and determine its cuadrant
    let E = -Math.acos( Utils.clamp( ( e + Math.cos( nu ) ) / ( 1 + e * Math.cos( nu ) ), -1, 1 ) );
    if ( Math.sin( E ) * Math.sin( nu ) < 0 ) {
      E *= -1;
    }

    // Calculate Mean Anomaly
    const M = E - e * Math.sin( E );
    return M;
  }

  public resetOrbitalAreas(): void {
    this.orbitalAreas.forEach( area => {
      area.reset();
    } );
    this.calculateOrbitalDivisions( true );
  }

  public override reset(): void {
    this.resetOrbitalAreas();
    this.a = 1; // semiMajor axis
    this.e = 0; // eccentricity
    this.w = 0; // argument of periapsis
    this.M = 0; // mean anomaly
    this.W = 0; // angular velocity
    this.T = 1; // period
    this.nu = 0; // true anomaly
    this.update();
  }
}

mySolarSystem.register( 'EllipticalOrbitEngine', EllipticalOrbitEngine );