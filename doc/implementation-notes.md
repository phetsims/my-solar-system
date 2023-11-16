# My Solar System - Implementation Notes

_My Solar System_ is built on the sim-specific common-code repository solar-system-common, which is also used by the
_Kepler's Laws_ sim.

## Memory Management

All observable elements in the sim are statically allocated at startup, and exist for the lifetime of the sim
Hence all uses of `link`, `addListener`, etc. do NOT need a corresponding `unlink` or `removeListener`.
Classes also use `isDisposable: false` to indicate that they are not intended to be disposed.

The sim statically allocates all Body and BodyNode instances. The spinner that adds or removes bodies from the orbital 
system in fact toggles a Body's `isActiveProperty`, which in turn controls the visibility of the BodyNode associated
with a Body.

## Models

The top-level model consists of a class hierarchy: 
* [SolarSystemCommonModel](https://github.com/phetsims/solar-system-common/blob/main/js/model/SolarSystemCommonModel.ts)
contains the model that is common to _My Solar System_ and _Kepler's Laws_ sims, and handles all the logic for creation
of an orbital system of bodies.
* [MySolarSystemModel](https://github.com/phetsims/my-solar-system/blob/main/js/common/model/MySolarSystemModel.ts),
adds functionality specific to _My Solar System_, mainly defining [CenterOfMass](https://github.com/phetsims/my-solar-system/blob/main/js/common/model/CenterOfMass.ts), which will allow for re-centering
of the orbital system. 
* [IntroModel](https://github.com/phetsims/my-solar-system/blob/main/js/intro/model/IntroModel.ts)
extends `MySolarSystemModel` for the _Intro_ screen, and defines the 2 bodies that appear in that screen.
* [LabModel](https://github.com/phetsims/my-solar-system/blob/main/js/lab/model/LabModel.ts) also extends
`MySolarSystemModel` for the _Lab_ screen, defines the 4 bodies that can appear in that screen, and handles the 
logic of orbital system presets.

[NumericalEngine](https://github.com/phetsims/my-solar-system/blob/main/js/common/model/NumericalEngine.ts) controls
the gravitational interaction between bodies.

[Body](https://github.com/phetsims/solar-system-common/blob/main/js/model/Body.ts) is the model of a body in an orbital system.

[OrbitalSystem](https://github.com/phetsims/my-solar-system/blob/main/js/lab/model/OrbitalSystem.ts) is a 
a rich enumeration of the orbit system presets found in the _Lab_ screen.

There are multiple arrays which keep track of the bodies:

- `bodies`: It stores the Body instances (2 for the _Intro_ screen, 4 for the _Lab_ screen) for the entire lifetime of the sim, to avoid memory
  allocation issues. The bodies are created in the constructor of the model and are never disposed.
- `activeBodies`: It stores the bodies that are currently visible in the orbital system shown on screen. The bodies are added to this array when the user changes the body number in the control panel or selects a Lab preset.
- `startingBodyInfoProperty`: Stores multiple BodyInfo elements, which are basically the necessary information for a body to be recreated. It is rewritten every time the user interacts with the sim or selects a preset on the _Lab_ screen, thus saving a new starting state, and it's used
  when the Restart button (left of the play/pause button) is pressed.

Some important properties to keep track of during the sim:

- `followingCenterOfMassProperty`: Set to true if the Center of Mass (CoM) is within 1AU from the center and has a velocity close to 0 (< 0.01km/s), this is to have some tolerance of what systems are drifting off. When toggled to true (via the orange 'Follow Center of Mass') the whole system will shift so
  that the CoM is in the middle and standing still.
- `gravityForceScalePowerProperty`: Stores the current exponential scale value of the force vector. The default value is 0, 10<sup>0</sup> = 1, so no scaling. It goes from -2 to 8 so that the user can see the force vectors in all the presets.
- `bodiesAreReturnableProperty`: As name suggests, is true if any body is offscreen. Toggles the visibility of the 'Return Bodies' button, and when that is pressed, the escaped bodies are returned to their original positions.
- `isLab`: Even though Intro and Lab have independent model files, there are still some common components which are shown or hidden depending on the value of this variable.
- There are also time scales and zoom level scales which control the size and speed of the sim.

# View

[BodyNode](https://github.com/phetsims/solar-system-common/blob/main/js/view/BodyNode.ts) is the view of 
a `Body` model element. The body's position can be directly manipulated by dragging.

[DraggableVelocityVectorNode](https://github.com/phetsims/solar-system-common/blob/main/js/view/DraggableVelocityVectorNode.ts) is the view
of a body's velocity vector. The body's velocity can be directly manipulated by dragging.

[PathsCanvasNode](https://github.com/phetsims/my-solar-system/blob/main/js/common/view/PathsCanvasNode.ts)
renders the path traces of bodies using the Canvas API.

# PhET-iO

All PhET-iO Elements in this sim are static (created a startup). There are no elements created dynamically.

There are 2 custom IOTypes. See [BodyInfo.BodyInfoIO](https://github.com/phetsims/solar-system-common/blob/main/js/model/BodyInfo.ts)
and [BodyInfoSubsetIO](https://github.com/phetsims/my-solar-system/blob/main/js/lab/model/PhetioOrbitalSystemProperty.ts).

Client-configurable presets is a feature that is available only in the PhET-iO brand. It allows PhET-iO
clients to create their own orbital system presets for the Lab screen.
See [PhetioOrbitalSystemProperty](https://github.com/phetsims/my-solar-system/blob/main/js/lab/model/PhetioOrbitalSystemProperty.ts)
for details.