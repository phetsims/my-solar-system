// Copyright 2022, University of Colorado Boulder
/**
 * The Elliptical Orbit model element. Evolves the body and
 * keeps track of orbital elements.
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
 * M0: Initial mean anomaly
 * W: angular velocity
 *
 * @author Agustín Vallejo
 */

import mySolarSystem from '../../mySolarSystem.js';
import Body from '../../common/model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';

export default class EllipticalOrbit {
  private readonly mu: number;
  private readonly body: Body;

  public a: number;
  public e: number;
  public w: number;
  public M0: number;
  public W: number;

  public allowedOrbit: boolean;

  public constructor( body: Body ) {
    this.mu = 2e6;
    this.body = body;
    this.a = 0;
    this.e = 0;
    this.w = 0;
    this.M0 = 0;
    this.W = 0;

    this.allowedOrbit = false;

    this.update();
  }

  public update(): void {
    const r = this.body.positionProperty.value;
    const v = this.body.velocityProperty.value;

    this.allowedOrbit = false;
    if ( !this.escapeVelocityExceeded( r, v ) ) {
      const [ a, e, w, M0, W ] = this.calculateEllipse( r, v );
      this.a = a;
      this.e = e;
      this.w = w;
      this.M0 = M0;
      this.W = W;
      if ( !this.collidedWithSun( a, e ) ) {
        this.allowedOrbit = true;
      }
    }
  }

  public escapeVelocityExceeded( r: Vector2, v: Vector2 ): boolean {
    const rMagnitude = r.magnitude;
    const vMagnitude = v.magnitude;

    return vMagnitude > ( 0.99 * Math.pow( 2 * this.mu / rMagnitude, 0.5 ) );
  }

  public collidedWithSun( a: number, e: number ): boolean {
    return a * ( 1 - e ) < 25;
  }

  public calculate_a( r: Vector2, v: Vector2 ): number {
    const rMagnitude = r.magnitude;
    const vMagnitude = v.magnitude;

    const a = rMagnitude * this.mu / ( 2 * this.mu - rMagnitude * vMagnitude * vMagnitude );
    return a;
  }

  public calculate_e( r: Vector2, v: Vector2, a: number ): number {
    const rMagnitude = r.magnitude;
    const vMagnitude = v.magnitude;
    const rAngle = r.angle;
    const vAngle = v.angle;

    const e = Math.pow(
      1 - Math.pow( rMagnitude * vMagnitude * Math.sin( vAngle - rAngle ), 2 )
      / ( a * this.mu ), 0.5 );
    return e;
  }

  public calculateAngles( r: Vector2, v: Vector2, a: number, e: number ): number[] {
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
    const M0 = E0 - e * Math.sin( E0 );
  
    const th = r.angle;
    const w = th - nu;
    return [ w, M0, W ];
  }

  public calculateEllipse( r: Vector2, v: Vector2 ): number[] {
    const a = this.calculate_a( r, v );
    const e = this.calculate_e( r, v, a );
    const [ w, M0, W ] = this.calculateAngles( r, v, a, e );
    return [ a, e, w, M0, W ];
  }
}

mySolarSystem.register( 'EllipticalOrbit', EllipticalOrbit );