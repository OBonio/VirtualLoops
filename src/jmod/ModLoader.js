function ModLoader() {

    this.load = function (data) {

        var raf = new Stream(data);

        var numberOfInstruments;
        var tracks;
        var tracker = "";

        raf.seek(1080);
        var id = this.readID(raf);

        var idInfo = this.getIdInfo(id);
        tracker = idInfo[0];
        id = idInfo[1];
        tracks = idInfo[2];
        numberOfInstruments = idInfo[3];

        raf.seek(0);
        var modName = this.readName(raf);

        raf.seek(20);

        var instruments = this.loadInstruments(raf, numberOfInstruments);

        var numPos = raf.read() & 0x0ff;
        var restartPos = raf.read();
        var oldPos = raf.getPos();

        raf.seek(20 + numberOfInstruments * 30 + 2);
        var patternOrder = this.loadPositions(numPos, raf);
        var numPatterns = this.getPatternCount(patternOrder);

        raf.seek(oldPos);
        raf.skip(128);

        if (id != "NOID")
            raf.skip(4);

        var patterns = this.loadPatterns(raf, numPatterns, tracks,
                numberOfInstruments, new ModUnits(Const.ModUnits.PAL, false));

        var sampleDataLength = 0;
        for (var sampleLoop = 0; sampleLoop < numberOfInstruments; sampleLoop++)
            sampleDataLength += instruments[sampleLoop].getSampleByNum(0).getLength();

        raf.seek(raf.getLength() - sampleDataLength);
        this.loadSampleData(raf, instruments);

        var r = 0.0, l = 1.0;
        // 64 channels should do...
        var panning = [
                l, r, r, l, l, r, r, l, l, r, r, l, l, r, r, l,
                l, r, r, l, l, r, r, l, l, r, r, l, l, r, r, l, l, r, r, l, l,
                r, r, l, l, r, r, l, l, r, r, l, l, r, r, l, l, r, r, l, l, r,
                r, l, l, r, r, l];
        var pann = new Array(tracks);
        for (var n = 0; n < tracks; n++)
            pann[n] = panning[n];

        return new Module(modName, id, tracker, instruments, patterns,
                patternOrder, restartPos, 125, 6, 1, Const.Module.TRACK_PANNING,
                pann); //, modUnits);
    }

    this.loadSampleData = function (raf, instruments) {
        for (var n = 0; n < instruments.length; n++) {
            var sample = instruments[n].getSampleByNum(0);
            var data = new Float32Array(sample.getLength());
            for (var m = 0; m < data.length; m++) {
                data[m] = (((raf.read() & 0x0ff) << 8) / 32768.0) - 1; //reinterpret to -1 to 1
            }
            sample.setData(data);
        }
    }

    this.loadInstruments = function (raf, numberOfInstruments) {
        var instruments = new Array();
        var samples = new Array();

        var moduleUnits = new ModUnits(Const.ModUnits.PAL, false);

        for (var n = 0; n < numberOfInstruments; n++) {
            var name = Util.readZeroPaddedString(raf, 22);
            var length = (2 * raf.readShort()) & 0x0ffff; // -> unsigned
            var fineTune = raf.read();
            if (fineTune > 7)
                fineTune = fineTune | 0x0fffffff0;
            //if nibble is singed -> extend sign
            var fTune = fineTune / 8; // [-8 - 7]
            var volume = raf.read() / 64;
            var loopStart = 2 * ((raf.readShort()) & 0x0ffff);
            // -> unsigned
            var loopLength = 2 * ((raf.readShort()) & 0x0ffff);
            // -> unsigned
            var loopType;
            if (loopLength > 2)
                loopType = Const.Sample.FORWARD;
            else
                loopType = Const.Sample.NO_LOOP;
            //		System.out.println(name + " " + n + " " + volume + " " + loopType
            // + " " + loopStart + " " + loopLength + " " + fTune + " " +
            // fineTune);
            samples[n] = new Sample(name, volume, 0.0, length, loopType,
                    loopStart, loopLength, 0.0, fTune, moduleUnits);
        }
        var noteToSample = new Int32Array(5 * 12); // 5 octaves...
        for (var n = 0; n < numberOfInstruments; n++)
            instruments[n] = new Instrument(samples[n].getName(), noteToSample,
                    [samples[n]], null, 0);
        return instruments;
    }

    this.loadPatterns = function (raf, numPatterns, numTracks, numSamples, modUnits) {
        var patterns = new Array(numPatterns);
        for (var p = 0; p < numPatterns; p++) {
            var tracks = new Array(numTracks);
            for (var n = 0; n < numTracks; n++)
                tracks[n] = new Track(64);
            for (var n = 0; n < 64; n++)
                for (var m = 0; m < numTracks; m++) {
                    var data = raf.readInt();
                    var effectNum = (data & 0x000000f00) >> 8;
                    var effectArg1 = (data & 0x0000000f0) >>> 4;
                    var effectArg2 = data & 0x00000000f;
                    var period = (data & 0x00fff0000) >> 16;
                    var note;
                    effectNum = this.translateEffectNum(effectNum, effectArg1);
                    if (period > Const.ModUnits.NEW_MAX_PERIOD)
                        period = Const.ModUnits.NEW_MAX_PERIOD;
                    else if (period > 0 && period < Const.ModUnits.NEW_MIN_PERIOD)
                        period = Const.ModUnits.NEW_MIN_PERIOD;
                    if (period != 0)
                    //just casting to var will make half the notes one note
                    // to low
                        note = Math.round(modUnits.period2note(period));
                    else
                        note = Const.Instrument.NO_NOTE;
                    var sampleNum = ((data & 0x0f0000000) >>> 24)
                            | ((data & 0x00000f000) >> 12);
                    sampleNum--;
                    if (sampleNum >= numSamples || sampleNum < 0)
                        sampleNum = Track.NO_INSTRUMENT;

                    tracks[m].initDivision(n, sampleNum, note,
                            [effectNum], [effectArg1],
                            [effectArg2]);
                }
            patterns[p] = new Pattern(tracks, 64);
        }
        return patterns;
    }

    this.getModule = function () {
        return module;
    }

    this.translateEffectNum = function (effectNum, arg1) {
        switch (effectNum) {
            case 0x00:
                return Const.Effect.MOD_ARPEGGIO;
            case 0x01:
                return Const.Effect.MOD_SLIDE_UP;
            case 0x02:
                return Const.Effect.MOD_SLIDE_DOWN;
            case 0x03:
                return Const.Effect.MOD_SLIDE_TO_NOTE;
            case 0x04:
                return Const.Effect.MOD_VIBRATO;
            case 0x05:
                return Const.Effect.MOD_SLIDE_TO_NOTE_AND_VOLUME_SLIDE;
            case 0x06:
                return Const.Effect.MOD_VIBRATO_AND_VOLUME_SLIDE;
            case 0x07:
                return Const.Effect.MOD_TREMOLO;
            case 0x08:
                return Const.Effect.MOD_PANNING;
            case 0x09:
                return Const.Effect.MOD_SET_SAMPLE_OFFSET;
            case 0x0a:
                return Const.Effect.MOD_VOLUME_SLIDE;
            case 0x0b:
                return Const.Effect.MOD_POSITION_JUMP;
            case 0x0c:
                return Const.Effect.MOD_SET_VOLUME;
            case 0x0d:
                return Const.Effect.MOD_PATTERN_BREAK;
            case 0x0e:
                switch (arg1) {
                    case 0x00:
                        return Const.Effect.MOD_EXTENDED_SET_FILTER;
                    case 0x01:
                        return Const.Effect.MOD_EXTENDED_FINE_SLIDE_UP;
                    case 0x02:
                        return Const.Effect.MOD_EXTENDED_FINE_SLIDE_DOWN;
                    case 0x03:
                        return Const.Effect.MOD_EXTENDED_SET_GLISSANDO;
                    case 0x04:
                        return Const.Effect.MOD_EXTENDED_SET_VIBRATO_WAVEFORM;
                    case 0x05:
                        return Const.Effect.MOD_EXTENDED_FINETUNE;
                    case 0x06:
                        return Const.Effect.MOD_EXTENDED_LOOP;
                    case 0x07:
                        return Const.Effect.MOD_EXTENDED_SET_TREMOLO_WAVEFORM;
                    case 0x08:
                        return Const.Effect.MOD_EXTENDED_ROUGH_PANNING;
                    case 0x09:
                        return Const.Effect.MOD_EXTENDED_RETRIGGER_SAMPLE;
                    case 0x0a:
                        return Const.Effect.MOD_EXTENDED_FINE_VOLUME_SLIDE_UP;
                    case 0x0b:
                        return Const.Effect.MOD_EXTENDED_FINE_VOLUME_SLIDE_DOWN;
                    case 0x0c:
                        return Const.Effect.MOD_EXTENDED_CUT_SAMPLE;
                    case 0x0d:
                        return Const.Effect.MOD_EXTENDED_DELAY_SAMPLE;
                    case 0x0e:
                        return Const.Effect.MOD_EXTENDED_DELAY_PATTERN;
                    case 0x0f:
                        return Const.Effect.MOD_EXTENDED_INVERT_LOOP;
                }
                break;
            case 0x0f:
                return Const.Effect.MOD_SET_SPEED;
        }
        throw "Illegal effect number: " + effectNum + ":" + arg1;
    }

    this.getIdInfo = function (id) {
        var tracker = null;
        var moduleId = id;
        var tracks = -1;
        var numberOfInstruments = -1;

        switch (id) {
            case "2CHN":
                tracker = "FastTracker 2";
                tracks = 2;
                numberOfInstruments = 31;
                break;
            case "M.K.":
            case "M!K!":
                tracker = "ProTracker";
                tracks = 4;
                numberOfInstruments = 31;
                break;
            case "N.T.":
                tracker = "NoiseTracker";
                tracks = 4;
                numberOfInstruments = 31;
            case "FLT4":
                tracker = "StarTrekker";
                tracks = 4;
                numberOfInstruments = 31;
            case "4CHN":
                tracker = "Unknown";
                tracks = 4;
                numberOfInstruments = 31;
            case "6CHN":
                tracker = "FastTracker 2";
                tracks = 6;
                numberOfInstruments = 31;
            case "8CHN":
                tracker = "FastTracker 2";
                tracks = 8;
                numberOfInstruments = 31;
            case "FLT8":
                tracker = "StarTrekker";
                tracks = 8;
                numberOfInstruments = 31;
            case "OKTA":
            case "CD81":
                tracker = "Oktalyzer";
                tracks = 8;
                numberOfInstruments = 31;
            case "OCTA":
                tracker = "Octalyzer";
                tracks = 8;
                numberOfInstruments = 31;
                break;
            default:
                if (id.endsWith("CH")) {
                    tracks = new Number(id.substring(0, 2));
                    if ((tracks & 1) == 0)
                        tracker = "FastTracker 2";
                    else
                        tracker = "TakeTracker";
                    numberOfInstruments = 31;
                } else if (id.startsWith("TDZ")) {
                    tracker = "TakeTracker";
                    tracks = new Number(id.substring(3, 1));
                    numberOfInstruments = 31;
                } else {
                    moduleId = "NOID";
                    tracker = "SoundTracker";
                    tracks = 4;
                    numberOfInstruments = 15;
                }
                break;
        }
        return [tracker, moduleId, tracks, numberOfInstruments];
    }

    this.readID = function (raf) {
        var sb = new String();
        var count = 0;
        while (count++ < 4)
            sb += String.fromCharCode(raf.read());
        return sb;
    }

    this.readName = function (raf) {
        var sb = new String();
        var count = 0;
        var data = -1;
        while (count++ < 20) {
            data = raf.read();
            if (data != 0)
                sb += String.fromCharCode(data);
            else
                sb += ' ';
        }
        raf.skip(20 - count);
        return sb.trim();
    }

    this.loadPositions = function (numPos, raf) {

        var patternOrder = new Array(numPos);
        for (var n = 0; n < numPos; n++)
            patternOrder[n] = raf.read() & 0x0ff;
        return patternOrder;
    }

    this.getPatternCount = function (positions) {
        var numPatterns = 0;
        for (var n = 0; n < positions.length; n++) {
            if (numPatterns < positions[n])
                numPatterns = positions[n];
        }
        return ++numPatterns;
    }

}
