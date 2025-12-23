# Trill Desktop

Trill Desktop is a web application that helps musicians identify chords from notes played on a virtual fretboard. It's a powerful tool for learning and understanding music theory.

## Features

### Chord Finder

The core feature of Trill Desktop is the Chord Finder. It allows you to select notes on a virtual guitar fretboard and identify the chord you are playing.

Here's how it works:

1.  **Select Notes:** Click on the fretboard to select the notes of a chord.
2.  **Find Chord:** Click the "Find Chord" button.
3.  **View Results:** The application will display the most likely chord names for the selected notes, along with different ways to play the chord.

### How it Works Under the Hood

The Chord Finder uses a combination of client-side music theory analysis and a backend service to provide fast and accurate results.

1.  **Local Inference (Client-Side):** When you click "Find Chord", the application first analyzes the notes you've selected directly in your browser.
    *   It converts the fret and string positions to musical notes.
    *   A music theory engine then identifies the most likely chord names by comparing the selected notes to a vast database of chord formulas.

2.  **Data Fetching (Backend):**
    *   The top 3 best matches are then sent to a backend service.
    *   The backend searches its library for all the different ways to play the identified chords.
    *   This information is sent back to the application and displayed to you.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/trill-desktop.git
    ```
2.  **Install dependencies:**
    ```bash
    cd trill-desktop
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  **Open your browser:**
    Navigate to `http://localhost:3000` to see the application.