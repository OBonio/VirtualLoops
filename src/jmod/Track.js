function Track(divisions) {
    var instruments;
    var notes;
    var effects;
    var effectArg1;
    var effectArg2;

    /**
    * a constant that indicates that no new intrument shall be played in a track
    */
    instruments = new Int32Array(divisions);
    notes = new Int32Array(divisions);
    effects = new Array();
    effectArg1 = new Array();
    effectArg2 = new Array();

    /**
    * initializes a division var the track. Each division can have several 
    * effects.
    * It is unsafe to not initialize all the divisions in the track!
    * @param division the division to be initialized
    * @param instrumentNumber the number of the instrument to be played at 
    *  this division in the track (or NO_INSTRUMENT)
    * @param note the note to be played
    * @param effects the effects to be played (can be null)
    * @param effectArg1 the first argument to the effects (can be null)
    * @param effectArg2 the second argument to the effects (can be null)
    */
    this.initDivision = function (
		division,
		instrNum,
		note,
		eff,
		effArg1,
		effArg2) {
        instruments[division] = instrNum;
        notes[division] = note;
        effects[division] = eff;
        effectArg1[division] = effArg1;
        effectArg2[division] = effArg2;
    }

    /**
    * @return the number of the instrument to be played at the div'th division in 
    *  this track
    */
    this.getInstrumentNumber = function (div) {
        return instruments[div];
    }

    /**
    * @return the note to be played in the div'th division.
    */
    this.getNote = function (div) {
        return notes[div];
    }

    /**
    * @return the number of effects to be played at division div
    */
    this.getNumberOfEffects = function (div) {
        if (effects[div] != null)
            return effects[div].length;
        else
            return 0;
    }

    /**
    * @param div
    * @param n
    * @return the n'th effect at the div'th division
    */
    this.getEffect = function (div, n) {
        return effects[div][n];
    }

    /**
    * @param div
    * @param n
    * @return the 1st argument to the n'th effect at the div'th division
    */
    this.getEffectArg1 = function (div, n) {
        return effectArg1[div][n];
    }

    /**
    * @param div
    * @param n
    * @return the 2nd argument to the n'th effect at the div'th division
    */
    this.getEffectArg2 = function (div, n) {
        return effectArg2[div][n];
    }

    /**
    * @return information about the div'th division of this track in 
    *  "human readable" form :) 
    */
    this.getInfo = function (div) {
        var sb = new String();
        sb += (getNoteSymbol(div) + " ");
        sb += (getInstrumentSymbol(div) + " ");
        for (var n = 0; n < this.getNumberOfEffects(div); n++)
            sb += (getEffectSymbol(div, n) + " ");
        for (var n = this.getNumberOfEffects(div); n < 2; n++)
            sb += ("--- ");
        return sb;
    }

    /**
    * The note symbol consist of a note and a octave. The note C in the 2nd 
    * octave is represented as "C-2". The key off note is "###" and no note is "---".
    * @param div
    * @return the note symbol of the note in the div'th division
    */
    function getNoteSymbol(div) {
        var note = notes[div];
        //		if (note == Instrument.KEY_OFF)
        //			return "###";
        //		else
        if (note == Const.Instrument.NO_NOTE)
            return "---";
        var noteNum = note % 12;
        var period = Math.floor(note / 12);
        var code = null;
        switch (noteNum) {
            case 0:
                code = "C-";
                break;
            case 1:
                code = "C#";
                break;
            case 2:
                code = "D-";
                break;
            case 3:
                code = "D#";
                break;
            case 4:
                code = "E-";
                break;
            case 5:
                code = "F-";
                break;
            case 6:
                code = "F#";
                break;
            case 7:
                code = "G-";
                break;
            case 8:
                code = "G#";
                break;
            case 9:
                code = "A-";
                break;
            case 10:
                code = "A#";
                break;
            case 11:
                code = "B-";
                break;
            default:
                code = "XX";
        }
        code += period;
        return code;
    }

    /**
    * @param div
    * @return a two digit hex number representing the instrument played in the 
    *  div'th division.
    */
    function getInstrumentSymbol(div) {
        return Util.nibbleToHex(instruments[div] >> 4)
			+ Util.nibbleToHex(instruments[div]);
    }

    /**
    * @param div
    * @param n
    * @return a tree digit hex number representing the n'th effect played in the
    *  div'th division.
    */
    function getEffectSymbol(div, n) {
        return Util.nibbleToHex(effects[div][n]) +
        // Util.nibbleToHex(effects[div][n] >> 4) +  // effect > 0x0f isn't shown right...
		Util.nibbleToHex(effectArg1[div][n])
			+ Util.nibbleToHex(effectArg2[div][n]);
    }
}
