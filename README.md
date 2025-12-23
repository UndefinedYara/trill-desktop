# Trill Desktop

**Note:** I'm excited to announce that we'll be deploying Trill Desktop soon! Stay tuned for a live version.

Trill Desktop is a web application that helps musicians identify chords from notes played on a virtual fretboard. It's a powerful tool for learning and understanding music theory.

## Demo

Here's a sneak peek of Trill Desktop in action:

![Trill Desktop Fretboard](public/images/demo/fretboard.png)

_Caption: The user selects notes on the fretboard and the app identifies the chord._

![Trill Desktop App Output](public/images/demo/chordoutput.png)

_Caption: The app displays different voicings for F major chord. along with other chord matches._

![Trill Desktop Chord Library](public/images/demo/chordlookup.png)

_Caption: An additional feature allows users to browse different chords using the chord library._

## Features

### Chord Finder

The core feature of Trill Desktop is the Chord Finder. It allows you to select notes on a virtual guitar fretboard and identify the chord you are playing.

Here's how it works:

1.  **Select Notes:** Click on the fretboard to select the notes of a chord.
2.  **Find Chord:** Click the "Find Chord" button.
3.  **View Results:** The application will display the most likely chord graphs for the selected notes, along with different ways to play the chord.

### How it Works Under the Hood

The Chord Finder uses a combination of client-side music theory analysis and a backend service to provide fast and accurate results.

1.  **Local Inference (Client-Side):** When you click "Find Chord", the application first analyzes the notes you've selected directly in your browser.

    - It converts the fret and string positions to musical notes.
    - A music theory engine then identifies the most likely chord names by comparing the selected notes to a vast database of chord formulas.

2.  **Data Fetching (Server-Side):**
    - The top 3 best matches are then sent to a server-side API.
    - The API connects to a Firebase Firestore database to retrieve detailed chord information.

#### Firebase Integration

- **Connection:** The application connects to Firebase using a service account configuration stored in `src/lib/firebase/service-account.json`. This allows secure access to the Firestore database from the server-side.
- **Database Seeding:** The chord library in Firestore is populated using a custom script (`scripts/seed/seed.ts`).

  - The script reads chord data from the invaluable [chords-db](https://github.com/tombatossals/chords-db) project.
  - It extracts all unique chord keys (e.g., C, G, Am) and suffixes (e.g., "major", "minor", "dim7") and stores them in separate collections for efficient lookup.
  - Finally, it iterates through and seeds the main 'chords' collection with detailed information for each chord voicing.

- **Data Transformation:** Before being stored in the database, the raw chord data undergoes a transformation (`scripts/seed/helpers/transform-chords.ts`).
  - Fret positions, which can be represented by numbers, 'x' (muted), or letters (for frets 10+), are normalized into a consistent numerical format. For example, 'x' becomes -1 and letters like 'a' are converted to their corresponding fret number (10).
  - Fingerings are converted into a numerical array.
  - Barre chord information is standardized into an array format.

This structured and cleaned data allows the application to quickly and efficiently query for chords and display their diagrams.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/undefinedyara/trill-desktop.git
    ```
2.  **Install dependencies:**
    ```bash
    cd trill-desktop
    npm install
    ```
3.  **Set up Firebase:**
    - Create a Firebase project.
    - Generate a service account key and save it as `src/lib/firebase/service-account.json`.
4.  **Seed the database:**
    ```bash
    npm run seed -- --write
    ```
5.  **Run the development server:**
    ```bash
    npm run dev
    ```
6.  **Open your browser:**
    Navigate to `http://localhost:3000` to see the application.
