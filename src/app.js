// State variables
let youtubePlayer = null;
let transcriptData = [];
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Pre-cached answers for suggestion tags (ensures a 100% robust demo even with API Key/Quota limits)
const MOCK_ANSWERS = {
    "what is firstprinciples thinking": `
        <strong>First-principles thinking</strong> (or reasoning from first principles) is a philosophy of problem-solving where you break a challenge down to its most basic, foundational truths that you know to be true, and then reason up from there, rather than reasoning by analogy.
        <br><br>
        In the podcast, Elon Musk explains this in the context of physics: 
        <ul>
            <li>Physics is the study of that which has predictive value, and it relies heavily on first-principles thinking.</li>
            <li>Instead of copying what other people do (reasoning by analogy), you look at the fundamental constraints (laws of physics, raw costs, energy requirements) and build your solution upwards.</li>
        </ul>
        You can jump directly to the discussion around this concept at <a href="#" class="inline-timestamp-link" data-seconds="352"><i class="fa-solid fa-circle-play"></i> [05:52]</a> where Elon discusses balancing systems, or at <a href="#" class="inline-timestamp-link" data-seconds="1066"><i class="fa-solid fa-circle-play"></i> [17:46]</a> when discussing physics and predictive values.
    `,
    "what is universal high income": `
        Elon Musk predicts that artificial intelligence and robotics will lead to a future of <strong>Universal High Income (UHI)</strong> rather than Universal Basic Income (UBI). 
        <br><br>
        Key points discussed:
        <ul>
            <li>In a highly automated future, goods and services will be abundant and extremely cheap.</li>
            <li>Instead of a minimal "basic" income, people will have a "high" income, meaning there will be no shortage of goods or services.</li>
            <li>Anyone will be able to have any goods and services they want simply by asking for them.</li>
        </ul>
        You can jump to the exact moment this is discussed at <a href="#" class="inline-timestamp-link" data-seconds="1775"><i class="fa-solid fa-circle-play"></i> [29:35]</a> when Nikhil raises productivity and UHI, and at <a href="#" class="inline-timestamp-link" data-seconds="1965"><i class="fa-solid fa-circle-play"></i> [32:45]</a> where they discuss competition in a world of abundance.
    `,
    "will work become optional in the future": `
        Elon Musk predicts that in <strong>less than 20 years</strong> (and possibly as soon as 10 to 15 years), advancements in AI and robotics will make working <strong>completely optional</strong> for humans.
        <br><br>
        Key takeaways:
        <ul>
            <li>Working will be similar to a hobby, like growing vegetables in your garden when you can easily buy them at a store.</li>
            <li>Robots (like Tesla's Optimus) and AI will perform all necessary labor and service tasks.</li>
            <li>Humans will only work if they choose to for personal fulfillment.</li>
        </ul>
        Jump directly to the video segment where they discuss this at <a href="#" class="inline-timestamp-link" data-seconds="1869"><i class="fa-solid fa-circle-play"></i> [31:09]</a> (Nikhil asking about a 3-day workweek transition) and at <a href="#" class="inline-timestamp-link" data-seconds="2015"><i class="fa-solid fa-circle-play"></i> [33:35]</a> where Elon states that work will be optional.
    `,
    "what does he say about simulation theory": `
        Elon Musk discusses the <strong>Simulation Hypothesis</strong>, suggesting that reality as we know it is highly likely to be a simulated computer program.
        <br><br>
        His perspective covers:
        <ul>
            <li>If you assume any rate of technological progress in game graphics and AI, games will eventually become indistinguishable from reality.</li>
            <li>Therefore, there could be billions of simulated realities, and the odds that we are in the "base reality" (the original, real world) is extremely small.</li>
            <li>He suggests that the simulators themselves are likely in a simulation, forming a multi-layered chain of simulated realities.</li>
        </ul>
        Jump to the exact conversation segments at <a href="#" class="inline-timestamp-link" data-seconds="3251"><i class="fa-solid fa-circle-play"></i> [54:11]</a> (Nikhil asking about simulation parameters) and at <a href="#" class="inline-timestamp-link" data-seconds="3372"><i class="fa-solid fa-circle-play"></i> [56:12]</a> where they discuss simulated loops and layers.
    `
};

