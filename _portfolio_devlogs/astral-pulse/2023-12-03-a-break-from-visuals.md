---
project: astral-pulse
title: "A Break From Visuals"
date: 2023-12-03
---

<p>Today I took a break from visuals to focus on the mechanics I needed for a minimum viable product. I was able to reuse and adapt much of the code I needed from past projects.</p>

<p>For example, I quickly created a health and death system by adapting a similar system. Obstacle spawning was a simple solution for now, and may need to be updated later. The obstacle health/death system was also an adaptation of my previously written code. In addition to making the player’s attacks damage and destroy obstacles, I made obstacles able to damage and destroy other obstacles on collisions. I am hoping this encourages the player to try to plan their attacks strategically. </p>

<p>I also added some additional game-juice effects, such as adjusting the scaling of both the attack visual and in-game effect programmatically depending on the player’s charged attack level and adjusting the time scale to create a slow-mo effect when the player fully charges their attack.</p>

<p>The last thing I added today was a boundary that deletes all objects, to increase performance.</p>
