# My Solar System - Model Description

The My Solar System simulation is a model that allows users to explore the dynamics of our solar system. This document provides a brief description of the model and its underlying algorithm. It relies on the code found in both this repo and the solar-system-common one, which also supports the keplers-laws sim.

## Introduction
The My Solar System simulation is a tool that enables users to visualize the motion of planets, moons, and other celestial bodies in our solar system. By manipulating various parameters such as mass, velocity, and distance, users can gain insight into the complex interactions that govern the behavior of these objects.


## Units
The simulation used two different systems of units. The model and internal engine uses a canonical system of arbitrary units for better handling the numerical values, which are then translated to real-world units for display purposes. The following table shows the conversion between the two systems of units:

| Value | Model                                      | Conversion Rate       | View                                                       |
|-------|--------------------------------------------|-----------------------|------------------------------------------------------------|
| Mass  | uM                                         | 10<sup>28</sup> kg/uM | 10<sup>28</sup>kg                                          |
| Dist. | uD                                         | 0.01 AU/uD            | AU                                                         |
| Time  | uT                                         | 0.2244 yr/uT          | yr                                                         |
| Vel.  | uD/uT                                      | 0.2112 km/s / uD/uT   | km/s                                                       |
| G     | 10000 uD<sup>3</sup> / uM / uT<sup>2</sup> | ...                   | 1.98x10<sup>-29</sup> AU<sup>3</sup> / kg / yr<sup>2</sup> |

As you can see, we opted out of MKS (SI) units because of the large values handled in astronomical real world systems. Because of that we use AU for distances, years for time, and add another unit conversion to have speeds shown in km/s.

## Presets (Model units)
The presets used in the simulation are the same ones from the original flash version, except for Sun-Planet which was changed for design purposes. You can take a peek at the values chosen for each of them (in arbitrary model units) in the [model file](https://github.com/phetsims/my-solar-system/blob/df3444bce5fb14dae7ce5ec882ce5ddd353531a0/js/lab/model/LabModel.ts#L91).

## Functionalities
Some elements of the sim might be hidden before the user first interactions. Here we list three situations to keep an eye out for:
- **Centering the system**: Gravitational systems have a tendency to drift off screen. By default, all the pre-sets are centered and followed, but any change could cause a system-drift, or more specifically, a Center of Mass net velocity. When that happens, the sim will display an orange button which says "Follow Center of Mass". When you press it, the reference frame of the simulation will shift to be the same as the center of mass.
- **Scale of Forces**: Because astronomical objects have a wide range of masses, the gravitational force acted upon them also will vary in several orders of magnitude. To aid the visual representation these forces, we placed a force scale slider under the Gravity checkbox. In most pre-sets, the gravitational force may be hidden from view because it's relatively small compared to other forces shown in the sim. With the slider you can bring them to view.
- **Bodies escaping**: Some bodies might fly off-screen. When that happens, a button will appear that let's the user bring escaped bodies back. 