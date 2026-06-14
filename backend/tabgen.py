import librosa
import numpy as np

STRINGS = {
    "e": 64,
    "B": 59,
    "G": 55,
    "D": 50,
    "A": 45,
    "E": 40
}

def format_tabs(tabs):

    strings = {
        "e": "e|",
        "B": "B|",
        "G": "G|",
        "D": "D|",
        "A": "A|",
        "E": "E|"
    }

    for tab in tabs:

        for string_name in strings:

            if string_name == tab["string"]:
                strings[string_name] += f"-{tab['fret']}-"
            else:
                strings[string_name] += "---"

    return "\n".join([
        strings["e"],
        strings["B"],
        strings["G"],
        strings["D"],
        strings["A"],
        strings["E"]
    ])
def audio_to_notes(audio_path):

    y, sr = librosa.load(audio_path, sr=44100)

    pitches, magnitudes = librosa.piptrack(
        y=y,
        sr=sr
    )

    notes = []
    last_note = None

    onsets = librosa.onset.onset_detect(
        y=y,
        sr=sr,
        units="frames"
    )

    for t in onsets:

        if t >= pitches.shape[1]:
            continue

        index = magnitudes[:, t].argmax()

        pitch = pitches[index, t]
        magnitude = magnitudes[index, t]

        if pitch > 0 and magnitude > 0.1:

            note = librosa.hz_to_note(pitch)

            if note != last_note:
                notes.append(note)
                last_note = note

    return notes[:50]


def note_to_tab(note):

    midi = librosa.note_to_midi(note)

    possible = []

    for string, open_note in STRINGS.items():

        fret = midi - open_note

        if 0 <= fret <= 24:
            possible.append(
                {
                    "string": string,
                    "fret": int(fret)
                }
            )

    if possible:
        return min(possible, key=lambda x: x["fret"])

    return None


def generate_tabs(audio_path):

    notes = audio_to_notes(audio_path)

    tabs = []

    for note in notes:

        position = note_to_tab(note)

        if position:
            tabs.append({
                "note": note,
                **position
            })

    return format_tabs(tabs)