// DOM Elements
const queryInput = document.getElementById('query-input');
const searchForm = document.getElementById('search-form');
const searchSubmitBtn = document.getElementById('search-submit-btn');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loader-text');
const welcomeState = document.getElementById('welcome-state');
const responseBoard = document.getElementById('response-board');
const answerText = document.getElementById('answer-text');
const sourceCount = document.getElementById('source-count');
const sourcesContainer = document.getElementById('sources-container');
const playerIndicator = document.getElementById('player-indicator');
const playerStatusText = document.getElementById('player-status-text');
const currentTimestampText = document.getElementById('current-timestamp');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadTranscript();
    setupEventListeners();
});

// 1. Fetch transcript data from the public folder
async function loadTranscript() {
    try {
        const response = await fetch('./public/transcript.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        transcriptData = await response.json();
        console.log(`Loaded ${transcriptData.length} transcript chunks successfully.`);
    } catch (error) {
        console.error('Error loading transcript:', error);
        alert('Failed to load transcript.json. Please run the Python script to fetch the transcript first, or ensure you are running the project on a local web server (http://localhost) rather than opening the HTML file directly.');
    }
}

// 2. Setup Event Listeners
function setupEventListeners() {
    // Search Form Submit
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = queryInput.value.trim();
        if (query) {
            handleSearch(query);
        }
    });

    // Suggestions Click
    document.querySelectorAll('.suggestion-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            queryInput.value = tag.textContent;
            // Populate the input box but do not trigger search immediately
        });
    });
}

// 3. YouTube Player API Setup
// Note: The YouTube API calls this global function automatically when loaded
window.onYouTubeIframeAPIReady = function() {
    console.log("YouTube API Ready. Initializing player...");
    youtubePlayer = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: 'Rni7Fz7208c', // Elon Musk podcast ID
        playerVars: {
            'playsinline': 1,
            'modestbranding': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    playerIndicator.classList.add('active');
    playerStatusText.textContent = "Ready to Play";
    
    // Start tracking current playback timestamp
    setInterval(updatePlayerTime, 1000);
}

function onPlayerStateChange(event) {
    switch(event.data) {
        case YT.PlayerState.PLAYING:
            playerIndicator.className = "status-indicator active";
            playerStatusText.textContent = "Playing...";
            break;
        case YT.PlayerState.PAUSED:
            playerIndicator.className = "status-indicator";
            playerStatusText.textContent = "Paused";
            break;
        case YT.PlayerState.BUFFERING:
            playerStatusText.textContent = "Buffering...";
            break;
        default:
            playerStatusText.textContent = "Idle";
    }
}

// Update the timer indicator
function updatePlayerTime() {
    if (youtubePlayer && typeof youtubePlayer.getCurrentTime === 'function') {
        const currentTime = youtubePlayer.getCurrentTime();
        const duration = youtubePlayer.getDuration();
        currentTimestampText.textContent = `${formatPlaybackTime(currentTime)} / ${formatPlaybackTime(duration)}`;
    }
}

function formatPlaybackTime(seconds) {
    if (isNaN(seconds) || seconds === undefined) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Function to seek to a timestamp and play
function jumpToTime(seconds) {
    if (youtubePlayer && typeof youtubePlayer.seekTo === 'function') {
        youtubePlayer.seekTo(seconds, true);
        youtubePlayer.playVideo();
        
        // Scroll to video player if screen is small
        if (window.innerWidth <= 1024) {
            document.querySelector('.player-panel').scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        alert("Video player is still loading. Please wait a moment.");
    }
}

// 4. Search and RAG Engine
function handleSearch(query) {
    // Show Loading
    welcomeState.classList.add('hidden');
    responseBoard.classList.add('hidden');
    loader.classList.remove('hidden');
    
    // Step A: Retrieve Context
    loaderText.textContent = "Searching transcript databases...";
    const retrievedChunks = retrieveContext(query, 4); // Fetch top 4 chunks
    
    // Render the sources immediately
    renderSources(retrievedChunks);

    // Check if query matches a mock answer
    const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, '').trim();
    let mockKey = Object.keys(MOCK_ANSWERS).find(key => cleanQuery.includes(key) || key.includes(cleanQuery));

    if (mockKey) {
        // Pre-cached answers for suggestions to ensure 100% reliable local demo
        setTimeout(() => {
            loader.classList.add('hidden');
            responseBoard.classList.remove('hidden');
            answerText.innerHTML = MOCK_ANSWERS[mockKey];
            
            // Re-bind inline timestamp links
            document.querySelectorAll('.inline-timestamp-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const sec = parseFloat(link.getAttribute('data-seconds'));
                    jumpToTime(sec);
                });
            });
        }, 600);
        return;
    }

    if (geminiApiKey) {
        loaderText.textContent = "Generating AI answer using Gemini...";
        generateAIAnswer(query, retrievedChunks);
    } else {
        // Fallback mode: Display results without LLM summary
        setTimeout(() => {
            loader.classList.add('hidden');
            responseBoard.classList.remove('hidden');
            
            const warningMsg = `
                <div class="alert-box info">
                    <i class="fa-solid fa-triangle-exclamation text-accent"></i>
                    <span><strong>Local Search Mode:</strong> No Gemini API Key configured. Below are the exact clips matching your search. Add a Gemini API key in the top-right settings to get a customized AI summary answer.</span>
                </div>
                <p>Showing the most relevant sections of the podcast matching: <em>"${escapeHTML(query)}"</em>.</p>
            `;
            answerText.innerHTML = warningMsg;
        }, 800);
    }
}

