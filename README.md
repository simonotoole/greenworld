# greenworld
A simple evolution simulator using a genetic algorithm.

![alt text](https://github.com/simonotoole/greenworld/blob/main/greenworld-screenshot.png?raw=true)

Greenworld is a two-dimensional environment in which a population of digital organisms move about, reproduce, and consume food, poison, and each other. When two organisms reproduce, they produce a child organism which inherits the genetic characteristics of its parents, such as its size and speed, and how efficient it is at seeking out resources in the environment. Each organism is born with a health counter which decreases for each frame of the simulation; an organism can increase its health by consuming food or other organisms, or damage its health by consuming poison. When an organism eats another, it changes its colour to pink: this makes it easy to see the amount of predation that occurs in the simulation at any one time.

Evolution in Greenworld is powered by an adaptation of the standard genetic algorithm, which removes the explicit fitness function. Fitness is instead a product of how long an organism lives: the longer an organism's life, the more opportunities it should have to reproduce. This means that the simulator should show a bias for organisms who are most efficient at seeking out food and other organisms, and avoiding poison; in practice, the presence of predation disrupts this bias and the genetic characteristics of the population tend to follow cyclical patterns. The fitness function-less implementation of a genetic algorithm employed in Greenworld was inspired by Norman H. Packard's conception of intrinsic adaptation and the evolution simulator work of Liese, Polani, and Uthmann.

Organisms move about their environment propelled by their desire to seek out or avoid resources and other organisms. This movement is dictated by steering behaviours such as seek and separation behaviour, and are derived from the work of Craig W. Reynolds.
