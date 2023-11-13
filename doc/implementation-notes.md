# My Solar System - Implementation Notes

My Solar System is built on the sim-specific common code library solar-system-common, which is also used by the Keplers
Laws sim.

`SolarSystemCommonModel` is the foundational model class that runs the model simulation, using
`NumericalEngine` for the numerical algorithm.

Canvas is used to render the path traces in PathsCanvasNode.ts.

Enumerations use EnumerationValue rather than string literal unions, by choice.

## Memory Management

The majority of the elements in the sim are statically allocated at startup, and exist for the lifetime of the sim, hence most uses of `link`, `addListener`, etc. do NOT need a corresponding `unlink` or `removeListener`.

The sim statically allocates all Body instances, and the spinner that adds or removes Body instances in fact toggles `isActiveProperty` values for each. This simplifies the implementation and will simplify PhET-iO instrumentation.

## Models

Multiple files are used to create the model: 
[SolarSystemCommonModel](https://github.com/phetsims/solar-system-common/blob/main/js/model/SolarSystemCommonModel.ts),
which has the main logic for a scene creation, and handles all the logic for body creation and destruction. It is used
in both _My Solar System_ and _Kepler's Laws_ sims. Inheriting from that model, there's
[MySolarSystemModel](https://github.com/phetsims/my-solar-system/blob/main/js/common/model/MySolarSystemModel.ts),
which has some additional functionalities, mainly defining the Center of Mass object, which will allow for re-centering
of the system. Finally, there's [IntroModel](https://github.com/phetsims/my-solar-system/blob/main/js/intro/model/IntroModel.ts)
which doesn't do much else, and [LabModel](https://github.com/phetsims/my-solar-system/blob/main/js/lab/model/LabModel.ts) which handles the logic of pre-set selection.

There are multiple arrays which keep track of the bodies:

- `bodies`: It stores the 4 possible bodies in memory for the entire lifetime of the sim, to avoid memory
  allocation issues. The bodies are created in the constructor of the model and are never disposed.
- `activeBodies`: It stores the bodies that are currently being used in the sim. The bodies are added to this array when the user changes the body number in the control panel or selects a Lab preset.
- `startingBodyInfoProperty`: Stores multiple BodyInfo elements, which are basically the necessary information for a body to be recreated. It is rewritten every time the user interacts with the sim or selects a Lab preset, thus saving a new starting state, and it's used
  when the Restart button (left of the play/pause button) is pressed.

Some important properties to keep track of during the sim:

- `followingCenterOfMassProperty`: Set to true if the Center of Mass (CoM) is within 1AU from the center and has a velocity close to 0 (< 0.01km/s), this is to have some tolerance of what systems are drifting off. When toggled to true (via the orange 'Follow Center of Mass') the whole system will shift so
  that the CoM is in the middle and standing still.
- `gravityForceScalePowerProperty`: Stores the current exponential scale value of the force vector. The default value is 0, 10<sup>0</sup> = 1, so no scaling. It goes from -2 to 8 so that the user can see the force vectors in all the presets.
- `bodiesAreReturnableProperty`: As name suggests, is true if any body is offscreen. Toggles the visibility of the 'Return Bodies' button, and when that is pressed, the escaped bodies are returned to their original positions.
- `isLab`: Even though Intro and Lab have independent model files, there are still some common components which are shown or hidden depending on the value of this variable.
- There are also time scales and zoom level scales which control the size and speed of the sim.

# PhET-iO

All PhET-iO elements in this sim are static (created a startup). There are no elements created dynamically.

There are 2 custom IOTypes. See [BodyInfo.BodyInfoIO](https://github.com/phetsims/solar-system-common/blob/main/js/model/BodyInfo.ts)
and [BodyInfoSubsetIO](https://github.com/phetsims/my-solar-system/blob/main/js/lab/model/PhetioOrbitalSystemProperty.ts).

Client-configurable presets is a feature that is available only in the PhET-iO brand. It allows PhET-iO
clients to create their own orbital system presets for the Lab screen.
See [PhetioOrbitalSystemProperty](https://github.com/phetsims/my-solar-system/blob/main/js/lab/model/PhetioOrbitalSystemProperty.ts)
for details.