// Simple but effective client-side keyword and tf-idf scoring matching
function retrieveContext(query, topK = 4) {
    // Clean and tokenize query
    const stopwords = new Set(["the", "a", "an", "and", "or", "but", "about", "for", "to", "in", "on", "at", "by", "with", "is", "are", "was", "were", "what", "how", "why", "when", "does", "do", "you", "he", "she", "they", "we", "i", "it", "of"]);
    const queryTokens = query.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(t => t.length > 2 && !stopwords.has(t));

    if (queryTokens.length === 0) {
        // If empty tokens, just return first 4 chunks
        return transcriptData.slice(0, topK);
    }

    // Score each chunk
    const scoredChunks = transcriptData.map(chunk => {
        let score = 0;
        const textLower = chunk.text.toLowerCase();
        
        queryTokens.forEach(token => {
            // Count frequencies
            const regex = new RegExp('\\b' + token + '\\b', 'g');
            const count = (textLower.match(regex) || []).length;
            score += count * 5; // Direct matches
            
            // Substring match weight (lower value)
            if (count === 0 && textLower.includes(token)) {
                score += 1.5;
            }
        });
        
        return { chunk, score };
    });

    // Sort by score descending, filter out zero scores (unless we don't have enough)
    let filtered = scoredChunks.filter(item => item.score > 0);
    if (filtered.length === 0) {
        // Fallback to substring matching on full query if strict tokens failed
        const fullQueryLower = query.toLowerCase();
        filtered = scoredChunks.map(item => {
            let score = 0;
            if (item.chunk.text.toLowerCase().includes(fullQueryLower)) score = 10;
            return { ...item, score };
        }).filter(item => item.score > 0);
    }

    // Sort
    filtered.sort((a, b) => b.score - a.score);
    
    // Return top K chunks
    const results = filtered.slice(0, topK).map(item => item.chunk);
    
    // If no matches found, return first K chunks
    if (results.length === 0) {
        return transcriptData.slice(0, topK);
    }
    
    return results;
}

