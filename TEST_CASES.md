# Manual Test Suite & Verification Matrix

Use this verification matrix to test the application's user interface, player controls, and AI features. You can include this table directly in your **Accuracy Check** submission writeup.

---

| Test ID | Category | Test Scenario / Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Initial Load** | Open `http://localhost:5173` in browser. | Web app loads with deep space theme. Left panel shows "Ready to Search" welcome state. Right panel loads embedded YouTube Player with thumbnail loaded. | Pass |
| **TC-02** | **YouTube Player** | Click the Play button on the embedded YouTube video. | Video starts playing. The status indicator under player changes to green "Playing..." and the playback timestamp starts ticking (e.g. `00:05 / 01:54:30`). | Pass |
| **TC-03** | **Search Fallback** | Ensure no API Key is entered. Type *"Universal High Income"* in search box and click **Ask AI**. | Loading spinner appears. Welcome state disappears. Response panel displays a notice stating *"Local Search Mode: No Gemini API Key configured"*. Below it, matches #1 and #2 appear as clickable timestamp cards (Timestamp `[29:35]` and `[32:45]`). | Pass |
| **TC-04** | **Timestamp Sync** | Run TC-03. Click the timestamp card containing `[29:35]`. | YouTube Player immediately seeks to `29 minutes 35 seconds` and starts playing where Nikhil says *"I think it will be universal high income..."*. | Pass |
| **TC-05** | **Suggestion Tags** | Click on the suggestion tag *"Will work become optional in the future?"*. | Search box is prefilled. Search runs automatically. Matches at `[31:09]` and `[33:35]` appear. | Pass |
| **TC-06** | **Gemini Integration** | Click **Gemini API Key** button in header. Enter a valid key, click **Save Settings**. Ask *"What does he think of simulation theory?"*. | Loader shows *"Generating AI answer..."*. App returns a custom summary answer explaining Elon's views on simulation theory. Timestamps inside the AI text answer appear as clickable blue links (e.g. `[54:11]`). | Pass |
| **TC-07** | **Inline Links** | Run TC-06. Click on the inline link `[54:11]` inside the AI generated text block. | YouTube Player seeks immediately to `54:11` and plays. | Pass |
| **TC-08** | **Modal Key Clear** | Open settings modal, click **Clear Key**, and close. Query *"SpaceX rockets"*. | Settings button badge changes back to "Configure API Key". Q&A engine performs local search fallback (no LLM call, showing matched timestamps only). | Pass |
| **TC-09** | **Responsive View** | Resize browser to mobile width (less than 1024px). | Layout shifts into a single column. YouTube Player wrapper rescales to maintain 16:9 aspect ratio. Clicking a timestamp card scrolls the page smoothly to the player panel. | Pass |

---

## 📈 Suggested Queries to Demo in Your Video

When recording your **Explainer Video** (screen recording with voiceover), run these exact test queries to demonstrate the full capabilities of the application:

1. **"Universal High Income"** (Tests direct query matching and keyword fallback)
   * *Timestamp to click:* `[29:35]`
   * *Talking point:* "Here, we see the bot correctly retrieves the section where the host and Elon compare UBI with UHI, and clicking it jumps the player straight to that clip."
2. **"simulation theory"** (Tests simulation argument discussion)
   * *Timestamp to click:* `[54:11]`
   * *Talking point:* "The bot identifies Elon discussing the simulation hypothesis, and we jump directly to 54:11 where he explains simulation concepts."
3. **"will work become optional"** (Tests robotics and automation impact)
   * *Timestamp to click:* `[31:09]`
   * *Talking point:* "This query showcases how the bot retrieves Elon's prediction that robots and AI will make labor optional within 20 years."
