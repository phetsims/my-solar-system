# My Solar System - Model Description

The My Solar System simulation is a model that allows users to explore the dynamics of our solar system. This document
provides a brief description of the model and its underlying algorithm. It relies on the code found in both this repo
and the solar-system-common one, which also supports the keplers-laws sim.

## Introduction

The My Solar System simulation is a tool that enables users to visualize the motion of planets, moons, and other
celestial bodies in our solar system. By manipulating various parameters such as mass, velocity, and distance, users can
gain insight into the complex interactions that govern the behavior of these objects.

## Units
We opted not to use SI units within the sim, as the numbers differ by several orders of magnitude, which could cause computation issues. Instead, we use the following units for each of the quantities:
- **Mass:** 10<sup>28</sup> kg. i.e. the Sun's mass is set to 200.
- **Distance:** 1 AU, the average distance from Earth to the Sun.
- **Time:** 1 year
- **Velocity:** 1 km/s. Earth's orbital velocity is around 29 km/s.
- **G:** 4.4567 x 10<sup>-3</sup> AU<sup>3</sup>/year<sup>2</sup>/10<sup>27</sup> kg

This decision allows for smoother calculations, and also makes the numbers more manageable for the user, closer to the ranges one would find in such physical systems.

## Presets (Model units)

The presets used in the simulation are the same ones from the original Flash version, except for Sun-Planet which was
changed for design purposes. You can take a peek at the values chosen for each of them (in arbitrary model units) in [OrbitalSystem](https://github.com/phetsims/my-solar-system/blob/2b0034a9f61f21ad866d43fa3ae1bb7be043d399/js/lab/model/OrbitalSystem.ts).

## Functionalities

Some elements of the sim might be hidden before the user first interactions. Here we list three situations to keep an
eye out for:

- **Centering the system**: Gravitational systems have a tendency to drift off screen. By default, all the pre-sets are
  centered and followed. Any user change will likely give the Center of Mass a net velocity, and the system will start to move.
  When that happens, the sim will display an orange button which says "Follow Center of Mass". When you press it, the
  reference frame of the simulation will shift to be the same as the Center of Mass.
- **Scale of Forces**: Because astronomical objects have a wide range of masses, the gravitational force acted upon them
  also will vary in several orders of magnitude. To aid the visual representation these forces, we placed a force scale
  slider under the Gravity checkbox. In most pre-sets, the gravitational force may be hidden from view because it's
  relatively small compared to other forces shown in the sim. With the slider you can bring them to view.
- **Bodies escaping**: Some bodies might fly off-screen. When that happens, a button will appear that let's the user
  bring escaped bodies back.

## Integrator Algorithm

The [NumericalEngine](https://github.com/phetsims/my-solar-system/blob/d55f4e68c494be3d6f31d64e7085e5ad2ca9c6f6/js/common/model/NumericalEngine.ts)
on this sim relies on the Position Extended Forest-Ruth Like algorithm (PEFRL) to compute the motion of the
bodies [(Omelyan, Myrglod & Folk, 2001)](https://arxiv.org/abs/cond-mat/0110585). PEFRL is a numerical integration
scheme that provides high accuracy and stability for simulations involving many bodies, especially those with periodic
or quasi-periodic behavior. It essentially integrates the position and velocity over time in multiple intermediate
steps.

## Physical Simplifications

### Mass ranges

Typical mass ranges in astronomical bodies can span about 40 orders of magnitude. From the smallest planetesimal or
satellite, up to super massive black holes. However, for this simulation, the user accessible mass range is limited from
10<sup>27</sup> kg, which is roughly the mass of Jupiter, up to 3x10<sup>30</sup> kg, about 1.5 times the mass of the
Sun. This is done to avoid numerical instabilities in the simulation, and to keep the simulation manageable for the
user. As for the pre-sets, some of them can have initial masses of 10<sup>22</sup> kg, close to the biggest moon masses
in the Solar System (In model units, that's 0.000001 uM).

### Distances and Sizes

The bodies sizes are greatly exaggerated, as using the same scale for distances and sizes would render all bodies as
invisible points. For example, the real solar radius is about 0.004 AU, but in the sim it is displayed as 0.15 AU.
Additionally, typical gravitational systems usually have enormous distances between bodies, even when measured in AUs,
but most of the sim pre-sets show them in the same range of ~5AU in size.

### Radii of Bodies

For the purposes of collisions and display, the radii of bodies are modeled somewhat non-proportionally, as spheres with
an additional minimum radius.

### Comments to all Pre-Sets

Based on the above innacuracies, the following are the additional comments for each of the pre-sets, to keep in mind
what's precise and what's innacurate. For all, as was stated above, body sizes are greatly exaggerated:

- Sun-Planet: Distances, velocities and times are accurate. The displayed "planet" would be about 100 times as massive as Jupiter,
  basically a brown dwarf.
- Sun-Planet-Moon: The moon would be about 100 times closer to the planet. Velocities and times are accurate for the
  given orbit. But due to the bodies displayed size, an accurate moon sistem wouldn't fit.
- Sun-Planet-Comet: Mostly accurate. But keep in mind that comets and asteroid orbits have a wide range of possible orbits and eccentricities. (To learn more about these concepts, check out the [Kepler's Laws](https://phet.colorado.edu/en/simulation/keplers-laws) sim).
- Four Star Ballet: This system would be unlikely to exist in real life, but it's a good example of what a possible
  semi-stable system would look like.
- Double-Double: These kinds of systems do exist in real life, with binary star systems orbiting each other, for example
  the Castor stellar system. However, the masses and distances might be innacurate.

### Collisions

Body impacts are pretty much simplified, when two bodies collide, the smallest ones disappears and adds its momentum to
the bigger one. In reality this process is much more complex.

## Stability of Systems

All gravitational systems with more than 2 bodies are chaotic in nature. That means that small changes in initial
conditions can lead to large differences in the final state of the system. Because of this, pre-sets that would exhibit
a somewhat stable behaviour in real life will de-stabilize in the sim after a few sim years (i.e. Sun-Planet-Moon, or
Double-Double). Also, playing the sim in different speeds will cause the system to de-stabilize in different ways (For
Sun-Planet-Moon, at normal speed the moon crashes into the planet, but at fast speed it will escape).
