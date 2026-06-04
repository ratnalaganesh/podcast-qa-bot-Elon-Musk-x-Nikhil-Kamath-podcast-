# Sportomic AI Lab Intern - Podcast Q&A Bot (Option 3)

This project is an interactive AI-powered Q&A Search Assistant trained on the 2-hour podcast: **"Elon Musk: A Different Conversation w/ Nikhil Kamath | People by WTF Ep. 16"** (YouTube Video ID: `Rni7Fz7208c`). 

It enables users to input questions about the podcast, generates summarized answers using Google Gemini 1.5 Flash based strictly on the transcript context, and embeds the YouTube player to jump directly to the exact timestamps where the topics are discussed.

---

## 🚀 How to Run the Project Locally

Because the application fetches a local JSON file (`public/transcript.json`) and interacts with external APIs, modern web browsers will block requests if you open the `index.html` file directly using `file:///`. You must run it using a local development server.

### Method 1: Using Node.js (Vite)
If you have Node.js installed:
1. Open your terminal in the project directory.
2. Install Vite:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (e.g., `http://localhost:5173`) in your browser.

### Method 2: Python HTTP Server (Zero Dependencies)
If you have Python installed:
1. Open your terminal in the project directory.
2. Run a simple HTTP server:
   * **Windows/Mac/Linux**: 
     ```bash
     python -m http.server 8000
     ```
3. Open `http://localhost:8000` in your browser.

---

## 🛠️ Tools & Models Used

1. **Data Extraction**:
   * **YouTube Transcript API (Python)**: Used to extract raw captions with exact millisecond timestamps directly from the video.
   * **Custom Parsing Script (`scripts/get_transcript.py`)**: Batches raw captions into coherent 45–60 second chunks, keeping track of start times and formatting timestamps (`MM:SS` / `HH:MM:SS`) to create a search index.
2. **AI Inference & RAG**:
   * **Google Gemini 1.5 Flash**: Selected for generating context-grounded summaries because of its high speed, long context window, and accuracy.
   * **Client-Side Keyword/TF-IDF Engine**: A lightweight text retrieval script in JavaScript that scores transcript chunks against the user's query to find the most relevant context blocks.
3. **Frontend Stack**:
   * **HTML5 & Vanilla CSS3**: Designed with modern glassmorphism UI principles, custom scrollbars, glowing accent rings, and interactive micro-animations (no heavy external CSS frameworks to ensure instant loading).
   * **YouTube IFrame Player API**: Embedded and controlled programmatically to enable instant seeking/playing on timestamp clicks.

---

## 🧠 Prompt Strategy & Workflow

When a query is submitted, the workflow executes as follows:
1. **Tokenization**: The JavaScript engine cleans the query, removes common stop words, and searches the `transcript.json` index.
2. **Retrieval**: The top 4 most relevant transcript blocks are retrieved and combined into a context block.
3. **Prompt Injection**: The query and context are structured into a system prompt:
   ```text
   You are an intelligent Q&A assistant analyzing the transcript of the YouTube podcast "Elon Musk: A Different Conversation w/ Nikhil Kamath" (WTF Podcast Ep. 16).
   Your job is to answer the user's question accurately using ONLY the transcript context provided below.

   INSTRUCTIONS:
   1. Provide a concise, professional answer (1-2 paragraphs max).
   2. Answer based strictly on the context. If the answer is not mentioned, say "Based on this section of the podcast, this was not discussed."
   3. Highlight the timestamps in the format [MM:SS] or [HH:MM:SS] exactly where key points are mentioned so the user knows where they occurred.
   4. Use standard markdown paragraphs. Do not use complex tables.

   User Question: {query}
   Transcript Context: {contextText}
   ```
4. **Direct API Call**: The prompt is dispatched via `fetch` to Google's Gemini API key endpoint.
5. **Interactive Playback**: The UI renders the answer, links the bracketed timestamps to the player, and lists the source chunks. Clicking a timestamp calls `youtubePlayer.seekTo(seconds)` and plays the video.

---

## 🔬 Accuracy Check & Verification

To verify that the Q&A bot retrieves the correct information and timestamps, we tested a range of search queries:

*   **Query**: *"What is first-principles thinking?"*
    *   **Retrieval Match**: Clip Segment #84 (Timestamp `01:03:00` / `63:00`).
    *   **LLM Answer**: Explains that physics is first-principles thinking, reasoning from fundamental truths rather than analogy.
    *   **Video Playback Verification**: Clicking the badge seeks to `1:03:00`, where Elon Musk starts explaining: *"First principles reasoning... boil things down to their most fundamental truths..."*. **Status: 100% Accurate.**
*   **Query**: *"Will work become optional in the future?"*
    *   **Retrieval Match**: Clip Segment #47 (Timestamp `31:09` / `1869s`).
    *   **LLM Answer**: Confirms Elon Musk predicts working will be optional in less than 20 years due to AI and robotics.
    *   **Video Playback Verification**: Player seeks to `31:09`, where Elon discusses AI making work optional. **Status: 100% Accurate.**

---

## ⚠️ Limitations & Future Improvements

### AI & Pipeline Limitations
1. **No Speaker Diarization**: The raw transcript does not explicitly mark whether Elon Musk or Nikhil Kamath is speaking. The LLM must infer this from context clues.
2. **Context Fragmentation**: If a discussion on a topic spans 10 minutes, chunking it into 50-second blocks might separate related context.
3. **Noisy Transcripts**: Auto-generated YouTube captions occasionally contain spelling errors (e.g., "stinking satellite" instead of "starlink satellite") or missing punctuation, which affects search score precision.

### Future Improvements
1. **Speaker Labels**: Integrate an audio diarization model (like Whisper + PyAnnote) to prepend speaker names to the transcript chunks.
2. **Vector Embeddings (Dense Retrieval)**: Replace the keyword scoring engine with local vector embeddings (using a client-side library like Hugging Face's transformers.js) to understand semantic meaning (e.g., matching "future of jobs" with "working is optional").
3. **Sliding Window Chunking**: Implement overlapping chunks to avoid losing context on boundaries.
