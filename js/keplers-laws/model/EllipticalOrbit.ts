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
import { Color } from '../../../../scenery/js/imports.js';
import Engine from '../../common/model/Engine.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
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
  public dotPosition = Vector2.ZERO;
  public startPosition = Vector2.ZERO;
  public endPosition = Vector2.ZERO;
  public completion = 0;
  public insideProperty = new BooleanProperty( false );
  public entered = 0;
  public active = false;

  public constructor() {
    // noop
  }
}

export default class EllipticalOrbit extends Engine {
  private readonly mu = 2e6;
  public readonly body: Body;
  public readonly predictedBody: Body;
  public readonly changedEmitter = new Emitter();
  public periodDivisions = 4;
  public orbitalAreas: OrbitalArea[] = [];
  public updateAllowed = true;
  public retrograde = false;

  // These variable names are letters to compare and read more easily the equations they are in
  public a = 0; // semimajor axis
  public e = 0; // eccentricity
  public w = 0; // argument of periapsis
  public M = 0; // mean anomaly
  public W = 0; // angular velocity
  public T = 0; // period
  public nu = 0; // true anomaly

  // Variable that determines if the orbit is elliptical or not, if false, it is parabolic
  public allowedOrbit: boolean;

  public constructor( bodies: ObservableArray<Body> ) {
    super( bodies );

    // Populate the orbital areas
    for ( let i = 0; i < MySolarSystemConstants.MAX_ORBITAL_DIVISIONS; i++ ) {
      this.orbitalAreas.push( new OrbitalArea() );
    }

    // In the case of this screen, the body 0 is the sun, and the body 1 is the planet
    this.body = bodies[ 1 ];

    // Temporal body to calculate the predicted position of the body
    this.predictedBody = new Body(
      1,
      Vector2.ZERO,
      Vector2.ZERO,
      new TinyProperty( Color.BLACK )
    );
    this.allowedOrbit = false;
    this.update();

    // Multilink to update the orbit based on the bodies position and velocity
    Multilink.multilink(
      [ this.body.userControlledPositionProperty, this.body.userControlledVelocityProperty ],
      ( userControlledPosition: boolean, userControlledVelocity: boolean ) => {
        this.updateAllowed = userControlledPosition || userControlledVelocity;
        this.orbitalAreas.forEach( area => {
          area.entered = 0;
        } );
    } );
  }

  public override run( dt: number ): void {
    // Prevent the orbit from updating if the body is orbiting
    this.updateAllowed = false;

    // Calculate the new position and velocity of the body
    this.M += dt * this.W * 20;
    this.nu = this.getTrueAnomaly( this.M );

    this.predictedBody.positionProperty.value = this.createPolar( -this.nu );
    this.updateAllowed = true;

  }

  /**
   * Based on the current position and velocity of the body
   * Updates the orbital elements of the body using Orbital Mechanics Analytic Equations
   */
  public override update(): void {

    const r = this.body.positionProperty.value;
    const v = this.body.velocityProperty.value;

    this.allowedOrbit = false;
    if ( this.escapeVelocityNotExceeded( r, v ) ) {
      const { a, e, w, W } = this.calculateEllipse( r, v );
      this.a = a;
      this.e = e;
      this.w = w;
      this.W = W;

      // TODO: Check if the complete form of the third law should be used
      this.T = Math.pow( a, 3 / 2 );

      this.calculateDivisionPoints();


      if ( !this.collidedWithSun( a, e ) ) {
        this.allowedOrbit = true;
      }
    }

    this.changedEmitter.emit();
  }

  private createPolar( nu: number ): Vector2 {
    return Vector2.createPolar( this.calculateR( this.a, this.e, nu ), nu );
  }

  /**
   * Based on the number of divisions provided by the model,
   * divides the orbit in isochrone sections.
   *
   */
  private calculateDivisionPoints(): void {
    let previousNu = 0;
    let bodyAngle = TWOPI - this.nu;

    this.orbitalAreas.forEach( ( orbitalArea, i ) => {
      if ( i < this.periodDivisions ) {
        // Calculate true anomaly
        const M = ( i + 1 ) * TWOPI / this.periodDivisions;
        const nu = this.getTrueAnomaly( M );

        // Update orbital areas angles, constrained by the startAngle
        let startAngle = previousNu;
        let endAngle = Utils.moduloBetweenDown( nu, startAngle, startAngle + TWOPI );
        bodyAngle = Utils.moduloBetweenDown( bodyAngle, startAngle, startAngle + TWOPI );

        // Body inside the area
        if ( startAngle <= bodyAngle && bodyAngle <= endAngle ) {
          orbitalArea.insideProperty.value = true;
          orbitalArea.entered = 1;

          // Map opacity from 0 to 1 based on BodyAngle from startAngle to endAngle (inside area)
          const completionRate = ( bodyAngle - startAngle ) / ( endAngle - startAngle );
          if ( this.retrograde ) {
            endAngle = bodyAngle;
            orbitalArea.completion = completionRate;
          }
          else {
            startAngle = bodyAngle;
            orbitalArea.completion = ( 1 - completionRate );
          }
        }
        // OUTSIDE THE AREA
        else {
          orbitalArea.insideProperty.value = false;
          // Map completion from 1 to 0 based on BodyAngle from startAngle to endAngle (outside area)
          let completionFalloff = ( bodyAngle - startAngle - TWOPI ) / ( endAngle - startAngle - TWOPI );

          // Correct for negative values
          completionFalloff = Utils.moduloBetweenDown( completionFalloff, 0, 1 );

          orbitalArea.completion = this.retrograde ? completionFalloff : ( 1 - completionFalloff );
        }

        // Update orbital area properties
        orbitalArea.completion *= orbitalArea.entered; // Set it to 0 if it hasn't entered yet
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

  private calculateAngles( r: Vector2, v: Vector2, a: number, e: number ): number[] {
    //REVIEW: Not sure I can follow this easily. Can you add some documentation for this implementation?

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
      this.retrograde = false;
      nu *= -1;
      W *= -1;
    }
    else {
      this.retrograde = true;
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

  private calculateEllipse( r: Vector2, v: Vector2 ): Ellipse {
    const a = this.calculate_a( r, v );
    const e = this.calculate_e( r, v, a );
    const [ w, M, W ] = this.calculateAngles( r, v, a, e );
    return new Ellipse( a, e, w, M, W );
  }

  private calculateR( a: number, e: number, nu: number ): number {
    return a * ( 1 - e * e ) / ( 1 + e * Math.cos( nu ) );
  }

  public override reset(): void {
    //REVIEW: What is this doing? Will it be filled in?
    // This will be filled in in the future
  }

  // Numerical solution to Kepler's Equations for Eccentric Anomaly (E) and then True Anomaly (nu)
  private getTrueAnomaly( M: number ): number {
    const E1 = M + this.e * Math.sin( M );
    const E2 = M + this.e * Math.sin( E1 );
    const E = M + this.e * Math.sin( E2 );
    const nu = Math.atan2( Math.pow( 1 - this.e * this.e, 0.5 ) * Math.sin( E ), Math.cos( E ) - this.e );
    return Utils.moduloBetweenDown( nu, 0, TWOPI );
  }
}

mySolarSystem.register( 'EllipticalOrbit', EllipticalOrbit );