import os
import json
from youtube_transcript_api import YouTubeTranscriptApi

def format_timestamp(seconds):
    """Formats seconds into HH:MM:SS or MM:SS."""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

def get_and_chunk_transcript(video_id, output_path):
    print(f"Fetching transcript for YouTube video: {video_id}...")
    try:
        # Fetch the transcript using instantiated API
        api = YouTubeTranscriptApi()
        raw_transcript_objects = api.fetch(video_id)
        
        # Convert objects to dictionaries
        raw_transcript = []
        for item in raw_transcript_objects:
            raw_transcript.append({
                'text': item.text,
                'start': item.start,
                'duration': item.duration
            })
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        print("Please check if the video has subtitles enabled or if your internet is working.")
        return False

    print("Successfully fetched raw transcript. Formatting and chunking...")
    
    chunks = []
    current_chunk = []
    chunk_start = 0.0
    chunk_duration = 0.0
    
    # We aim for chunks of about 50 seconds or until sentence boundary after 40 seconds
    target_duration = 50.0
    
    for i, item in enumerate(raw_transcript):
        text = item['text'].replace('\n', ' ').strip()
        start = item['start']
        duration = item['duration']
        
        if not current_chunk:
            chunk_start = start
            
        current_chunk.append(text)
        chunk_duration = (start + duration) - chunk_start
        
        # Check if we should end the chunk
        # End criteria: reaches target duration, or ends with punctuation and is reasonably long
        ends_with_sentence = text.endswith('.') or text.endswith('?') or text.endswith('!')
        
        should_split = False
        if chunk_duration >= target_duration:
            should_split = True
        elif chunk_duration >= 30.0 and ends_with_sentence:
            should_split = True
            
        # Or if it's the last item
        if i == len(raw_transcript) - 1:
            should_split = True
            
        if should_split and current_chunk:
            chunk_text = " ".join(current_chunk)
            # Format timestamp
            timestamp_str = format_timestamp(chunk_start)
            
            chunks.append({
                "id": len(chunks) + 1,
                "text": chunk_text,
                "start": chunk_start,
                "duration": chunk_duration,
                "timestamp": timestamp_str
            })
            current_chunk = []
            chunk_duration = 0.0
            
    print(f"Created {len(chunks)} chunks from transcript.")
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save to JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(chunks, f, indent=2, ensure_ascii=False)
        
    print(f"Saved transcript chunks to: {output_path}")
    return True

if __name__ == "__main__":
    VIDEO_ID = "Rni7Fz7208c"
    # Save it to the public directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    output_file = os.path.join(project_root, "public", "transcript.json")
    
    get_and_chunk_transcript(VIDEO_ID, output_file)
