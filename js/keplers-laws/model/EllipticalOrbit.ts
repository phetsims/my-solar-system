// Copyright 2022, University of Colorado Boulder
/**
 * The Elliptical Orbit model element. Evolves the body and
 * keeps track of orbital elements.
 * 
 * Variable definitions:
 * r: position vector
 * v: velocity vector
 * alpha: heading of r
 * beta: heading of v
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

export default class EllipticalOrbit {
  private readonly mu: number;
  private readonly body: Body;

  public a: number;
  public e: number;
  public w: number;
  public M0: number;
  public W: number;

  constructor( body: Body ) {
    this.mu = 1e6;
    this.body = body;

    const [ a, e, w, M0, W ] = this.calculate_ellipse(
      body.positionProperty.value, body.velocityProperty.value
      );
    this.a = a;
    this.e = e;
    this.w = w;
    this.M0 = M0;
    this.W = W;
  }


  calculate_a( r: Vector2, v: Vector2 ): number {
    const r_mag = r.magnitude;
    const v_mag = v.magnitude;
    
    const a = r_mag * this.mu / ( 2 * this.mu - r_mag * v_mag * v_mag );
    return a;
  }
  
  calculate_e( r: Vector2, v: Vector2, a: number ): number {
    const r_mag = r.magnitude;
    const v_mag = v.magnitude;
    const alpha = r.angle;
    const beta = v.angle;
    
    const e = Math.pow(
      1 - Math.pow( r_mag * v_mag * Math.sin( beta - alpha ), 2 )
      / ( a * this.mu ), 0.5 );
    return e;
  }
  
  calculate_angles( r: Vector2, v: Vector2, a: number, e: number ): number[] {
    const r_mag = r.magnitude;
    // nu comes from the polar ellipse equation
    let nu = Math.acos( ( 1 / e ) * ( a * ( 1 - e * e ) / r_mag - 1 ) );
  
    const alpha = r.angle;
    const beta = v.angle;
    
    let W = -500 * Math.pow( a, -3 / 2 );
    if ( Math.cos( alpha - beta ) > 0 ) {
      nu *= -1;
    }
    if ( r.crossScalar( v ) > 0 ) {
      nu *= -1;
      W *= -1;
    }
  
    let E0 = Math.acos( ( e + Math.cos( nu ) ) / ( 1 + e * Math.cos( nu ) ) );
    if ( Math.cos( E0 - nu ) < 0 ) {
      E0 *= -1;
    }
    const M0 = E0 - e * Math.sin( E0 );
  
    const th = r.angle;
    const w = th - nu;
    return [ w, M0, W ];
  }
  
  calculate_ellipse( r: Vector2, v: Vector2 ): number[] {
    const a = this.calculate_a( r, v );
    const e = this.calculate_e( r, v, a );
    const [ w, M0, W ] = this.calculate_angles( r, v, a, e );
    return [ a, e, w, M0, W ];
  }
}

mySolarSystem.register( 'EllipticalOrbit', EllipticalOrbit );