# CHANGELOG:

### v13.0-mini-tangerine - mar 26, 2025
- made nerdfonts locally hosted because nerdfonts is blocked in some countries and at my job now (????)
- tabnames.json and creatures.json now download before actually being used lol
- made the cursor just a lil bit chubby
- fixes for sfx to be more accurate to osu!lazer
- cursor now smoothly fades in and out because Why Not
- moved webamp to a command instead of having a button for it in simplemde
- noclip command (real)
- creature now correctly positions itself within the tab's content, without offset when zooming in
  - still kinda offset for iframe tabs...

### v12.4-watermelon-kaleidoscope - mar 20, 2025
- fixed an issue where if you had tabs with preview mode on, and create a new one, it would lose its preview state on reload
- creature list is now saved in memory, so that it doesn't fetch for the list every time you click the button (like a Normal Person)
- created a blacklist of links you are not allowed to input on the custom tab selector (like the website itself, google, youtube, reddit)
- importing now also refreshes the page after importing to also load the creatures and opacity state
- copyable quotes now don't also copy the "copied!" text after copying them multiple times (i literally made it only copy stuff inside \<p> elements)

### v12.3-watermelon-kaleidoscope - mar 18, 2025
- added an sfx toggle. use the command input and type `sfx`
- added more random tab names
- simplemde-loader now makes sure to remove all "orphaned" tab contents from localstorage if it failed to actually delete or if your browser somehow saves it after reloading anyway.
- tabs now scroll automatically as you create them
- made quoteblocks copyable by clicking
- fixed importing/exporting issue where importing would import random garbage data or the entire tab's json 

### v12.2-watermelon-kaleidoscope - mar 17, 2025
- discord embed test
- added a site description for google robots
- moved the position of the command input, its now centered and inside the editor
- fixed ca-clock AGAIN oopsies 

### v12.1-watermelon-kaleidoscope - mar 17, 2025
- fixed clock oopsies