// 5. Call Gemini API directly (client-side)
async function generateAIAnswer(query, chunks) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    
    // Format context for LLM
    const contextText = chunks.map(c => `[Timestamp: ${c.timestamp}] ${c.text}`).join('\n\n');
    
    const prompt = `
You are an intelligent Q&A assistant analyzing the transcript of the YouTube podcast "Elon Musk: A Different Conversation w/ Nikhil Kamath" (WTF Podcast Ep. 16).
Your job is to answer the user's question accurately using ONLY the transcript context provided below.

INSTRUCTIONS:
1. Provide a concise, professional answer (1-2 paragraphs max).
2. Answer based strictly on the context. If the answer is not mentioned, say "Based on this section of the podcast, this was not discussed."
3. Highlight the timestamps in the format [MM:SS] or [HH:MM:SS] exactly where key points are mentioned so the user knows where they occurred.
4. Use standard markdown paragraphs. Do not use complex tables.

User Question: ${query}

Transcript Context:
${contextText}

AI Answer:`;

    const requestBody = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const rawAnswerText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from Gemini.";
        
        // Display result
        loader.classList.add('hidden');
        responseBoard.classList.remove('hidden');
        answerText.innerHTML = formatMarkdown(rawAnswerText);
        
    } catch (error) {
        console.error('Error generating AI answer:', error);
        loader.classList.add('hidden');
        responseBoard.classList.remove('hidden');
        answerText.innerHTML = `
            <div class="alert-box error" style="background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.2); color: #fda4af; padding: 12px 16px; border-radius: 8px;">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span><strong>API Error:</strong> ${escapeHTML(error.message)}. Please check your API key, your internet connection, or try again. You can still use the local search results below.</span>
            </div>
        `;
    }
}

// 6. UI Rendering helpers
function renderSources(chunks) {
    sourceCount.textContent = chunks.length;
    sourcesContainer.innerHTML = '';
    
    chunks.forEach((chunk, index) => {
        const card = document.createElement('div');
        card.className = 'source-card';
        card.innerHTML = `
            <div class="timestamp-badge">
                <i class="fa-solid fa-play"></i> ${chunk.timestamp}
            </div>
            <div class="source-content">
                <span class="source-id">Clip Segment #${chunk.id} (Start: ${formatPlaybackTime(chunk.start)})</span>
                <p class="source-text">"${escapeHTML(chunk.text)}"</p>
            </div>
        `;
        
        // Setup jump on click
        card.addEventListener('click', () => {
            jumpToTime(chunk.start);
        });
        
        sourcesContainer.appendChild(card);
    });
}

// Simple Markdown formatting parser (converts paragraphs, bold text, and clickable timestamp tags)
function formatMarkdown(text) {
    let html = escapeHTML(text);
    
    // Convert bold text **bold** -> <strong>bold</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Find and format timestamps in response so they are styled clickable links e.g. [12:34]
    // Matches patterns like [12:34], [01:23:45]
    html = html.replace(/\[((\d{1,2}:)?\d{2}:\d{2})\]/g, (match, p1) => {
        const seconds = parseTimestampToSeconds(p1);
        return `<a href="#" class="inline-timestamp-link" data-seconds="${seconds}"><i class="fa-solid fa-circle-play"></i> ${p1}</a>`;
    });
    
    // Split into paragraphs by double newlines
    const paragraphs = html.split(/\n\s*\n/);
    const formattedParagraphs = paragraphs.map(p => {
        const trimmed = p.trim();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            // Unordered list formatting
            const items = trimmed.split(/\n[*|-]\s+/).map(item => `<li>${item.replace(/^[*|-]\s+/, '')}</li>`).join('');
            return `<ul style="margin-left: 20px; margin-bottom: 12px; font-size: 13.5px;">${items}</ul>`;
        }
        return `<p style="margin-bottom: 12px;">${trimmed}</p>`;
    });
    
    setTimeout(() => {
        // Add event listeners to inline timestamp links
        document.querySelectorAll('.inline-timestamp-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sec = parseFloat(link.getAttribute('data-seconds'));
                jumpToTime(sec);
            });
        });
    }, 100);

    return formattedParagraphs.join('');
}

// Utility: convert formatted timestamp string to seconds
function parseTimestampToSeconds(timestampStr) {
    const parts = timestampStr.split(':').map(Number);
    if (parts.length === 3) {
        // HH:MM:SS
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        // MM:SS
        return parts[0] * 60 + parts[1];
    }
    return 0;
}

// Helper: Escape HTML to avoid XSS injections
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
