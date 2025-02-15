# OTORRINOLARINGOLOGIA
yes, im naming this that

stupid project ive started on an electron app that had access to dev tools and editing the html like that which later became this ; an actual website to host this thing because holy shit why do i not have access to notepad

im still mad about that but i think this thing is way better anyway

---

### ⚠️ disclamer:

- this does not store anything anywhere except your pc with localstorage, if you clear site data and cookies, your saved notes will be gone ... if you're fast enough lol

- i cannot guarantee that it will actually save so dont get mad at me if it doesn't

# FEATURES:
- REALTIME MARKDOWN
- autosaving every second
- creatures ‼️
  - selectable via the paw button in the toolbar
- TABS
  - renaming (with right click)
  - re-ordering with drag n drop
- "CMD LINE" to export/backup your notes and tabs !! 
  - accessable with `CTRL` + `ALT` + `Q`, and typing "export" for backup, "import" for restore
- garb

# CREDITS:
- [simplemde](https://github.com/sparksuite/simplemde-markdown-editor) (HUGE)
- [alsoangle](https://bsky.app/profile/alsoangle.bsky.social) for ralsei art
- [jadedholiday](https://x.com/jadedholiday) for ralsei art
- [IcyMaxi](https://bsky.app/profile/maximaxi.cookiaria.lol) for art of my oc and themselves
- merad01 - for ralsei art comm
- Chikn Nuggit - for Cheezborger asset
- tobyfox/ for ralsei assets 
- nightmargin for niko assets
- cats
- pukeko
- garb

# CHANGELOG:
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
  - accessable with `CTRL` + `ALT` + `Q`
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

##  Checklist <span style="font-size:0.75em">of things i wanna add in the future</span>
- [ ] preview making the creature Invisible 
- [ ] a button to automatically upload an image to catbox and insert it
- [ ] garb removal (will never happen, hes too powerful)