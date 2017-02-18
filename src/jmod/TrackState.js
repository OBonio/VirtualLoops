function TrackState(ms,
		mod,
		mix,
		trackNo) {
    var moduleState = ms;
    var module = mod;
    var mixer = mix;
    var effects = new LocalEffects();
    var trackNumber = trackNo;

    // changed by track and effects:
    var volume;
    var panning = module.getInitialPanning(trackNumber);
    var note = Const.Instrument.NO_NOTE;
    var relativeNote;
    var fineTune;
    var instrument = Const.Track.NO_INSTRUMENT;
    var sampleOffset;
    var sample;
    var loopType, loopStart, loopLength;
    var sampleDelay = 0;

    // changed by autoEffects:
    var envelopeVolume = 1;
    var fadeoutVolume = 1;
    var envelopePanning = 0.5;

    var autoEffects;

    /**
    * the effects may need to do some stuff before a tick is played
    * @param pattern the current pattern position
    * @param division the current division
    * @param tick the current tick
    */
    this.preEffect = function (pattern, division, tick) {
        var track = module.getPatternAtPos(pattern).getTrack(trackNumber);
        for (var m = 0; m < track.getNumberOfEffects(division); m++) {
            var effNum = track.getEffect(division, m);
            var arg1 = track.getEffectArg1(division, m);
            var arg2 = track.getEffectArg2(division, m);
            effects.preEffect(
				this,
				trackNumber,
				pattern,
				division,
				tick,
				effNum,
				arg1,
				arg2);
        }
    }

    /**
    * do the effects
    * @param pattern current 
    * @param division
    * @param tick
    */
    this.doEffects = function (pattern, division, tick) {
        var track = module.getPatternAtPos(pattern).getTrack(trackNumber);
        for (var m = 0; m < track.getNumberOfEffects(division); m++) {
            var effNum = track.getEffect(division, m);
            var arg1 = track.getEffectArg1(division, m);
            var arg2 = track.getEffectArg2(division, m);
            effects.doEffect(
				this,
				trackNumber,
				pattern,
				division,
				tick,
				effNum,
				arg1,
				arg2);
        }

        envelopeVolume = 1;
        fadeoutVolume = 1;
        envelopePanning = 0.5;

        for (var n = 0; autoEffects != null && n < autoEffects.length; n++) {
            autoEffects[n].doEffect(this, trackNumber);
        }
    }

    /**
    * Initialize the mixer for playing this track
    * volume formula used: 
    * volume = (trackVolume + volumeSlide + volumeTune) * 
    *  envelopeVolume * fadeoutVolume
    * panning formula used:
    * p = panning + effects.panningSlide
    * panning = p + min(p,1-p) * (envelopePanning - 0.5) * 2
    * the rate is calculated in a format specific way using:
    * note + fineTune + relativeNote + noteTune + noteSlide
    * @param pattern
    * @param division
    * @param tick
    * @param time
    */
    this.setupMixer = function (pattern, division, tick, time) {
        var rate = sample != null ?
            sample.getUnits().note2rate(
        //module.getModuleUnits().note2rate(
				note
					+ fineTune
					+ relativeNote
					+ effects.noteTune
					+ effects.noteSlide) : 0;
        var vol =
			(volume + effects.volumeSlide + effects.tremoloValue)
				* envelopeVolume
				* fadeoutVolume;

        if (vol < 0)
            vol = 0;
        else if (vol > 1)
            vol = 1;
        var pan = panning + effects.panningSlide;
        pan = pan + Math.min(pan, 1 - pan) * (envelopePanning - 0.5) * 2;
        if (pan < 0)
            pan = 0;
        else if (pan > 1)
            pan = 1;

        mixer.setTrack(
			sample != null ? sample.getData() : null, //sampleData,
			sampleOffset,
			rate,
			vol,
			pan,
			loopType,
			loopStart,
			loopLength,
			trackNumber);

        sampleOffset += time * rate / 1000;
    }

    /**
    * the effects may need to do some stuff after a tick is played
    * @param pattern
    * @param division
    * @param tick
    */
    this.postEffects = function (pattern, division, tick) {
        var track = module.getPatternAtPos(pattern).getTrack(trackNumber);
        for (var m = 0; m < track.getNumberOfEffects(division); m++) {
            var effNum = track.getEffect(division, m);
            var arg1 = track.getEffectArg1(division, m);
            var arg2 = track.getEffectArg2(division, m);
            effects.postEffect(
				this,
				trackNumber,
				pattern,
				division,
				tick,
				effNum,
				arg1,
				arg2);
        }
    }

    /**
    * @return the modulestate associated with this trackstate 
    */
    this.getModuleState = function () {
        return moduleState;
    }

    /**
    * @return the module played
    */
    this.getModule = function () {
        return module;
    }

    /**
    * sets the volume of this track
    * @param vol new volume
    */
    this.setVolume = function (vol) {
        volume = vol;
    }

    /**
    * @return the volume of this track
    */
    this.getVolume = function () {
        return volume;
    }

    /**
    * sets the panning used by this track
    * @param pan the new panning
    */
    this.setPanning = function (pan) {
        panning = pan;
    }

    /**
    * sets the finetune
    * @param tune
    */
    this.setFineTune = function (tune) {
        fineTune = tune;
    }
    /**
    * sets the current position in the sample playing in this track
    * @param offset
    */
    this.setSampleOffset = function (offset) {
        sampleOffset = offset;
    }

    /**
    * sets the delay of the sample playing in this track
    * @param delay
    */
    this.setSampleDelay = function (delay) {
        sampleDelay = delay;
    }

    /**
    * sets the current position in any volume/panning envelope for the instrument 
    * playing in this track
    * @param pos
    */
    this.setEnvelopePosition = function (pos) {
        for (var n = 0; autoEffects != null && n < autoEffects.length; n++)
            if (autoEffects[n] instanceof Envelope)
                (autoEffects[n]).setPosition(pos, trackNumber);

    }

    /**
    * @return the note playing in this track
    */
    this.getNote = function () {
        return note;
    }

    /**
    * sets the envelope panning for this track
    * @param envPan
    */
    this.setEnvelopePanning = function (envPan) {
        envelopePanning = envPan;
    }

    /**
    * sets the envelope volume for this track 
    * @param envVol
    */
    this.setEnvelopeVolume = function (envVol) {
        envelopeVolume = envVol;
    }

    /**
    * 
    * @param fadeVol
    */
    this.setFadeoutVolume = function (fadeVol) {
        fadeoutVolume = fadeVol;
    }

    /**
    * tests if the note in this pattern position and division isn't realy a note
    * but an argument to an effect.
    * @param pattern
    * @param division
    * @param trackNumber
    * @return true if the note value should be seen as an argument to an effect
    */
    this.noteIsArgument = function (pattern, division, trackNumber) {
        var track = module.getPatternAtPos(pattern).getTrack(trackNumber);
        for (var n = 0; n < track.getNumberOfEffects(division); n++) {
            var effect = track.getEffect(division, n);
            if (effect == Const.Effect.MOD_SLIDE_TO_NOTE
				|| effect == Const.Effect.XM_SLIDE_TO_NOTE)
                return true;
        }
        return false;
    }

    /**
    * @param pattern the pattern position
    * @param division
    * @param trackNumber
    * @return the note played in the given position/division
    */
    function getNote(pattern, division, trackNumber) {
        var track = module.getPatternAtPos(pattern).getTrack(trackNumber);
        var tmpNote = track.getNote(division);
        return tmpNote;
    }

    /**
    * @param pattern the pattern position
    * @param division
    * @param trackNumber
    * @return the instrument played in the given position/division
    */
    function getInstrument(pattern, division, trackNumber) {
        var track = module.getPatternAtPos(pattern).getTrack(trackNumber);
        var tmpInstrument = track.getInstrumentNumber(division);
        return tmpInstrument;
    }

    /**
    * returns the sample played by the given instrument for the given note.
    * May return null if the instrument is undefined or the instrument does 
    * not define a sample for the given note. 
    * @param instrument
    * @param note
    * @return the sample played by the given instrument for the given note
    */
    function getSample(instrument, note) {
        var instr = module.getInstrument(instrument);
        var sample = null;
        if (instr != null)
            sample = instr.getSampleByNote(note);
        return sample;
    }

    /** 
    * What should happen if new note and instrument:
    * set note
    * set instrument
    * reload sampleData
    * reset sampleOffset
    * reset volume
    * reset panning
    * reload autoeffects
    * reset autoeffects
    * reset loop
    * reset keyOff
    */
    this.newNoteAndInstrument = function (newNote, newInstrument) {
        effects.newNoteAndInstrument(newNote, newInstrument);
        /*		if (newNote != Instrument.KEY_OFF) */
        note = newNote;
        instrument = newInstrument;
        var localSample = getSample(instrument, note);
        if (localSample != null) {
            fineTune = localSample.getFineTune();
            relativeNote = localSample.getRelativeNote();
            sample = localSample;
            volume = sample.getVolume();
            if (module.getPanningType() == Const.Module.SAMPLE_PANNING)
                panning = sample.getPanning();
            else if (module.getPanningType() == Const.Module.TRACK_PANNING)
                panning = module.getInitialPanning(trackNumber);
            else if (module.getPanningType() == Const.Module.INSTRUMENT_PANNING)
                panning = module.getInstrument(instrument).getPanning();
            loopType = sample.getLoopType();
            loopStart = sample.getLoopStart();
            loopLength = sample.getLoopLength();
        }
        else {
            fineTune = 0;
            relativeNote = 0;
            sample = null;
            volume = 1;
            panning = 0.5;
        }
        sampleOffset = 0;

        var instr = module.getInstrument(instrument);
        if (instr != null)
            autoEffects = instr.getAutoEffects();

        for (var n = 0; autoEffects != null && n < autoEffects.length; n++) {
            autoEffects[n].reset(trackNumber);
            autoEffects[n].newNote(newNote, trackNumber);
        }
    }

    /**
    * What should happen if new note, but keep instrument:
    * set note
    * keep instrument
    * reload sampleData
    * reset sampleOffset
    * keep volume
    * keep panning
    * reset autoeffects
    * reset loop
    * reset keyOff
    */
    function newNote(newNote) {
        effects.newNote(newNote);

        for (var n = 0; autoEffects != null && n < autoEffects.length; n++)
            autoEffects[n].newNote(newNote, trackNumber);

        note = newNote;

        var localSample = getSample(instrument, note);

        if (localSample != null) {
            fineTune = localSample.getFineTune();
            relativeNote = localSample.getRelativeNote();
            sample = localSample; //sampleData = sample.getData();
            loopType = sample.getLoopType();
            loopStart = sample.getLoopStart();
            loopLength = sample.getLoopLength();
        }
        else {
            fineTune = 0;
            relativeNote = 0;
            sample = null;
        }
        sampleOffset = 0;
    }


    /**
    * What should happen if keep note, but new instrument:
    * keep note
    * set instrument
    * reload sampleData
    * reset sampleOffset
    * reset volume
    * reset panning
    * reload autoeffects
    * reset autoeffects
    * reset loop
    * reset keyOff
    */
    this.newInstrument = function(newInstrument) {

        volume = 1;
        panning = 0.5;

        return;
        /*        effects.newInstrument(newInstrument);
        instrument = newInstrument;
        Sample sample = getSample(instrument, note);
        if (sample != null)
        {
        //			this.sample = sample;
        volume = sample.getVolume();
        if (module.getPanningType() == Const.Module.SAMPLE_PANNING)
        panning = sample.getPanning();
        else if (module.getPanningType() == Const.Module.TRACK_PANNING)
        panning = module.getInitialPanning(trackNumber);
        else if (module.getPanningType() == Const.Module.INSTRUMENT_PANNING)
        panning = module.getInstrument(instrument).getPanning();
        //			loopType = sample.getLoopType();
        //			loopStart = sample.getLoopStart();
        //			loopLength = sample.getLoopLength();
        }
        else
        {
        volume = 1;
        panning = 0.5;
        }
        sampleOffset = 0;
        
        var instr = module.getInstrument(newInstrument);
        if (instr != null)
        autoEffects = instr.getAutoEffects();
        
        for (var n = 0; autoEffects != null && n < autoEffects.length; n++)
        autoEffects[n].reset(trackNumber);
        */
    }

    this.getSample = function () {
        return sample;
    }

    this.getInstrument = function () {
        return instrument;
    }

    /**
    * load new intruments, notes and autoeffects, and do whatever needs to be 
    * done to volume and panning 
    * @param pattern
    * @param division
    * @param tick
    */
    this.loadTick = function (pattern, division, tick) {

        if (tick == sampleDelay) {
            sampleDelay = 0;

            var newNote = getNote(pattern, division, trackNumber);
            var newInstrument = getInstrument(pattern, division, trackNumber);
            if (newNote != Const.Instrument.NO_NOTE
				&& !this.noteIsArgument(pattern, division, trackNumber)
				&& newInstrument != Const.Track.NO_INSTRUMENT)
                this.newNoteAndInstrument(newNote, newInstrument);
            else if (
				newNote != Const.Instrument.NO_NOTE
				&& !this.noteIsArgument(pattern, division, trackNumber)
				&& newInstrument == Const.Track.NO_INSTRUMENT)
                this.newNote(newNote);
            else if (
				(newNote == Const.Instrument.NO_NOTE
					|| this.noteIsArgument(pattern, division, trackNumber))
					&& newInstrument != Const.Track.NO_INSTRUMENT)
                this.newInstrument(newInstrument);
        }
    }
}
