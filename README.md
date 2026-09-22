# Manyatta Gonda FC Website

A responsive football-club website built with HTML, CSS and JavaScript.

## Open in Visual Studio Code

1. Extract the project folder.
2. Open `Manyatta_Gonda_FC_Website` in Visual Studio Code.
3. Install the **Live Server** extension (recommended).
4. Right-click `index.html`.
5. Choose **Open with Live Server**.

You can also open `index.html` directly in a browser, but Live Server makes development easier.

## Add your logo

Put your logo here:

`images/logo.png`

The website will automatically use it.

## Add match photos

Create a folder for each match if you like, for example:

`images/matches/match-01/photo1.jpg`

Then update the `photos` list for that match in:

`data/matches.js`

## Update the website after every match

Open:

`data/matches.js`

Add the newest match object near the top of the `matches` array.

Example:

{
  id: 3,
  date: "2026-10-05",
  opponent: "City Stars FC",
  venue: "Manyatta Ground",
  competition: "League",
  homeScore: 2,
  awayScore: 0,
  result: "W",
  playerOfMatch: "Player Name",
  report: "Write your match report here.",
  scorers: [
    { player: "Player Name", minute: "34'" },
    { player: "Another Player", minute: "72'" }
  ],
  photos: [
    "images/matches/match-03/photo1.jpg",
    "images/matches/match-03/photo2.jpg"
  ]
}

Use:
- `W` for win
- `D` for draw
- `L` for loss
- `UPCOMING` for a future fixture

## Important

This version is a static website. Match information is stored in `data/matches.js`, so changes are made locally in Visual Studio Code and then uploaded when you publish the website.

A future version can add a proper **admin dashboard**, where you log in and enter a match through a form instead of editing code.
