function LocalEffects() {

    /* -- volume control variables -- */

    var tremoloValue = 0;
    var volumeSlide;
    var volumeSlideSpeed;
    var volumeFineSlideSpeed;

    var tremoloWaveform = Const.LocalEffects.SINE_TREMELO;
    var tremoloRetrigger = true;


    /* -- panning control variables -- */

    /** Panning slide, accumulator */
    var panningSlide = 0;
    /** Panning side, speed*/
    var panningSlideSpeed;

    /* -- note control variables -- */

    var noteTune;
    var noteSlide;

    var noteSlideSmooth;

    /** Slide to note, destination note */
    var noteSlideDest;
    /** Slide to note, slide speed */
    var noteSlideToSpeed;

    var noteSlideSpeed;
    var noteFineSlideSpeed;
    var noteExtraFineSlideSpeed;

    var vibratoWaveform = Const.LocalEffects.SINE_VIBRATO;
    var vibratoRetrigger = true;

    var glissando = false;

    var retriggerInterval = 0;
    var retriggerVolumeChange = 0;

    var tremoloPeriod;
    var tremoloAmplitude;
    var tremoloTick;

    var vibratoPeriod;
    var vibratoAmplitude;
    var vibratoTick;

    this.reset = function () {
        if (vibratoRetrigger)
            vibratoTick = 0;
        if (tremoloRetrigger)
            tremoloTick = 0;

        noteTune = 0;
        noteSlide = 0;
        noteSlideSmooth = 0;
        volumeSlide = 0;
        tremoloValue = 0;
        panningSlide = 0;
    }

    this.reset();

    /**
    * do whatever needs to be done before the track is played
    * @param state
    * @param track
    * @param pattern
    * @param division
    * @param tick
    * @param effectNumber
    * @param arg1
    * @param arg2
    */
    this.preEffect = function (
		state,
		track,
		pattern,
		division,
		tick,
		effectNumber,
		arg1,
		arg2) {
        switch (effectNumber) {
            case Const.Effect.MOD_EXTENDED_DELAY_SAMPLE:
                modExtendedDelaySample(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
        }
    }

    /**
    * do the effect
    * @param state
    * @param track
    * @param pattern
    * @param division
    * @param tick
    * @param effectNumber
    * @param arg1
    * @param arg2
    */
    this.doEffect = function (
		state,
		track,
		pattern,
		division,
		tick,
		effectNumber,
		arg1,
		arg2) {
        noteTune = 0;
        tremoloValue = 0;

        switch (effectNumber) {
            case Const.Effect.MOD_ARPEGGIO:
                modArpeggio(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_SLIDE_UP:
                modSlideUp(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_SLIDE_DOWN:
                modSlideDown(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_SLIDE_TO_NOTE:
                modSlideToNote(
					state,
					track,
					pattern,
					division,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.MOD_VIBRATO:
                modVibrato(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_SLIDE_TO_NOTE_AND_VOLUME_SLIDE:
                modSlideToNote(
					state,
					track,
					pattern,
					division,
					tick,
					effectNumber,
					0,
					0);
                modVolumeSlide(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_VIBRATO_AND_VOLUME_SLIDE:
                modVibrato(state, track, tick, effectNumber, 0, 0);
                modVolumeSlide(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_TREMOLO:
                modTremolo(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_PANNING:
                modPanning(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_SET_SAMPLE_OFFSET:
                modSetSampleOffset(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.MOD_VOLUME_SLIDE:
                modVolumeSlide(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_SET_VOLUME:
                modSetVolume(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.MOD_EXTENDED_FINE_SLIDE_UP:
                modExtendedFineSlideUp(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.MOD_EXTENDED_FINE_SLIDE_DOWN:
                modExtendedFineSlideDown(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.MOD_EXTENDED_SET_GLISSANDO:
                if (arg2 == 1)
                    glissando = true;
                else if (arg2 == 0)
                    glissando = false;
                break;
            case Const.Effect.MOD_EXTENDED_SET_VIBRATO_WAVEFORM:
                modExtendedSetVibratoWaveform(arg2);
                break;
            case Const.Effect.MOD_EXTENDED_FINETUNE:
                modExtendedFineTune(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.MOD_EXTENDED_SET_TREMOLO_WAVEFORM:
                modExtendedSetTremoloWaveform(arg2);
                break;
            case Const.Effect.MOD_EXTENDED_ROUGH_PANNING:
                modExtendedRoughPanning(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.MOD_EXTENDED_RETRIGGER_SAMPLE:
                modExtendedRetriggerSample(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2,
                    pattern);
                break;
            case Const.Effect.MOD_EXTENDED_FINE_VOLUME_SLIDE_UP:
                modExtendedFineVolumeSlideUp(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.MOD_EXTENDED_FINE_VOLUME_SLIDE_DOWN:
                modExtendedFineVolumeSlideDown(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.MOD_EXTENDED_CUT_SAMPLE:
                modExtendedCutSample(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.MOD_EXTENDED_INVERT_LOOP:
                Logger.warning("Invert loop not supported!");
                break;

            case Const.Effect.XM_SLIDE_UP:
                xmSlideUp(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.XM_SLIDE_DOWN:
                xmSlideDown(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.XM_SLIDE_TO_NOTE:
                xmSlideToNote(
					state,
					track,
					pattern,
					division,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.XM_VOLUME_SLIDE:
                xmVolumeSlide(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.XM_EXTENDED_FINE_SLIDE_UP:
                xmExtendedFineSlideUp(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.XM_EXTENDED_FINE_SLIDE_DOWN:
                xmExtendedFineSlideDown(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.XM_EXTENDED_FINE_VOLUME_SLIDE_UP:
                xmExtendedFineVolumeSlideUp(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.XM_EXTENDED_FINE_VOLUME_SLIDE_DOWN:
                xmExtendedFineVolumeSlideDown(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;

            case Const.Effect.XM_SET_ENVELOPE_POSITION:
                if (tick == 0)
                    state.setEnvelopePosition(arg1 * 16 + arg2);
                break;
            case Const.Effect.XM_PANNING_SLIDE:
                xmPanningSlide(state, track, tick, effectNumber, arg1, arg2);
                break;
            case Const.Effect.XM_MULTI_RETRIGGER_NOTE:
                xmMultiRetriggerNote(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.XM_EXTRA_FINE_SLIDE_UP:
                xmExtraFineSlideUp(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;
            case Const.Effect.XM_EXTRA_FINE_SLIDE_DOWN:
                xmExtraFineSlideDown(
					state,
					track,
					tick,
					effectNumber,
					arg1,
					arg2);
                break;

            case Const.Effect.XM_KEY_OFF:
                keyOff(state, track, tick);
                break;

            case Const.Effect.S3M_TREMOR:
                s3mTremor(state, track, tick, effectNumber, arg1, arg2);
                break;

        }
    }

    /**
    * do whatever needs to be done after the tick is played
    * @param state
    * @param track
    * @param pattern
    * @param division
    * @param tick
    * @param effectNumber
    * @param arg1
    * @param arg2
    */
    this.postEffect = function (
		state,
		track,
		pattern,
		division,
		tick,
		effectNumber,
		arg1,
		arg2) {
        switch (effectNumber) {
            case Const.Effect.S3M_TREMOR:
                s3mTremorStop(state, track, tick, effectNumber, arg1, arg2);
                break;
        }
    }

    this.newNote = function (note) {
        //		if (note != Instrument.KEY_OFF)
        this.reset();
    }

    this.newInstrument = function (instrument)
    { }

    this.newNoteAndInstrument = function (note, instrument) {
        this.reset();
    }

    function modArpeggio(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (arg1 == 0 && arg2 == 0)
            return;
        tick %= 3;
        if (tick == 0); // do nothing...
        else if (tick == 1)
            noteTune = noteTune + arg1;
        else if (tick == 2)
            noteTune = noteTune + arg2;
    }

    function modSlideUp(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick > 0) {
            var mu = sample.getUnits();
            var maxNote = mu.getUpperNoteLimit();
            var minPeriod = mu.note2period(maxNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) - (arg1 * 16 + arg2);
            if (period < minPeriod)
                period = minPeriod;
            var newNote = mu.period2note(period);
            if (newNote > maxNote)
                newNote = maxNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function modSlideDown(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick > 0) {
            var mu = sample.getUnits();
            var minNote = mu.getLowerNoteLimit();
            var maxPeriod = mu.note2period(minNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) + (arg1 * 16 + arg2);
            if (period > maxPeriod)
                period = maxPeriod;
            var newNote = mu.period2note(period);
            if (newNote < minNote)
                newNote = minNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function modSlideToNote(
		state,
		track,
		pattern,
		division,
		tick,
		effectNumber,
		arg1,
		arg2) {

        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0) {
            var note =
				state.getModule().getPatternAtPos(pattern).getTrack(
					track).getNote(
					division);
            if (note != Const.Instrument.NO_NOTE/* && note != Instrument.KEY_OFF*/) {
                noteSlideDest = note;
            }
            if (arg1 * 16 + arg2 != 0)
                noteSlideToSpeed = arg1 * 16 + arg2;
        }
        else {
            var mu = sample.getUnits();
            var maxNote = mu.getUpperNoteLimit();
            var minPeriod = mu.note2period(maxNote);
            var minNote = mu.getLowerNoteLimit();
            var maxPeriod = mu.note2period(minNote);

            var newNote, note;
            newNote = note = state.getNote() + noteSlideSmooth;
            if (noteSlideDest > note) {
                var period = mu.note2period(note) - noteSlideToSpeed;
                if (period < minPeriod)
                    period = minPeriod;
                newNote = mu.period2note(period);
                if (newNote > noteSlideDest)
                    newNote = noteSlideDest;
            }
            else if (noteSlideDest < note) {
                var period = mu.note2period(note) + noteSlideToSpeed;
                if (period > maxPeriod)
                    period = maxPeriod;
                newNote = mu.period2note(period);
                if (noteSlideDest > newNote)
                    newNote = noteSlideDest;
            }
            noteSlideSmooth += newNote - note;
            if (glissando)
                noteSlide = Math.round(noteSlideSmooth);
            else
                noteSlide = noteSlideSmooth;
        }
    }

    function modVibrato(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0) {
            if (arg1 != 0)
                vibratoPeriod = arg1;
            if (arg2 != 0)
                vibratoAmplitude = arg2;
        }

        var dNote =
			getVibratoLevel(
				vibratoPeriod,
				vibratoAmplitude,
				vibratoTick,
				vibratoWaveform);
        noteTune = dNote;

        vibratoTick++;
    }

    function getVibratoLevel(
		period,
		amplitude,
		vTick,
		type) {
        var level = 0;
        switch (type) {
            case Const.LocalEffects.SINE_VIBRATO:
                // ------------------------
                //      f = arg1 * ticks / 64 [periods/division] -> 64 / (arg1 * ticks) [divisions/period] = 64 / arg1 [ticks/period] = p
                //      amp * sin(tick * 2 * pi / p) = arg2/16 * sin(tick * 2 * pi * arg1 / 64);
                // ------------------------
                level = Math.sin(vTick * 2 * 3.1416 * period / 64);
                break;
            case Const.LocalEffects.SQUARE_VIBRATO:
                level = (((16 * vTick * period / 64) % 16) < 16 / 2) ? 1 : -1;
                break;
            case Const.LocalEffects.SAWTOOTH_VIBRATO:
                var v = (16 * vTick * period / 64) % 16;
                var v2 = 1 - (v / 8.0);
                level = v2;
                break;
        }
        level *= amplitude / 16.0;
        return level;
    }


    function modTremolo(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0) {
            if (arg1 != 0)
                tremoloPeriod = arg1;
            if (arg2 != 0)
                tremoloAmplitude = arg2;
        }

        var dVolume =
			getTremoloLevel(tremoloPeriod, tremoloTick, tremoloWaveform);
        tremoloValue =
			dVolume
				* tremoloAmplitude
				* (state.getModuleState().getTicksInDivision() - 1)
				/ 64.0;

        tremoloTick++;
    }

    function getTremoloLevel(period, tTick, type) {
        var level = 0;
        switch (type) {
            case Const.LocalEffects.SINE_TREMOLO:
                level = Math.sin(tTick * 2 * 3.1416 * period / 64);
                break;
            case Const.LocalEffects.SQUARE_TREMOLO:
                level =
					(((16 * tTick * period / 64) % 16) < 16 / 2) ? 1 : -1;
                break;
            case Const.LocalEffects.SAWTOOTH_TREMOLO:
                var v = (16 * tTick * period / 64) % 16;
                var v2 = 1 - (v / 8.0);
                level = v2;
                break;
        }
        return level;
    }

    function modPanning(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0)
            state.setPanning((arg1 * 16 + arg2) / 256.0);
    }

    function modSetSampleOffset(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0)
            state.setSampleOffset(arg1 * 4096 + arg2 * 256);
    }

    function modVolumeSlide(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick > 0) {
            if (arg1 != 0)
                volumeSlide += arg1 / 64.0;
            else if (arg2 != 0)
                volumeSlide -= arg2 / 64.0;
        }
    }

    function modSetVolume(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0)
            state.setVolume((arg1 * 16 + arg2) / 64.0);
    }

    function modExtendedFineSlideUp(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0) {
            var mu = sample.getUnits();
            var maxNote = mu.getUpperNoteLimit();
            var minPeriod = mu.note2period(maxNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) - arg2;
            if (period < minPeriod)
                period = minPeriod;
            var newNote = mu.period2note(period);
            if (newNote > maxNote)
                newNote = maxNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function modExtendedFineSlideDown(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0) {
            var mu = sample.getUnits();
            var minNote = mu.getLowerNoteLimit();
            var maxPeriod = mu.note2period(minNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) + arg2;
            if (period > maxPeriod)
                period = maxPeriod;
            var newNote = mu.period2note(period);
            if (newNote < minNote)
                newNote = minNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function modExtendedFineTune(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0) {
            if ((arg2 & 8) != 0)
                arg2 |= 0x0fffffff0; // sign extend
            state.setFineTune(arg2 / 16.0);
        }
    }

    function modExtendedSetTremoloWaveform(arg2) {
        if (arg2 > 3) {
            tremoloRetrigger = true;
            arg2 -= 4;
        }
        else
            tremoloRetrigger = false;
        if (arg2 == 3)
            arg2 = (Math.random() * 3);
        tremoloWaveform = arg2;
    }

    function modExtendedSetVibratoWaveform(arg2) {
        if (arg2 > 3) {
            vibratoRetrigger = true;
            arg2 -= 4;
        }
        else
            vibratoRetrigger = false;
        if (arg2 == 3)
            arg2 = (Math.random() * 3);
        vibratoWaveform = arg2;
    }

    function modExtendedRoughPanning(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        state.setPanning(arg2 / 16.0);
    }

    function modExtendedRetriggerSample(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2,
        pattern) {
        if ((arg2 == 0 && tick == 0) || (arg2 != 0 && tick % arg2 == 0))
            state.setSampleOffset(0);
    }

    function modExtendedFineVolumeSlideUp(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0)
            volumeSlide += arg2 / 64.0;
    }

    function modExtendedFineVolumeSlideDown(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0)
            volumeSlide -= arg2 / 64.0;
    }

    function modExtendedCutSample(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick >= arg2)
            state.setVolume(0);
    }

    function modExtendedDelaySample(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0)
            state.setSampleDelay(arg2);
    }

    function xmSlideUp(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {

        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0 && !(arg1 == 0 && arg2 == 0))
            noteSlideSpeed = (arg1 * 16 + arg2) * 4;
        if (tick > 0) {
            var mu = sample.getUnits();
            var maxNote = mu.getUpperNoteLimit();
            var minPeriod = mu.note2period(maxNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) - noteSlideSpeed;
            if (period < minPeriod)
                period = minPeriod;
            var newNote = mu.period2note(period);
            if (newNote > maxNote)
                newNote = maxNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function xmSlideDown(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0 && !(arg1 == 0 && arg2 == 0))
            noteSlideSpeed = (arg1 * 16 + arg2) * 4;
        if (tick > 0) {
            var mu = sample.getUnits();
            var minNote = mu.getLowerNoteLimit();
            var maxPeriod = mu.note2period(minNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) + noteSlideSpeed;
            if (period > maxPeriod)
                period = maxPeriod;
            var newNote = mu.period2note(period);
            if (newNote < minNote)
                newNote = minNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function xmSlideToNote(
		state,
		track,
		pattern,
		division,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0) {
            var note =
				state.getModule().getPatternAtPos(pattern).getTrack(
					track).getNote(
					division);
            if (note != Const.Instrument.NO_NOTE/* && note != Instrument.KEY_OFF*/) {
                noteSlideDest = note;
            }
            if (arg1 * 16 + arg2 != 0)
                noteSlideToSpeed = arg1 * 16 + arg2;
        }
        else {
            var mu = sample.getUnits();
            var maxNote = mu.getUpperNoteLimit();
            var minPeriod = mu.note2period(maxNote);
            var minNote = mu.getLowerNoteLimit();
            var maxPeriod = mu.note2period(minNote);

            var newNote, note;
            newNote = note = state.getNote() + noteSlideSmooth;
            if (noteSlideDest > note) {
                var period = mu.note2period(note) - noteSlideToSpeed * 4;
                if (period < minPeriod)
                    period = minPeriod;
                newNote = mu.period2note(period);
                if (newNote > noteSlideDest)
                    newNote = noteSlideDest;
            }
            else if (noteSlideDest < note) {
                var period = mu.note2period(note) + noteSlideToSpeed * 4;
                if (period > maxPeriod)
                    period = maxPeriod;
                newNote = mu.period2note(period);
                if (noteSlideDest > newNote)
                    newNote = noteSlideDest;
            }
            noteSlideSmooth += newNote - note;
            if (glissando)
                noteSlide = Math.round(noteSlideSmooth);
            else
                noteSlide = noteSlideSmooth;
        }
    }

    function xmVolumeSlide(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0) {
            if (arg1 != 0)
                volumeSlideSpeed = arg1 / 64.0;
            else if (arg2 != 0)
                volumeSlideSpeed = -arg2 / 64.0;
        }
        if (tick > 0)
            volumeSlide += volumeSlideSpeed;
    }

    function xmExtendedFineSlideUp(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0) {
            if (arg2 != 0)
                noteFineSlideSpeed = arg2 * 4;

            var mu = sample.getUnits();
            var maxNote = mu.getUpperNoteLimit();
            var minPeriod = mu.note2period(maxNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) - noteFineSlideSpeed;
            if (period < minPeriod)
                period = minPeriod;
            var newNote = mu.period2note(period);
            if (newNote > maxNote)
                newNote = maxNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function xmExtendedFineSlideDown(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0) {
            if (arg2 != 0)
                noteFineSlideSpeed = arg2 * 4;

            var mu = sample.getUnits();
            var minNote = mu.getLowerNoteLimit();
            var maxPeriod = mu.note2period(minNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) + noteFineSlideSpeed;
            if (period > maxPeriod)
                period = maxPeriod;
            var newNote = mu.period2note(period);
            if (newNote < minNote)
                newNote = minNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function xmExtendedFineVolumeSlideUp(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0) {
            if (arg2 != 0)
                volumeFineSlideSpeed = arg2 / 64.0;
            volumeSlide += volumeFineSlideSpeed;
        }
    }

    function xmExtendedFineVolumeSlideDown(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0) {
            if (arg2 != 0)
                volumeFineSlideSpeed = arg2 / 64.0;
            volumeSlide -= volumeFineSlideSpeed;
        }
    }

    function xmPanningSlide(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == 0) {
            if (arg1 != 0)
                panningSlideSpeed = arg1 / 256.0;
            else if (arg2 != 0)
                panningSlideSpeed = -arg2 / 256.0;
        }
        if (tick > 0)
            panningSlide += panningSlideSpeed;
    }

    function xmMultiRetriggerNote(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {

        if (tick == 0) {
            if (arg1 != 0)
                retriggerVolumeChange = arg1;
            if (arg2 != 0)
                retriggerInterval = arg2;
        }
        // test for retriggerInterval == 0 incase retrigger is used without first 
        // being initialized 
        if (retriggerInterval != 0 && tick % retriggerInterval == 0 && tick != 0) {
            state.setSampleOffset(0);
            switch (retriggerVolumeChange) {
                case 0:
                    //			state.setVolume(0);
                    break;
                case 1:
                    state.setVolume(state.getVolume() - 1 / 64.0);
                    break;
                case 2:
                    state.setVolume(state.getVolume() - 2 / 64.0);
                    break;
                case 3:
                    state.setVolume(state.getVolume() - 4 / 64.0);
                    break;
                case 4:
                    state.setVolume(state.getVolume() - 8 / 64.0);
                    break;
                case 5:
                    state.setVolume(state.getVolume() - 16 / 64.0);
                    break;
                case 6:
                    state.setVolume(state.getVolume() * 2 / 3);
                    break;
                case 7:
                    state.setVolume(state.getVolume() * 2);
                    break;
                case 9:
                    state.setVolume(state.getVolume() + 1 / 64.0);
                    break;
                case 10:
                    state.setVolume(state.getVolume() + 2 / 64.0);
                    break;
                case 11:
                    state.setVolume(state.getVolume() + 4 / 64.0);
                    break;
                case 12:
                    state.setVolume(state.getVolume() + 8 / 64.0);
                    break;
                case 13:
                    state.setVolume(state.getVolume() + 16 / 64.0);
                    break;
                case 14:
                    state.setVolume(state.getVolume() * 3 / 2);
                    break;
                case 15:
                    state.setVolume(state.getVolume() * 2);
                    break;
            }
        }
    }

    function xmExtraFineSlideUp(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0) {
            if (arg2 != 0)
                noteExtraFineSlideSpeed = arg2;

            var mu = sample.getUnits();
            var maxNote = mu.getUpperNoteLimit();
            var minPeriod = mu.note2period(maxNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) - noteExtraFineSlideSpeed;
            if (period < minPeriod)
                period = minPeriod;
            var newNote = mu.period2note(period);
            if (newNote > maxNote)
                newNote = maxNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function xmExtraFineSlideDown(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        var sample = state.getSample();
        if (sample === null) return;

        if (tick == 0) {
            if (arg2 != 0)
                noteExtraFineSlideSpeed = arg2;

            var mu = sample.getUnits();
            var minNote = mu.getLowerNoteLimit();
            var maxPeriod = mu.note2period(minNote);

            var note = state.getNote() + noteSlideSmooth;
            if (note == Const.Instrument.NO_NOTE)
                return;
            var period = mu.note2period(note) + noteExtraFineSlideSpeed;
            if (period > maxPeriod)
                period = maxPeriod;
            var newNote = mu.period2note(period);
            if (newNote < minNote)
                newNote = minNote;
            noteSlide = noteSlideSmooth += newNote - note;
        }
    }

    function s3mTremor(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick < arg1 * 16 + arg2)
            volumeSlide -= 5; //guarantied to give silence..
    }

    function s3mTremorStop(
		state,
		track,
		tick,
		effectNumber,
		arg1,
		arg2) {
        if (tick == arg1 * 16 + arg2
			|| arg1 * 16 + arg2 >= state.getModuleState().getTicksInDivision())
            volumeSlide += 5;
    }

    this.keyOff = function (state, track, tick) {
        if (tick != 0) return;
        var instr = state.getInstrument();
        if (instr == Const.Track.NO_INSTRUMENT) return;
        var i = state.getModule().getInstrument(instr);
        var af = i.getAutoEffects();
        for (var n = 0; af != null && n < af.length; n++) {
            af[n].keyOff(track);
        }
    }
}
