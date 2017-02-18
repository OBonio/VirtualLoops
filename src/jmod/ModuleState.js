function ModuleState(mod, mix) {
    var module = mod;
    var mixer = mix;

    // global effects are effects that affects the way patterns are played (not
    // just single tracks) Examples are loops, jump to pattern, global volume,
    // global panning, aso...
    var effects;
    var trackStates;

    var bpm;
    var position, division, tick;
    var positionsInModule, divisionsInPattern, ticksInDivision;

    var patternDelay;

    position = 0;
    division = 0;
    tick = 0;

    patternDelay = 0;

    effects = new GlobalEffects();

    bpm = module.getInitialBpm();
    ticksInDivision = module.getInitialSpeed();
    divisionsInPattern = module.getPatternAtPos(0).getDivisions();
    positionsInModule = module.getNumberOfPositions();

    trackStates = new Array(module.getPatternAtPos(0).getTrackCount());
    for (var n = 0; n < trackStates.length; n++)
        trackStates[n] = new TrackState(this, module, mixer, n);

    // initialize the auto effects
    var instruments = module.getInstruments();
    for (var n = 0; n < instruments.length; n++)
        if (instruments[n] != null && instruments[n].getNumberOfAutoEffects() > 0)
            for (var m = 0; m < instruments[n].getNumberOfAutoEffects(); m++)
                instruments[n].getAutoEffects()[m].setNumberOfTracks(trackStates.length);

    /**
    * play one "tick" of the module. (A tick is the smallest time interval
    * used by modules. The speed value if actually the number of ticks per
    * division, and the number of divisions played per minute is:
    * div_per_min = 24 * BPM / speed.) The state of the module is only changed
    * by effects between ticks.
    * @return true if still playing, false if end is reached
    */
    this.play = function () {
        // first let the global effects do anything that must be done before
        // the tick is played
        for (var n = 0; n < trackStates.length; n++) {
            var track = module.getPatternAtPos(position).getTrack(n);
            for (var m = 0; m < track.getNumberOfEffects(division); m++) {
                var effNum = track.getEffect(division, m);
                var arg1 = track.getEffectArg1(division, m);
                var arg2 = track.getEffectArg2(division, m);
                effects.preEffect(
                    this,
                    n,
                    position,
                    division,
                    tick,
                    effNum,
                    arg1,
                    arg2);
            }
        }

        // let the local effects do anything that must be done before the
        // tick is played
        for (var n = 0; n < trackStates.length; n++)
            trackStates[n].preEffect(position, division, tick);

        // do the tick! load new instruments, notes and autoeffects, do what
        // is needed with volume and panning
        for (var n = 0; n < trackStates.length; n++)
            trackStates[n].loadTick(position, division, tick);

        // do the global effects
        for (var n = 0; n < trackStates.length; n++) {
            var track = module.getPatternAtPos(position).getTrack(n);
            for (var m = 0; m < track.getNumberOfEffects(division); m++) {
                var effNum = track.getEffect(division, m);
                var arg1 = track.getEffectArg1(division, m);
                var arg2 = track.getEffectArg2(division, m);
                effects.doEffect(
                    this,
                    n,
                    position,
                    division,
                    tick,
                    effNum,
                    arg1,
                    arg2);
            }
        }

        // do the local effects
        for (var n = 0; n < trackStates.length; n++)
            trackStates[n].doEffects(position, division, tick);


        // play the tick
        var time = this.getTickLength(ticksInDivision, bpm);
        for (var n = 0; n < trackStates.length; n++)
            trackStates[n].setupMixer(position, division, tick, time);

        mixer.play(time);

        // let global effects do anything that needs to be done after the tick
        for (var n = 0; n < trackStates.length; n++)
            trackStates[n].postEffects(position, division, tick);

        // let local effects to anyting that needs to be done after the tick
        for (var n = 0; n < trackStates.length; n++) {
            var track = module.getPatternAtPos(position).getTrack(n);
            for (var m = 0; m < track.getNumberOfEffects(division); m++) {
                var effNum = track.getEffect(division, m);
                var arg1 = track.getEffectArg1(division, m);
                var arg2 = track.getEffectArg2(division, m);
                effects.postEffect(
                    this,
                    n,
                    position,
                    division,
                    tick,
                    effNum,
                    arg1,
                    arg2);
            }
        }

        // we might need to play the same tick over again, depending on the pattern
        // delay effect...
        if (tick == ticksInDivision - 1 && patternDelay > 0) {
            patternDelay--;
            return true;
        }
        else
            return this.nextTick();
    }

    /**
    * calculates the length of a tick in milliseconds
    * @param speed the speed (ticks per division)
    * @param bpm beats per minute
    * @return the length of a tick in milliseconds
    */
    this.getTickLength = function (speed, bpm) {
        var dpm = 24.0 * bpm / speed;
        var dps = dpm / 60.0;
        var tl = (1000 / (dps * speed));
        return tl;
    }

    /**
    * go to the next tick in the module.
    * @return true if the module is stil playing, false if the end is reached
    */
    this.nextTick = function () {
        if ((++tick % ticksInDivision) == 0) {
            tick = 0;
            // in case the next pattern has a different number of divisions
            divisionsInPattern = module.getPatternAtPos(position).getDivisions();
            if ((++division % divisionsInPattern) == 0) {
                division = 0;
                if ((++position % positionsInModule) == 0)
                    return false;
            }
        }
        return true;
    }

    /**
    * @return the playing module
    */
    this.getModule = function () {
        return module;
    }

    /**
    * @return the mixer used
    */
    this.getMixer = function () {
        return mixer;
    }

    /**
    * @return the current position
    */
    this.getPosition = function () {
        return position;
    }

    /**
    * @return the number of pattern positions in the module (Not the number
    * of patterns since each pattern may be played several times)
    */
    this.getPatternsInModule = function () {
        return positionsInModule;
    }

    /**
    * @return the number of divisions in the current pattern (often 64)
    */
    this.getDivisionsInPattern = function () {
        return divisionsInPattern;
    }

    /**
    * @return the number of ticks in a division (a.k.a speed)
    */
    this.getTicksInDivision = function () {
        return ticksInDivision;
    }

    /**
    * @return the currently playing tick in the currently playing division
    */
    this.getTick = function () {
        return tick;
    }

    /**
    * @return the currently playing division
    */
    this.getDivision = function () {
        return division;
    }

    /**
    * Changes the currently playing pattern to the pattern at the given
    * position
    * @param position the position to play
    */
    this.setPosition = function (position) {
        this.position = position;
    }

    /**
    * sets the speed (a.k.a ticksInDivision)
    * @param speed new speed of module
    */
    this.setSpeed = function (speed) {
        ticksInDivision = speed;
    }

    /**
    * sets the beats per minute
    * @param bpm beats per minute
    */
    this.setBpm = function (bpm) {
        this.bpm = bpm;
    }

    /**
    * jump to the given module position
    * @param position the pattern position to jump to
    * @param division the division to jump to
    * @param tick the tick to jump to
    */
    this.jump = function (pos, div, t) {
        if (posn < 0)
            pos = 0;
        if (pos >= positionsInModule)
            pos = positionsInModule - 1;
        position = pos;
        if (div < 0)
            div = 0;
        if (div >= divisionsInPattern)
            div = divisionsInPattern - 1;
        division = div;
        if (t < 0)
            t = 0;
        if (t >= ticksInDivision)
            t = ticksInDivision - 1;
        tick = t;
    }

    /**
    * causes the current division to be played <code>delay</code> times. Any notes, or effects
    * started in this division should not be reset each time the division is played
    * @param delay the times to play the current division
    */
    this.setPatternDelay = function (delay) {
        patternDelay = delay * ticksInDivision;
    }
}
