---
project: astral-pulse
title: "Reflecting on Playtest 1"
date: 2023-12-04
---

<p>Quick brainstorm reflecting on playtest 1. Began implementing a new solution that may require more coding.</p>

<p>The following are the notes I took while playtesting:</p>

<ul>
<li>Attack level 1 and 2 are too similar and attack 3 is obviously more powerful</li>
<li>Limit Player attacks</li>
<li>
What UI do I need?
<ul>
<li>Health</li>
<li>Attack charge</li>
<li>Indicating when player is hit</li>
</ul>
</li>
<li>Fix player death</li>
<li>Dynamic UI elements</li>
<li>Remaining mechanics</li>
<li>Audio system and all sound asset</li>
</ul>

<p>Based on feedback and my own playing of the game, I decided the game was too complicated and there were too many controls to balance. I realized I could come to the root of the issue by taking note of the things the player has to keep track of while playing.</p>

<ul>
<li>Moving, dodging, positioning</li>
<li>Hitting things away from yourself</li>
<li>Hitting things into other obstacles</li>
<li>Collecting fragments (fuel for attack)</li>
<li>When to hold and release attacks</li>
</ul>

<p>I realized that something needed to be limited in some way. I had a few ideas...</p>

<p>I knew I didn't want to limit the timing of charging and releasing the attack as that should be an integral part of the gameplay. I also didn't want to limit hitting things into other things or in other words triggering chain events.</p>

<ol>
<li>
<p>
Limit collecing fragments: If I removed the need to collect fragments, that would be one less thing for the player to focus on. I could do this either by giving the player infinite attack or by making fragments autocollect.
</p>
<p>
I figured that infinite attack would make the game too easy, but a cool down or autocollection would work.
</p>
</li>
<li>
<p>
Limit movement: If the player movement was automated in some way it would mean one less thing for the player to focus on. I needed a creative way to limit movement, so I came up with a few ideas.
</p>
<p>
Space Foosball: Up and down arrows move an array of drones, and space is used to attack.
</p>
<p>
Rotate a space station or control an orbital drone: use left and right to rotate, up and down to switch weapons, and space to attack
</p>
<p>
And finally a ricochet based movement where the player would sling shot around planets with gravity effects
</p>
</li>
</ol>
