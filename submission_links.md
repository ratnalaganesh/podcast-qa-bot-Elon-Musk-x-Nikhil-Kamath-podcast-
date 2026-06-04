# Sportomic AI Lab Internship Submission
## Candidate: Ganesh Ratnala
## Assignment Option: Option 3 (Podcast Q&A Bot)

Below are the required links and documentation for the submission of Option 3 (Podcast Q&A Bot).

---

## 🔗 Project Links

*   **GitHub Repository**: [https://github.com/ratnalaganesh/podcast-qa-bot-Elon-Musk-x-Nikhil-Kamath-podcast-](https://github.com/ratnalaganesh/podcast-qa-bot-Elon-Musk-x-Nikhil-Kamath-podcast-)
*   **Live Deployed Application (Netlify)**: [https://melodious-kataifi-1be334.netlify.app/](https://melodious-kataifi-1be334.netlify.app/)
*   **Explainer Video Walkthrough (Loom)**: [https://www.loom.com/share/02fde24c0e174d3d9179f10c453c295b](https://www.loom.com/share/02fde24c0e174d3d9179f10c453c295b)

---

## 🛠️ Project Summary

An interactive, AI-powered Q&A Search Assistant trained on the 2-hour podcast: **"Elon Musk: A Different Conversation w/ Nikhil Kamath | People by WTF Ep. 16"** (YouTube Video ID: `Rni7Fz7208c`). 

### Core Features Implemented:
1.  **Semantic RAG Pipeline**: Built a Python data pipeline to clean and segment the 2-hour podcast transcript into 170 contextual 45–60s chunks, saved as a client-side search database.
2.  **Glassmorphic Dark Theme**: Implemented a responsive dark-mode space aesthetic using HSL variables, glowing visual states, and card micro-animations (built with HTML5 & Vanilla CSS).
3.  **YouTube IFrame Player API**: Embedded the official player, allowing users to watch the video and interactively jump to exact playback seconds by clicking response timestamps.
4.  **Google Gemini AI Integration**: Calls the `gemini-2.0-flash` endpoint directly from the client (configured securely via Netlify environment variables) to synthesize transcript-grounded answers.
5.  **Mock Q&A Fallback**: Fast pre-cached responses for suggested topics to ensure 100% demo uptime and speed.
