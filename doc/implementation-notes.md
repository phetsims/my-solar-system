# My Solar System - Implementation Notes

My Solar System is built on the sim-specific common code library solar-system-common, which is also used by the Keplers Laws sim.

The sim statically allocates all Body instances, and the spinner that adds or removes Body instances in fact toggles `isActiveProperty` values for each. This simplifies the implementation and will simplify PhET-iO instrumentation.

`SolarSystemCommonModel` is the foundational model class that runs the model simulation, using
`NumericalEngine` for the numerical algorithm.

Canvas is used to render the path traces in PathsCanvasNode.ts.
