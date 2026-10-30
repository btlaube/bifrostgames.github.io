---
project: personal-project
title: "Story and Experimenting with Shaders"
date: 2023-10-09
---

<p> Today I finally ironed out the story of my game. The story went through a few iterations, but each version had the player make their way back to the campsite, and had a different ending for what happens once the player reaches the campsite. Originally, the plan was to present the player with a decision as the monster approaches (implemented as a quick-time event): </p>

<ol>
<li>Run: if the player chooses to run, they end up hurting themselves in the process. This is considered a bad ending.</li>
<li>Fight: if the player chooses to fight, they overpower and kill the monster. The hallucination then fades, and the player realizes what they have done. This is considered a bad ending.</li>
<li>Nothing: A secret third option would be to let the quick-time event pass without making a decision. If the player chooses this, then the monster approaches, and the hallucination fades, revealing the true identity of the monster was the friends all along. This would be the only good ending.</li>
</ol>

<p>I had a few issues with this ending:</p>

<ul>
<li>I would have to implement a quick-time event, which would feel out of place unless quick-time events were a part of the rest of the game.</li>
<li>I might not have time to implement a quick-time event.</li>
<li>The majority of the endings are “bad”, which isn't a huge issue for a horror game.</li>
<li>The player's actions during the game don't impact the ending in any way.</li>
</ul>

<p>The next iteration of the ending took these issues into account. The plan was to implement a few new mechanics:</p>

<ul>
<li>
Stress level
<ul>
<li>Tied to heart rate, breathing SFX, visual effects</li>
<li>Triggers lose condition if it gets too high</li>
<li>Lowers slowly over time</li>
</ul>
</li>
<li>
Faded level (highness)
<ul>
<li>Tied to hallucination level (i.e. haziness filter)</li>
<li>No way to lower</li>
</ul>
</li>
<li>Smoke to increase Faded level and lower stress</li>
<li>
Things that increase stress/heart rate:
<ul>
<li>Looking at the monster</li>
<li>Being close to the monster</li>
<li>Sprinting</li>
</ul>
</li>
</ul>

<p>With these mechanics, I would implement multiple endings once the player reaches the campsite. Similarly to the previous version, the player reaches the campsite, and the monster begins to approach. </p>

<ol>
<li>
If the player's Faded Level is too high, the monster approaches and the game ends with visual effects indicating the player succumbing to their hallucinations.
<ol>
<li>Bad ending</li>
</ol>
</li>
<li>
If the player's Faded Level is low enough, the hallucination fades, and the monster is revealed to be their friends.
<ol>
<li>Good ending</li>
</ol>
</li>
<li>
If the player chooses to hide in a tent, then the player is safe until morning, and nothing is revealed about the monster or friends.
<ol>
<li>Ambiguous ending</li>
</ol>
</li>
</ol>

<p>I like this version due to the balance of good, bad, and ambiguous endings; however, the biggest limitation is the large amounts of mechanics I would have to implement which would increase development time and muddy-up the gameplay. </p>

<p>The third and final version of the ending is similar to the previous version; however, it is more simplified. The simplified mechanics are now just: </p>

<ol>
<li>
Stress level
<ol>
<li>Tied to heart rate, breathing SFX, visual effects</li>
<li>Triggers lose condition if it gets too high</li>
<li>Lowers slowly over time</li>
</ol>
</li>
</ol>

<p>I had always planned to have an artifact collecting mechanic in some shape or form. Artifact collection would be a main part of the gameplay, similar to Slender: The Eight Pages, so I wanted it to play a role in the ending of the game. Similar to the past version, once the player reaches the campsite, the monster begins to approach, then one of the following happen: </p>

<ol>
<li>
If the player didn't collect enough artifacts, the hallucination takes over and the monster closes in.
<ol>
<li>Bad ending</li>
</ol>
</li>
<li>
If the player collected enough artifacts, the hallucination fades and the monster is revealed to be the friends.
<ol>
<li>Good ending</li>
</ol>
</li>
<li>
If the player hides in a tent, the player is safe until day and nothing is revealed about the monster or friends.
<ol>
<li>Ambiguous ending</li>
</ol>
</li>
</ol>

<p>This version of the story keeps the balance and player agency of the previous version, while simplifying the necessary mechanics.</p>

<p>Besides ironing out the story, I also worked with shaders and post processing in Unity. I wrote a few scripts that gave me the ability to influence a few different audio and visual effects with a single variable. The player has a stress variable that will start at 0, and if it gets to 1 at any point the lose condition is triggered (not yet implemented). </p>

<p>This stress variable is tied to a few different effects:</p>

<ul>
<li>Heartbeat audio volume and pitch</li>
<li>Shader noise strength</li>
<li>Shader red filter strength</li>
</ul>

<img alt="Stress visual effects: screen noise and a red filter increasing with the stress variable" src="/assets/img/games/personal-project/devlog/stress-effects.gif"/>
