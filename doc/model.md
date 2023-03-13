# My Solar System - Model Description

The My Solar System simulation is a model that allows users to explore the dynamics of our solar system. This document provides a brief description of the model and its underlying algorithm. It relies on the code found in both this repo and the solar-system-common one, which also supports the keplers-laws sim.

## Introduction
The My Solar System simulation is a tool that enables users to visualize the motion of planets, moons, and other celestial bodies in our solar system. By manipulating various parameters such as mass, velocity, and distance, users can gain insight into the complex interactions that govern the behavior of these objects.

## Algorithm
There are two arrays which keep track of the bodies:
- Available Bodies: It stores the 4 possible bodies in memory for the entire lifetime of the sim, to avoid memory allocation issues. The bodies are created in the constructor of the model and are never disposed.
- Bodies: Essentialy acting as Active Bodies. It stores the bodies that are currently being used in the sim. The bodies are added to this array when the user changes the body number in the control panel or selects a Lab preset. There are BodyNodes listening for this array, and when bodies leave the Bodies array, their BodyNode is disposed.

The simulation relies on the Position Extended Forest-Ruth Like algorithm (PEFRL) to compute the motion of the bodies [(Omelyan, Myrglod & Folk, 2001)](https://arxiv.org/abs/cond-mat/0110585). PEFRL is a numerical integration scheme that provides high accuracy and stability for simulations involving many bodies, especially those with periodic or quasi-periodic behavior. It essentially integrates the position and velocity over time in multiple intermediate steps.


## Units
Numbers in the model use the following units:
Mass - 10^28 kg
Distance - 1 AU, which is roughly 150 million km
Time - 1 year
Velocity - 1 km/s

We decided to not use SI units to better convey the scales of each dimension