---
project: astral-pulse
title: "Player Attack Visuals"
date: 2023-11-25
---

<p>I wanted to get an early start on visuals, specifically player visuals. I created multiple animations for the player: open/power on, idle, and a multi-stage attack animation that indicates the current charged attack level. </p>

<img alt="The drone powering on and then idling" src="/assets/img/games/astral-pulse/devlog/open-idle.gif"/>

<p>I wanted another way to show the player charging up an attack with varying levels of output potential, so I used a particle system and wrote a script that modified various attributes of the particle system to show an increase in power. </p>

<img alt="The drone charging an attack, with particles gathering around it" src="/assets/img/games/astral-pulse/devlog/open-idle-charge.gif"/>

<p>I had not implemented many particle systems in past projects, so this was a learning experience. I had not realized how many customizable features Unity particle systems had, so I spent quite a bit of time experimenting. One thing I added was making the particles increase with opacity over their lifetime, which gave the effect of the particles materializing around the player. I also wanted the particles to have trails that would increase in opacity as well; however, I could not figure out a way to do this. It seems using Unity’s built in particle trail would apply the opacity to the entire trail as opposed to giving the trail its own gradient. I may come back to this later; however, I think the particles without trails achieves the look I was going for.</p>
