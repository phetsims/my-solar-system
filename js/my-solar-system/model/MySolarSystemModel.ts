// Copyright 2020-2022, University of Colorado Boulder

/**
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import mySolarSystem from '../../mySolarSystem.js';
import Body from '../../common/model/Body.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class MySolarSystemModel {
  bodies: Array<Body>;
  Nbodies: number;
  G: number;

  constructor( tandem: Tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    this.G = 1000;
    this.bodies = []
    this.Nbodies = 5;
    for (let i = 0; i < this.Nbodies; i++){
      // Populate the bodies array with random spheres
      this.bodies.push(new Body(
        10+30*Math.random(), // Assign a random initial Mass to the bodies
        new Vector2( 500*Math.random(), 500*Math.random()), // Create the bodies in random positions for now
        new Vector2( 10*(0.5-Math.random()), 10*(0.5-Math.random())), // Assign them random velocities
      ))
    }
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    //TODO
  }


  step( dt: number ) {
    this.applyForces()
    this.verlet(dt)
  }

  applyForces(){
    // Iterate between all the bodies to add the accelerations
    for (let i = 0; i < this.Nbodies; i++){
      for (let j = i + 1; j < this.Nbodies; j++){
        // J: Is it okay to variables for body1 and body2??
        let body1: Body = this.bodies[i];
        let body2: Body = this.bodies[j];
        let mass1: number = body1.massProperty.value;
        let mass2: number = body2.massProperty.value;
        body1.accelerationProperty.value = this.getForce(body1,body2).times(1/mass1);
        body2.accelerationProperty.value = body1.accelerationProperty.value.times(mass1/mass2);
      }
    }
  }

  getForce(body1: Body, body2: Body){
    let pos1: Vector2 = body1.positionProperty.value;
    let pos2: Vector2 = body2.positionProperty.value;
    let direction: Vector2 = pos1.minus(pos2);
    let dist: number = direction.magnitude;
    let accMag: number = this.G*body1.massProperty.value*body2.massProperty.value*(Math.pow(dist,-3));
    let acceleration: Vector2 = direction.times(accMag);
    return acceleration;
  }

  verlet(dt: number){
    this.bodies.forEach(body => {
      let pos: Vector2 = body.positionProperty.value;
      let vel: Vector2 = body.velocityProperty.value;
      let acc: Vector2 = body.accelerationProperty.value;
      let accPrev: Vector2 = body.previousAcceleration;
      // J: Is this the proper way of handling vector operations??
      body.positionProperty.value.add(pos).add(vel.times(dt)).add(acc.times(0.5*dt*dt));
      body.velocityProperty.value.add(vel).add((acc.plus(accPrev)).times(0.5*dt));
      body.previousAcceleration = body.accelerationProperty.value;
    })

  }
}

mySolarSystem.register( 'MySolarSystemModel', MySolarSystemModel );
export default MySolarSystemModel;