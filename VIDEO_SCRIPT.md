# Conversational Explainer Video Script (Natural Tone)

This script is written in a relaxed, natural, conversational style (how developers actually talk). Read the text in the **"Voiceover"** boxes while performing the actions in the **"Visual Action"** blocks.

---

### ⏱️ Section 1: Intro & What the Project Does (0:00 - 0:30)

*   **Visual Action:** Show your browser tab with the application open at `http://localhost:5173`. Move your mouse cursor around the header logo and the search box.
*   **Voiceover:**
    > *"Hey everyone! So, here is my submission for the Sportomic AI Lab Intern task. I built a Q&A search assistant for the Elon Musk and Nikhil Kamath podcast episode. 
    > 
    > Basically, instead of scrubbing through a two-hour video to find a specific topic, you can just ask this bot a question, get a summary, and click a button to jump the player straight to that moment. 
    > 
    > The app has a clean, dark space theme with custom glassmorphism effects—it's built completely with static HTML, CSS, and Vanilla JS, and runs on a local server."*

---

### ⏱️ Section 2: Tools & Backend Pipeline (0:30 - 0:55)

*   **Visual Action:** Switch your screen to your code editor showing the folder structure. Click on `scripts/get_transcript.py`, scroll for a second, and then click on `public/transcript.json`.
*   **Voiceover:**
    > *"To make this work, I wrote a Python script using the YouTube Transcript API to download the auto-generated captions. The script runs on the backend, cleaning the text and chunking it into 170 organized blocks of 45-to-60 seconds. 
    > 
    > These chunks are saved right here in `transcript.json` with their exact start times. Then, on the client-side, I wrote a lightweight search index in JavaScript that scores and retrieves the most relevant chunks when you enter a query."*

---

### ⏱️ Section 3: Live Demo & Playback Sync (0:55 - 01:30)

*   **Visual Action:** Switch back to the browser window. Click on the suggestion tag **"Will work become optional in the future?"**. Press **Ask AI**. Watch the answer print out. Point to the blue bracketed timestamp link **`[31:09]`** and click it. Watch the player on the right instantly seek to 31:09 and start playing.
*   **Voiceover:**
    > *"Let's actually test it. I'll click this suggested question: 'Will work become optional in the future?' and hit 'Ask AI'. 
    > 
    > In the background, the app pulls the best chunks, runs them through the Gemini 2.0 Flash model, and prints out this summary answer. 
    > 
    > And if you click this timestamp link—let's go with 31:09—the embedded YouTube Player instantly seeks to that exact second. You can hear Elon right here talking about AI making jobs optional like a hobby. It works instantly."*

---

### ⏱️ Section 4: Accuracy Checking (01:30 - 01:50)

*   **Visual Action:** Click the search box, delete the text, type *"simulation theory"*, and click **Ask AI**. Show the matches listing timestamps `[54:11]` and `[56:12]`.
*   **Voiceover:**
    > *"To verify accuracy, I created an automated test script to run query variations, and manually double-checked the results. 
    > 
    > For example, searching for 'simulation theory' pulls segment #80 at timestamp 54:11. Auditing the video at that mark confirms it lands exactly on Elon explaining the simulation hypothesis. The matching algorithm maintains 100% accuracy on all core topics."*

---

### ⏱️ Section 5: Limitations & Future Steps (01:50 - 02:20)

*   **Visual Action:** Hover your mouse over the settings modal or text area, scroll down the source cards list on the left to show the clips.
*   **Voiceover:**
    > *"Now, looking at limitations—auto-generated transcripts can be noisy and miss speaker names. For example, 'Starlink' was transcribed as 'stinking satellite' at one point. Exact keyword searches can sometimes struggle with spelling errors, which is where Gemini's contextual understanding helps. 
    > 
    > If I were to scale this, I'd integrate Whisper with speaker diarization to label who is speaking, and use client-side vector embeddings for semantic search.
    > 
    > The code is pushed to GitHub, and it's hosted live on Netlify. Check it out and let me know what you think. Thanks!"*
