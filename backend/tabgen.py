import librosa
from basic_pitch.inference import predict

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
    model_output, midi_data, note_events = predict(audio_path)

    notes = []

    for note in note_events:
        start_time = note[0]
        end_time = note[1]
        midi_pitch = int(note[2])
        confidence = float(note[3])

        if confidence < 0.5:
            continue

        note_name = librosa.midi_to_note(midi_pitch)

        notes.append({
            "note": note_name,
            "midi": midi_pitch,
            "start": start_time,
            "end": end_time,
            "confidence": confidence
        })

    notes = sorted(notes, key=lambda x: x["start"])

    return notes


def note_to_tab(note_data):
    midi = note_data["midi"]

    possible = []

    for string, open_note in STRINGS.items():
        fret = midi - open_note

        if 0 <= fret <= 24:
            possible.append({
                "string": string,
                "fret": int(fret)
            })

    if possible:
        return min(possible, key=lambda x: x["fret"])

    return None


def generate_tabs(audio_path):
    notes = audio_to_notes(audio_path)

    tabs = []

    for note_data in notes:
        position = note_to_tab(note_data)

        if position:
            tabs.append({
                "note": note_data["note"],
                "start": note_data["start"],
                "confidence": note_data["confidence"],
                **position
            })

    return format_tabs(tabs)