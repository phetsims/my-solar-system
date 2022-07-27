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
 * nu: true anomaly
 * w: argument of periapsis
 * M: Initial mean anomaly
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

export default class EllipticalOrbit extends Engine {
  private readonly mu = 2e6;
  public readonly body: Body;
  public readonly predictedBody: Body;

  // These variable names are letters to compare and read more easily the equations they are in
  public a = 0; // semimajor axis
  public e = 0; // excentricity
  public w = 0; // argument of periapsis
  public M = 0; // mean anomaly
  public W = 0; // angular velocity

  public allowedOrbit: boolean;

  public constructor( bodies: ObservableArray<Body> ) {
    super( bodies );
    this.body = bodies[ 1 ];
    this.predictedBody = new Body(
      1,
      Vector2.ZERO,
      Vector2.ZERO
    );
    this.allowedOrbit = false;
    this.update();
  }

  public override update(): void {
    const r = this.body.positionProperty.value;
    const v = this.body.velocityProperty.value;

    this.allowedOrbit = false;
    if ( !this.escapeVelocityExceeded( r, v ) ) {
      const [ a, e, w, M, W ] = this.calculateEllipse( r, v );
      this.a = a;
      this.e = e;
      this.w = w;
      // this.M = M;
      M;
      this.W = W;
      if ( !this.collidedWithSun( a, e ) ) {
        this.allowedOrbit = true;
      }
    }
  }

  private escapeVelocityExceeded( r: Vector2, v: Vector2 ): boolean {
    const rMagnitude = r.magnitude;
    const vMagnitude = v.magnitude;

    return vMagnitude > ( 0.99 * Math.pow( 2 * this.mu / rMagnitude, 0.5 ) );
  }

  private collidedWithSun( a: number, e: number ): boolean {
    return a * ( 1 - e ) < 25;
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

  private calculateAngles( r: Vector2, v: Vector2, a: number, e: number ): number[] {
    const rMagnitude = r.magnitude;
    // nu comes from the polar ellipse equation
    let nu = Math.acos( Utils.clamp( ( 1 / e ) * ( a * ( 1 - e * e ) / rMagnitude - 1 ), -1, 1 ) );

    const rAngle = r.angle;
    const vAngle = v.angle;

    let W = -500 * Math.pow( a, -3 / 2 );
    if ( Math.cos( rAngle - vAngle ) > 0 ) {
      nu *= -1;
    }
    if ( r.crossScalar( v ) > 0 ) {
      nu *= -1;
      W *= -1;
    }
  
    let E0 = Math.acos( Utils.clamp( ( e + Math.cos( nu ) ) / ( 1 + e * Math.cos( nu ) ), -1, 1 ) );
    if ( Math.cos( E0 - nu ) < 0 ) {
      E0 *= -1;
    }
    const M = E0 - e * Math.sin( E0 );
  
    const th = r.angle;
    const w = th - nu;
    return [ w, M, W ];
  }

  private calculateEllipse( r: Vector2, v: Vector2 ): number[] {
    const a = this.calculate_a( r, v );
    const e = this.calculate_e( r, v, a );
    const [ w, M, W ] = this.calculateAngles( r, v, a, e );
    return [ a, e, w, M, W ];
  }

  private calculateR( a: number, e: number, nu: number ): number {
    return a * ( 1 - e * e ) / ( 1 + e * Math.cos( nu ) );
  }

  public override run( dt: number ): void {
    this.M += dt * this.W * 20;
    const nu = this.getTrueAnomaly( this.M );
    const r = this.calculateR( this.a, this.e, nu );
    this.predictedBody.positionProperty.value = new Vector2( r * Math.cos( -nu ), r * Math.sin( -nu ) );
  }

  public override reset(): void {
    // This will be filled in in the future
  }

  // Numerical solution to Keplers Equations for Excentric Anomaly (E) and then True Anomaly (nu)
  private getTrueAnomaly( M: number ): number {
    const E1 = M + this.e * Math.sin( M );
    const E2 = M + this.e * Math.sin( E1 );
    const E = M + this.e * Math.sin( E2 );
    return Math.atan2( Math.pow( 1 - this.e * this.e, 0.5 ) * Math.sin( E ), Math.cos( E ) - this.e );
  }
}

mySolarSystem.register( 'EllipticalOrbit', EllipticalOrbit );