### v12.0-watermelon-kaleidoscope - mar 17, 2025
- added a .0 in the version scheme because why not
- added the ability to add an iframe tab of your own (to enter your own url) ‼️
- moved the "+" tab to the right
- tab-creation "overhaul"? tabs now generate with random names ‼️
- added a button (within simplemde's toolbar) to open the command input
- moved preview button to the right, also changed the icon for it
- new super secret clock elements
- more creatures

### v11.2-starfruit-supernova - mar 10, 2025
- randomcreatures.js rewrite, it now handles json like a Normal Person
- customizable creature opacity in commands, type `creature-opacity [1-100]%` on the cmd
- cmd now opens with ALT+C. like a Normal Person
- cmd now accepts javascript input. go crazy.
- wider cmd text input
- new creature
- scheduletab changelog:
  - removed scrollbar

### v11.1-starfruit-supernova - mar 9, 2025
- added webamp LMAO
- scheduletab changelog:
  - added more flavor text
  - removed some flavor text

### v11-starfruit-supernova - mar 2, 2025
- strawberry jam reference
- removed music player (i don't like pirating music that much)... but this will be revised at some point
- added a clock tab (huge ass clock... mothafuckin' clock bitch...)
  - with added "alarm" functionality to better organize my schedule
  - one issue it has is that it triggers the alarm one second earlier than expected. cant be bothered to fix that im sleepy as fuck and its 1 am 
- added the cookietab. yeah. click on it and use arrow keys
- did i mention i added a background in the previous changelog? oopsies
- attempted to remove garb (unsuccessful)

### v10-radioactive-banana - feb 26, 2025
- tab rendering overhaul. is this even a "notes thing" at this point?
  - you are now able to render HTML files in tabs
  - tabs now render at all times, just "hiding" them while switching. this is done to keep the tab running for some stuff in the future (like an alarm, for my schedule... hell)
  - added the first and new different tab type: musplayer. because i get too bored at my job.
- revamped cmd.js's `begone`. it is now `clear`
- div re-structuring to better handle different content within tabs (truth)
- moved changelog to its own file
- new creature
- its 12 49 am i should stop

### v9-blueberry-yogurt - feb 23, 2025
- fixed an issue where the first ever generated tab would not save like the others, so everything should be working as expected now
- the creature now shows up in front of everything! with the compromise of tinting the text a little bit...
- fixed clock padding when being put inside a quote block
- updated css to make the editor background not transparent
- fixed an issue where `export` would only export the visible tab only and the number of tabs and names... but not the other tabs' content
- `begone` now shows a warning before deleting

### v8.1-orange-carrotjuice - feb 17, 2025 
- made cmd outputs a browser pop up because Surprise not everyone has the dev console on
- new command: calc
  - example usage: `calc 453*12` yeah you get it
- removed cursor:grab on tabs because that was stupid
- actually added a creature cant believe i forgor

### v8-orange-carrotjuice - feb 15, 2025 
- you can now re-order tabs by drag and drop !!!!
- made tabs save preview state even when restarting
- added a clock button on the toolbar. it adds a clock \<p> element (that only works with preview on) 
- removed H2, H3 buttons from toolbar
- first tab is now removeable, will make a new one if there are no more tabs
- removed middleclick functionality (mfw i didn't remember that i had to middleclick to autoscroll)
- simplemde container now has a maximum width and will center on the page (it looks so off when its fullscreen for me, idk)
- more creatures

### v7-strawberry-pie - feb 14, 2025 
- improved codeblock coloring
- improved html coloring
- remade the tab renaming to be more integrated instead of a fullscreen browser popup
- renaming a tab "begone" no longer deletes everything, it was moved to the CMD (be careful because it has no confirmation this time!!)
- version on the bottom left including a food because why not ...
- customized the toolbar a lil bit
  - bold, italics and strikethrough are now first
  - all 3 header options (though i might remove 2 and 3...)
  - preview button
  - dedicated button for creatures on the toolbar !!
  - switched from using fontawesome to [nerdfonts](https://www.nerdfonts.com/) because fontawesome stinky
- creature menu no longer in the bottom left
- more creatures, removed one (fox rotation)
- fixed an issue where if you deleted a tab it didn't actually delete its contents from local storage oopsies
- removed old.html

### v6.1-grapejuice - last minute changes lol
- forgot to make the preview actually hide the creature (non transparent bg)
- added creature saving functionality
  - creature now saves if you choose one, but you can always go back to a random one for everytime you visit if you select "randomize"

### v6-grapejuice Feb 13, 2025
- CREATURE PICKER
  - you can now right click on the creature randomizer and choose your creature manually, it does not save still
  - creature picker has been moved from the top right to the bottom left
- more creatures! + credits
- COMMAND BAR
  - accessable with `CTRL` + `SHIFT` + `Q`
  - only commands so far are `export`, `import`, and `help`, will transfer "begone" to this system once i have time
- EXPORT AND IMPORT FEATURE (command bar only)
- made a helper script to automatically read from /assets/creatures and apply to creatures.txt if you somehow wanna fork this and add or delete creatures yourself and make the process faster (you need python)
- added info for wildcards that modify creature styles on creatures.txt
- fixed an issue where if you renamed a tab "begone" while only one tab, it wouldnt delete its contents
- a few easter eggs
- preview hides the creature for now until i figure something out

### v5 - Feb 9, 2025
- tabs can now be deleted and added
- added the ability to rename tabs by right clicking them
- when renaming a tab "begone", it factory resets everything with no return (why did i do 
this)
- added a random creature button

### v4 - Feb 7, 2025
- tabs ‼️‼️
- RANDOM CREATURES!
- AUTOSAVE

### v3.1 - Feb 6, 2025
- MIT license

### v3 - Feb 4, 2025
- attempt to make the preview also have the creature (epic fail)
- scrollbar fix attempt (it was ass)
- not an ultrakill reference anymore ... unless ... 

### v2 - Jan 29, 2025
- made assets point to /assets/thing instead of notes.cookiaria.lol/assets/thing or an old repo (i know im stupid)
- added favicon
- ultrakill reference

### v1 - Jan 28, 2025
- initial release
- creature "watermark"
- trying to make the height actually the same as the browser window
- ultrakill reference
