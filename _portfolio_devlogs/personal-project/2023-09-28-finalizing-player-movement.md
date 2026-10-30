---
project: personal-project
title: "Finalizing Player Movement"
date: 2023-09-28
---

<p> I started today by creating a basic environment to test my player movement in. I added a plane, and some stretched cubes to be walls. </p>

<p> After trying for too long to use the mouse to control the player's gaze, I ended up giving up and getting a prebuilt first person player controller from the Unity Asset Store. I modified the code to use Unity's new input system because I want to be able to play this game with mouse and keyboard or controller. The asset also came with crouch, sprint, and jump which may come in handy. </p>

<p> Additionally, the asset came with an audio manager for footsteps, jump sound, crouch sounds, etc. The sounds were really good right off the bat; however, I slowed the player movement way down, so I also had to pitch down all of the audio sources. </p>

<p> The last thing I added was a dynamic camera bob to simulate walking that adjusts when the player sprints. With the camera bob, repitched audio, and slowed movement the player controller was finished. I really like how it turned out, and it is the perfect horror vibe I was going for. </p>
