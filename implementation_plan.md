# Implementation Plan - Podcast Q&A Bot (Option 3)

Build an interactive, premium web application that serves as a Q&A Bot for the podcast: **"Elon Musk: A Different Conversation w/ Nikhil Kamath | Full Episode | People by WTF Ep. 16"** (YouTube Video ID: `Rni7Fz7208c`). 

The application will allow users to ask questions about the podcast, receive an AI-generated answer based on the transcript context, and click on source timestamps to jump the embedded YouTube player directly to the exact moment the topic was discussed.

---

## User Review Required

> [!IMPORTANT]
> **API Key Strategy:**
> To keep the application 100% serverless and easily deployable to static hosting (Vercel, Netlify, or GitHub Pages), we will implement a client-side Gemini API key input.
> - The API key will be saved securely in the user's browser `localStorage` and sent *only* directly to the official Google Gemini API.
> - If no API key is provided, the app will fall back to a high-quality client-side text/keyword search across the transcript chunks, showing the matching video clips (but without the LLM-generated summary). This ensures the app is always functional.
> 
> Please let me know if this client-side API key configuration works for you or if you prefer a different backend setup.

---

## Open Questions

> [!NOTE]
> 1. **Hosting & Deployment:** Do you plan to deploy this on a service like GitHub Pages, Vercel, or Netlify? (We recommend Vercel or Netlify for simple drag-and-drop or Git-linked deployment).
> 2. **Workspace:** Please confirm that you have set the project folder `C:\Users\ganes\.gemini\antigravity\scratch\podcast-qa-bot` as your active workspace in your IDE.

---

## Proposed Changes

We will build the project inside the default scratch directory: `C:\Users\ganes\.gemini\antigravity\scratch\podcast-qa-bot`.

```
podcast-qa-bot/
├── scripts/
│   └── get_transcript.py       # Python script to download & format the YouTube transcript
├── public/
│   └── transcript.json         # Structured transcript data (chunks with text & timestamps)
├── src/
│   ├── index.html              # Main HTML markup
│   ├── styles.css              # Premium glassmorphic styling
│   └── app.js                  # Application logic & YouTube API integration
├── package.json                # Project dependencies and run commands
└── README.md                   # Setup and usage instructions
```

### 1. Data Extraction Component

#### [NEW] [get_transcript.py](file:///C:/Users/ganes/.gemini/antigravity/scratch/podcast-qa-bot/scripts/get_transcript.py)
* A Python script using `youtube-transcript-api` to fetch the transcript of the video `Rni7Fz7208c`.
* It will group the individual sentence captions into structured chunks of approximately 45–60 seconds.
* Each chunk will have:
  * `text`: The spoken words.
  * `start`: The start time in seconds.
  * `duration`: The duration of the segment.
  * `timestamp`: A formatted string (e.g., `12:34`).
* Output will be saved to `public/transcript.json`.

---

### 2. Frontend Application

#### [NEW] [index.html](file:///C:/Users/ganes/.gemini/antigravity/scratch/podcast-qa-bot/src/index.html)
* Core structure of the page, implementing SEO best practices.
* Layout divisions:
  * **Header**: App title, short description, and a button to open the Gemini API Key settings modal.
  * **Main Content Area**: Two-column layout (responsive grid):
    * **Left Column**: Search/Question input, dynamic answer board, and retrieval source cards.
    * **Right Column**: Embedded YouTube player container.
  * **Settings Modal**: Secure UI to input and save the Gemini API key.

#### [NEW] [styles.css](file:///C:/Users/ganes/.gemini/antigravity/scratch/podcast-qa-bot/src/styles.css)
* Custom modern styling (no template frameworks like Tailwind to ensure maximum flexibility and lightweight performance).
* Glassmorphism effects (`backdrop-filter: blur()`), glowing gradients, deep dark-theme background palette (e.g., HSL-tailored slate and deep blue/emerald accents).
* Smooth transition animations on search, hover states, and modal popups.

#### [NEW] [app.js](file:///C:/Users/ganes/.gemini/antigravity/scratch/podcast-qa-bot/src/app.js)
* **YouTube Player Integration**: Loads the YouTube IFrame Player API and initializes the video player. Implements a helper function `jumpToTime(seconds)` to seek and play.
* **Search / Retrieval Engine**:
  * Loads the `transcript.json` data.
  * Performs client-side keyword and fuzzy matching scoring to identify the top 3-4 transcript chunks relevant to the user's question.
* **AI Q&A Logic**:
  * If a Gemini API Key is configured, it calls the Gemini API (`gemini-1.5-flash`) via a direct HTTPS fetch.
  * Passes the user's question along with the retrieved transcript chunks as context, instructing the model to answer the question briefly based *only* on the provided context, and specify which parts of the context were used.
* **Render Logic**:
  * Populates the AI text answer.
  * Renders the source transcript chunks as clickable cards. Clicking a card triggers `jumpToTime(seconds)` on the YouTube player.

---

### 3. Documentation

#### [NEW] [README.md](file:///C:/Users/ganes/.gemini/antigravity/scratch/podcast-qa-bot/README.md)
* Setup instructions for running the app locally.
* Detailed steps on how the AI extraction works, which models were used, and verification procedures (directly supporting the deliverables required in the assignment sheet).

---

## Verification Plan

### Automated/Local Verification
- Run the python transcript retrieval script and ensure `public/transcript.json` is correctly populated with timed segments.
- Run a local static server to serve the frontend.
- Verify search functionality:
  * Test search without an API key (ensuring fallback matching works and displays correct timestamps).
  * Test search with a Gemini API key (verifying the API retrieves data and displays the LLM summary response).
- Verify the YouTube Player API hooks correctly and that clicking timestamps successfully seeks to the exact video second.

### Manual Verification
- Ask the user to open the local development URL, enter their Gemini API key, run a query (e.g., "What is first-principles thinking?"), and verify that the video seeks to the correct explanation from Elon Musk.
- Perform responsive testing across mobile, tablet, and desktop dimensions.
