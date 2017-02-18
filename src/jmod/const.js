var Const = {};
Const.Effect = {};
Const.Effect.NO_EFFECT = -1;
Const.Effect.MOD_ARPEGGIO = 0; /* L */
Const.Effect.MOD_SLIDE_UP = 1; /* L */
Const.Effect.MOD_SLIDE_DOWN = 2; /* L */
Const.Effect.MOD_SLIDE_TO_NOTE = 3; /* L */
Const.Effect.MOD_VIBRATO = 4; /* L */
Const.Effect.MOD_SLIDE_TO_NOTE_AND_VOLUME_SLIDE = 5; /* L */
Const.Effect.MOD_VIBRATO_AND_VOLUME_SLIDE = 6; /* L */
Const.Effect.MOD_TREMOLO = 7; /* L */
Const.Effect.MOD_PANNING = 8; /* L */
Const.Effect.MOD_SET_SAMPLE_OFFSET = 9; /* L */
Const.Effect.MOD_VOLUME_SLIDE = 10; /* L */
Const.Effect.MOD_POSITION_JUMP = 11; /* G */
Const.Effect.MOD_SET_VOLUME = 12; /* L */
Const.Effect.MOD_PATTERN_BREAK = 13; /* G */
Const.Effect.MOD_SET_SPEED = 15; /* G */
Const.Effect.MOD_EXTENDED_SET_FILTER = 16; /* L */
Const.Effect.MOD_EXTENDED_FINE_SLIDE_UP = 17; /* L */
Const.Effect.MOD_EXTENDED_FINE_SLIDE_DOWN = 18; /* L */
Const.Effect.MOD_EXTENDED_SET_GLISSANDO = 19; /* L */
Const.Effect.MOD_EXTENDED_SET_VIBRATO_WAVEFORM = 20; /* L */
Const.Effect.MOD_EXTENDED_FINETUNE = 21; /* L */
Const.Effect.MOD_EXTENDED_LOOP = 22; /* G */
Const.Effect.MOD_EXTENDED_SET_TREMOLO_WAVEFORM = 23; /* L */
Const.Effect.MOD_EXTENDED_ROUGH_PANNING = 24; /* L */
Const.Effect.MOD_EXTENDED_RETRIGGER_SAMPLE = 25; /* L */
Const.Effect.MOD_EXTENDED_FINE_VOLUME_SLIDE_UP = 26; /* L */
Const.Effect.MOD_EXTENDED_FINE_VOLUME_SLIDE_DOWN = 27; /* L */
Const.Effect.MOD_EXTENDED_CUT_SAMPLE = 28; /* L */
Const.Effect.MOD_EXTENDED_DELAY_SAMPLE = 29; /* L */
Const.Effect.MOD_EXTENDED_DELAY_PATTERN = 30; /* G */
Const.Effect.MOD_EXTENDED_INVERT_LOOP = 31; /* L */

Const.Effect.XM_SLIDE_UP = 40; /* L */
Const.Effect.XM_SLIDE_DOWN = 41; /* L */
Const.Effect.XM_SLIDE_TO_NOTE = 42;  /* L */
Const.Effect.XM_VOLUME_SLIDE = 43; /* L */
Const.Effect.XM_EXTENDED_FINE_SLIDE_UP = 44; /* L */
Const.Effect.XM_EXTENDED_FINE_SLIDE_DOWN = 45; /* L */
Const.Effect.XM_EXTENDED_FINE_VOLUME_SLIDE_UP = 46; /* L */
Const.Effect.XM_EXTENDED_FINE_VOLUME_SLIDE_DOWN = 47; /* L */

Const.Effect.XM_SET_GLOBAL_VOLUME = 48; /* G */
Const.Effect.XM_GLOBAL_VOLUME_SLIDE = 49; /* G */
Const.Effect.XM_KEY_OFF = 50; /* L */
Const.Effect.XM_SET_ENVELOPE_POSITION = 51; /* L */
Const.Effect.XM_PANNING_SLIDE = 52; /* L */
Const.Effect.XM_MULTI_RETRIGGER_NOTE = 53; /* L */
Const.Effect.XM_W = 54; /* L */
Const.Effect.XM_EXTRA_FINE_SLIDE_UP = 55; /* L */
Const.Effect.XM_EXTRA_FINE_SLIDE_DOWN = 56; /* L */

Const.Effect.S3M_TREMOR = 60;

Const.ModUnits = {};
Const.ModUnits.TRADITIONAL_MAX_PERIOD = 856;
Const.ModUnits.TRADITIONAL_MIN_PERIOD = 113;
Const.ModUnits.NEW_MAX_PERIOD = 1712;
Const.ModUnits.NEW_MIN_PERIOD = 57;
Const.ModUnits.PAL = 7093789.2;
Const.ModUnits.NTSC = 7159090.5;

Const.Sample = {};
Const.Sample.NO_LOOP = 0;
Const.Sample.FORWARD = 1;
Const.Sample.PING_PONG = 2;

Const.Module = {};
Const.Module.TRACK_PANNING = 1;
Const.Module.SAMPLE_PANNING = 2;
Const.Module.INSTRUMENT_PANNING = 3;

Const.Instrument = {};
Const.Instrument.NO_NOTE = -2;

Const.Track = {};
Const.Track.NO_INSTRUMENT = -1;

Const.LocalEffects = {};
Const.LocalEffects.SINE_TREMOLO = 0;
Const.LocalEffects.SAWTOOTH_TREMOLO = 1;
Const.LocalEffects.SQUARE_TREMOLO = 2;
Const.LocalEffects.SINE_VIBRATO = 0;
Const.LocalEffects.SAWTOOTH_VIBRATO = 1;
Const.LocalEffects.SQUARE_VIBRATO = 2;

Const.DefaultMixer = {};
Const.DefaultMixer.Track = {};
Const.DefaultMixer.Track.LEFT = 1;
Const.DefaultMixer.Track.RIGHT = 2;
Const.DefaultMixer.Track.MONO = 3;
