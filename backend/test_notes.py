from tabgen import audio_to_notes
import librosa

notes = audio_to_notes(
"separated/htdemucs/the_mountain-guitar-guitar-music-508022/other.wav"
)

print(notes)
