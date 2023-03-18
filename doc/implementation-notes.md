# My Solar System - Implementation Notes

My Solar System is built on the sim-specific common code library solar-system-common, which is also used by the Keplers Laws sim.

`SolarSystemCommonModel` is the foundational model class that runs the model simulation, using
`NumericalEngine` for the numerical algorithm.

Canvas is used to render the path traces in PathsCanvasNode.ts.

Enumerations use EnumerationValue rather than string literal unions, by choice.

## Memory Management

The majority of the elements in the sim are statically allocated at startup, and exist for the lifetime of the sim, hence most uses of `link`, `addListener`, etc. do NOT need a corresponding `unlink` or `removeListener`. BodyViews and the vector Nodes are the main thing that are dynamically created and destroyed. They are created/destroyed with `ViewSynchronizer`s

The sim statically allocates all Body instances, and the spinner that adds or removes Body instances in fact toggles `isActiveProperty` values for each. This simplifies the implementation and will simplify PhET-iO instrumentation.

## Models

Multiple files are used to create the model: [`SolarSystemCommonModel`](https://github.com/phetsims/solar-system-common/blob/af2b6fda39649f58114ba562bcf06d663c64554a/js/model/SolarSystemCommonModel.ts), which has the main logic for a scene creation, and handles all the logic for body creation and destruction. It is used in the MySolarSystem sim as well as the KeplersLaws one. Inheriting from that model, there's [`MySolarSystemModel`](https://github.com/phetsims/my-solar-system/blob/7fd875a7b45b4c17059b4e9c6dbc02b137adc8ee/js/common/model/MySolarSystemModel.ts), which has some additional functionalities, mainly defining the Center of Mass object, which will allow for re-centering of the system. Finally there's [`IntroModel`](https://github.com/phetsims/my-solar-system/blob/df3444bce5fb14dae7ce5ec882ce5ddd353531a0/js/intro/model/IntroModel.ts) which doesn't do much else, and [`LabModel`](https://github.com/phetsims/my-solar-system/blob/df3444bce5fb14dae7ce5ec882ce5ddd353531a0/js/lab/model/LabModel.ts) which handles the logic of pre-set selection.

There are multiple arrays which keep track of the bodies:
- `availableBodies`: It stores the 4 possible bodies in memory for the entire lifetime of the sim, to avoid memory allocation issues. The bodies are created in the constructor of the model and are never disposed.
- `bodies`: Essentialy acting as Active Bodies. It stores the bodies that are currently being used in the sim. The bodies are added to this array when the user changes the body number in the control panel or selects a Lab preset. There are BodyNodes listening for this array, and when bodies leave the Bodies array, their BodyNode is disposed.
- `startingBodyState`: Stores multiple BodyInfo elements, which are basically the necessary information for a body to be recreated. It is rewritten every time the user interacts with the sim, thus saving a new starting state, and it's used when the Restart button (left of the play/pause button) is pressed.
- `defaultBodyState`: Stores the default values for the bodies, which are used when the user presses the Reset All button.

Some important properties to keep track of during the sim:
- `systemCenteredProperty`: When toggled to true (via the orange 'Follow Center of Mass') the whole system will shift so that the CoM is in the middle and standing still.
- `forceScaleProperty`: Stores the current exponential scale value of the force vector. The default value is 0, 10<sup>0</sup> = 1, so no scaling. It goes from -2 to 8 so that the user can see the force vectors in all the presets.
- `isAnyBodyEscapedProperty`: As name suggests, is false unless any body is offscreen. Toggles the visibility of the 'Return Bodies' button, and when that is pressed, the escaped bodies are returned to their original positions.
- `isLab`: Even though Intro and Lab have independent model files, there are still some common components which are shown or hidden depending on the value of this variable.
- There are also time scales and zoom level scales which control the size and speed of the sim.
