// Copyright 2022, University of Colorado Boulder
/**
 * The Elliptical Orbit model element. Evolves the body and
 * keeps track of orbital elements.
 * Serves as the Engine for the Keplers Laws Model
 *
 * Variable definitions:
 * r: position vector
 * v: velocity vector
 * rAngle: heading of r
 * vAngle: heading of v
 * a: semimajor axis
 * e: excentricity
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

const TWOPI = 2 * Math.PI;

// Creation of children classes
class Ellipse {
  public constructor(
    public a: number,
    public e: number,
    public w: number,
    public M: number,
    public W: number
  ) {}
}

class OrbitalArea {
  // TODO: Document what all this means
  public dotPosition = Vector2.ZERO;
  public startPosition = Vector2.ZERO;
  public endPosition = Vector2.ZERO;
  public completion = 0;
  public insideProperty = new BooleanProperty( false );
  public alreadyEntered = false;
  public active = false;
  public resetted = true;

  public constructor() {
    // noop
  }

  public reset(): void {
    this.dotPosition = Vector2.ZERO;
    this.startPosition = Vector2.ZERO;
    this.endPosition = Vector2.ZERO;
    this.completion = 0;
    this.insideProperty.reset();
    this.alreadyEntered = false;
    this.active = false;
    this.resetted = true;
  }
}

export default class EllipticalOrbit extends Engine {
  private readonly mu = 2e6;
  public readonly body: Body;
  public readonly changedEmitter = new Emitter();
  public periodDivisions = 4;
  public orbitalAreas: OrbitalArea[] = [];
  public updateAllowed = true;
  public retrograde = false;

  // These variable names are letters to compare and read more easily the equations they are in
  public a = 1;  // semimajor axis
  public e = 0;  // eccentricity
  public w = 0;  // argument of periapsis
  public M = 0;  // mean anomaly
  public W = 0;  // angular velocity
  public T = 0;  // period
  public nu = 0; // true anomaly
  public L = 0;  // angular momentum

  // Keeps track of the validity of the orbit. True if elliptic, false either if parabolic or collision orbit.
  public allowedOrbit: boolean;

  public constructor( bodies: ObservableArray<Body> ) {
    super( bodies );

    // Populate the orbital areas
    for ( let i = 0; i < MySolarSystemConstants.MAX_ORBITAL_DIVISIONS; i++ ) {
      this.orbitalAreas.push( new OrbitalArea() );
    }

    // In the case of this screen, the body 0 is the sun, and the body 1 is the planet
    this.body = bodies[ 1 ];
    this.allowedOrbit = false;
    this.update();

    // Multilink to update the orbit based on the bodies position and velocity
    Multilink.multilink(
      [ this.body.userControlledPositionProperty, this.body.userControlledVelocityProperty ],
      ( userControlledPosition: boolean, userControlledVelocity: boolean ) => {
        this.updateAllowed = userControlledPosition || userControlledVelocity;
        this.resetOrbitalAreas();
        this.update();
      } );
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

    this.calculateOrbitalDivisions( true );
    this.changedEmitter.emit();
  }

  /**
   * Based on the current position and velocity of the body
   * Updates the orbital elements of the body using Orbital Mechanics Analytic Equations
   */
  public override update(): void {

    const r = this.body.positionProperty.value;
    const v = this.body.velocityProperty.value;
    this.L = r.crossScalar( v );

    this.allowedOrbit = false;
    if ( this.escapeVelocityNotExceeded( r, v ) ) {
      const { a, e, w, M, W } = this.calculateEllipse( r, v );
      this.a = a;
      this.e = e;
      this.w = w;
      this.M = M;
      this.W = W;

      // TODO: Check if the complete form of the third law should be used
      this.T = Math.pow( a, 3 / 2 );

      this.allowedOrbit = !this.collidedWithSun( a, e );

      this.calculateOrbitalDivisions( false );
    }

    this.changedEmitter.emit();
  }

  private createPolar( nu: number, w = 0 ): Vector2 {
    return Vector2.createPolar( this.calculateR( this.a, this.e, nu ), nu + w );
  }

  /**
   * Based on the number of divisions provided by the model,
   * divides the orbit in isochrone sections.
   *
   */
  private calculateOrbitalDivisions( fillAreas: boolean ): void {
    let previousNu = 0;
    let bodyAngle = -this.nu;

    this.orbitalAreas.forEach( ( orbitalArea, i ) => {
      if ( i < this.periodDivisions && this.allowedOrbit ) {
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

  private escapeVelocityNotExceeded( r: Vector2, v: Vector2 ): boolean {
    const rMagnitude = r.magnitude;
    const vMagnitude = v.magnitude;

    // Scaling down the escape velocity a little to avoid unwanted errors
    const epsilon = 0.99;

    return vMagnitude < ( epsilon * Math.pow( 2 * this.mu / rMagnitude, 0.5 ) );
  }

  private collidedWithSun( a: number, e: number ): boolean {
    return a * ( 1 - e ) < Body.massToRadius( this.bodies[ 0 ].massProperty.value );
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

    // Circular orbit
    let nu = rAngle;
    if ( e > 0 ) {
      // True anomaly comes from the polar ellipse equation. Based on rMagnitude, at what angle should it be
      nu = Math.acos( Utils.clamp( ( 1 / e ) * ( a * ( 1 - e * e ) / rMagnitude - 1 ), -1, 1 ) );

      // Determine the cuadrant of the true anomaly
      if ( Math.cos( rAngle - vAngle ) > 0 ) {
        nu *= -1;
      }
    }

    // Mean angular velocity
    let W = -500 * Math.pow( a, -3 / 2 );

    this.retrograde = r.crossScalar( v ) > 0;
    if ( this.retrograde ) {
      nu *= -1;
      W *= -1;
    }

    // Calculate Excentric Anomaly and determine its cuadrant
    let E = Math.acos( Utils.clamp( ( e + Math.cos( nu ) ) / ( 1 + e * Math.cos( nu ) ), -1, 1 ) );
    if ( Math.cos( E - nu ) < 0 ) {
      E *= -1;
    }

    // Calculate Mean Anomaly
    const M = E - e * Math.sin( E );

    // Calculate the argument of periapsis
    const w = rAngle - nu;

    return [ w, M, W ];
  }

  private calculateEllipse( r: Vector2, v: Vector2 ): Ellipse {
    const a = this.calculate_a( r, v );
    const e = this.calculate_e( r, v, a );
    const [ w, M, W ] = this.calculateAngles( r, v, a, e );
    return new Ellipse( a, e, w, M, W );
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

  public resetOrbitalAreas(): void {
    this.orbitalAreas.forEach( area => {
      area.reset();
    } );
  }

  public override reset(): void {
    this.resetOrbitalAreas();
    this.a = 1; // semimajor axis
    this.e = 0; // eccentricity
    this.w = 0; // argument of periapsis
    this.M = 0; // mean anomaly
    this.W = 0; // angular velocity
    this.T = 0; // period
    this.nu = 0; // true anomaly
  }
}

mySolarSystem.register( 'EllipticalOrbit', EllipticalOrbit );