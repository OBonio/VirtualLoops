function DefaultMixer(pOutput, pLowLevelMixerClass, pNumberOfTracks) {

    // buffers for storing mixed sound. Must be big enough to hold one tick.
    // I assume that no ticks are longer than 1 sec...
    var mixerBufferLeft = new Float32Array(44100),
        mixerBufferRight = new Float32Array(44100),
        mixedData = new Float32Array(44100 * 4 * 2),
        output,
        lowLevelMixerClass,
        numberOfTracks,
        amplification = 1,
        volume = 1,
        balance = 0.5,
        separation = 1,
        tracks,
        TBL = 256,
        tmpBuffer = new Array(TBL),
        tmpBufferStart = 0,
        tmpBufferEnd = 0;

    /**
     * @param output the output plugin used by this mixer
     * @param lowLevelMixerClass class who implements the LowLevelMixer interface
     * @param numberOfTracks the number of tracks this mixer should be able to mix
     */
    lowLevelMixerClass = pLowLevelMixerClass;
    output = pOutput;
    numberOfTracks = pNumberOfTracks;
    tracks = new Array(numberOfTracks);
    for (var n = 0; n < numberOfTracks; n++) {
        tracks[n] = new Track(mixerBufferLeft, mixerBufferRight, null, null, null, null, null, null, null);
    }

    this.setTrack = function (sampleData, offset, rate, volume,
            panning, loopType, loopStart, looplength, track) {
        try {
            if (tracks[track] === null)
                tracks[track] = new Track(null, null, lowLevelMixerClass,
                    sampleData, offset, rate, volume, panning, loopType, loopStart, looplength);
            else
                tracks[track].init(lowLevelMixerClass,
                    sampleData, offset, rate, volume, panning, loopType, loopStart, looplength);
        } catch (err) {
            throw "Could not initialize track " + track + " - " + err;
        }
    }

    this.getNumberOfTracks = function() {
        return numberOfTracks;
    }

    this.setAmplification = function(amp) {
        this.amplification = amp;
    }

    this.getAmplification = function() {
        return amplification;
    }

    this.setVolume = function(volume) {
        if (volume > 1)
            volume = 1;
        else if (volume < 0)
            volume = 0;
        this.volume = volume;
    }

    this.getVolume = function() {
        return volume;
    }

    this.setBalance = function(balance) {
        this.balance = balance;
    }

    this.getBalance = function() {
        return balance;
    }

    this.setSeparation = function(separation) {
        this.separation = separation;
    }

    this.getSeparation = function() {
        return separation;
    }

    this.setMute = function(track, mute) {
        if (tracks[track] != null)
            tracks[track].setMute(mute);
    }

    this.isMute = function(track) {
        return tracks[track].isMute();
    }

    this.play = function (millisecs) {
        try {
            // always 44100Hz, 16 bits, stereo...
            var len = ((millisecs * 44100) / 1000) * (16 / 8) * 2;
            mix(mixedData, len);
            //for(var dataLoop=0; dataLoop<mixedData.length;dataLoop++)
            //    alert(mixedData[dataLoop]);
            output.mozSetup(2, 44100);
            output.mozWriteAudio(mixedData);
        } catch (err) {
            throw "Could not play mixed data" + err;
        }
    }

    /**
     * mix 16 bit stereo sound into the given array. The entire array is filled
     * with data.
     *
     * @param data
     */
    function mix(data, len) {
        var length = Math.floor(len / 4),
            mulL, mulR,
            rval, lval,
            irval, ilval;

        for (var n = 0; n < numberOfTracks; n++)
            if (tracks[n] != null) {
                tracks[n].mix(length, Const.Track.LEFT);
                tracks[n].mix(length, Const.Track.RIGHT);
            }
        mulR = mulL = amplification * volume / numberOfTracks;
        if (balance < 0.5)
            mulR *= 2 * balance;
        else if (balance > 0.5)
            mulL *= 2 * (1 - balance);

        for (var n = 0, m = 0; n < len; n += 4, m++) {
            rval = (mixerBufferRight[m] * mulR);
            if (rval > 1)
                rval = 1; // some simple overflow protection..
            else if (rval < -1)
                rval = -1;

            lval = mixerBufferLeft[m] * mulL;
            if (lval > 1)
                lval = 1;
            else if (lval < -1)
                lval = -1;

            irval = (rval * separation + lval * (1.0 - separation));
            // this is slow... calc for each track instead??? (faster)
            ilval = (lval * separation + rval * (1.0 - separation));
            data[n + 0] = (ilval);
            data[n + 1] = (ilval >>> 8);
            data[n + 2] = (irval);
            data[n + 3] = (irval >>> 8);
        }

        for (var n = 0; n < length; n++) {
            mixerBufferLeft[n] = 0;
            mixerBufferRight[n] = 0;
        }
    }

    /**
     * This is the mixers internal representation of a track ( channel)
     *
     * @author torkjel
     *
     */
    function Track (pmixBufferLeft, pmixBufferRight, pLlm, pSampleData, pOffset,
                pRate, pVolume, pPanning, pLoopType,
                pLoopStart, pLoopLength) {

        var sampleData = pSampleData,
            offset = pOffset,
            offsetLeft = pOffset,
            offsetRight = pOffset,
            rate = pRate,
            volume = pVolume,
            panning = pPanning,
            loopType = pLoopType,
            loopStart = pLoopStart,
            loopLength = pLoopLength,
            mute = false,
            llm = pLlm,
            mixBufferLeft = pmixBufferLeft,
            mixBufferRight = pmixBufferLeft;

        /**
         * initializes a track
         *
         * @param sampleData the sample to be mixed
         * @param offset the start of the part of the sample to be mixed
         * @param rate the rate the sample should be mixed at
         * @param volume the volume of the sample
         * @param panning the panning of the sample
         * @param loopType the type of sample loop
         * @param loopStart the start of the loop (if any)
         * @param looplengththe length of the loop (if any)
         * @param interpolate indicates if the resulting sound should be interpolated
         */
        this.init = function (pLlm, pSampleData, pOffset,
                pRate, pVolume, pPanning, pLoopType,
                pLoopStart, pLoopLength) {
            llm = pLlm;
            sampleData = pSampleData;
            offset = offsetLeft = offsetRight = pOffset;
            rate = pRate;
            volume = pVolume;
            panning = pPanning;
            loopType = pLoopType;
            loopStart = pLoopStart;
            loopLength = pLoopLength;
        }

        /**
         * sets if this track should be muted
         *
         * @param mute if true: mute, if false: unmute
         */
        this.setMute = function(mute) {
            this.mute = mute;
        }

        this.isMute = function() {
            return mute;
        }

        /**
         * @param channel which channel to mix to. This is for making the panning
         *            work. Can be LEFT, RIGHT or MONO.
         */
        this.mix = function(length, channel) {
            var vol = volume,
                grad = rate / 44100.0, // format.getRate();
                outBuffer,
                intOffset = offset;

            if (channel == Const.DefaultMixer.Track.LEFT)
                vol = volume * (1 - panning);
            else if (channel == Const.DefaultMixer.Track.RIGHT)
                vol = volume * panning;
            else if (channel == Const.DefaultMixer.Track.MONO)
                vol = volume;

            if (sampleData === null || mute || vol == 0)
                return;

            if (channel == Const.DefaultMixer.Track.MONO || channel == Const.DefaultMixer.Track.LEFT) {
                outBuffer = mixerBufferLeft;
                offset = offsetLeft;
            } else {
                outBuffer = mixerBufferRight;
                offset = offsetRight;
            }

            tmpBufferStart = intOffset;
            tmpBufferEnd = intOffset;

            var outOffset = 0;
            while (outOffset < length) {

                if (tmpBufferEnd - tmpBufferStart <= 16) {
                    tmpBufferStart = tmpBufferEnd;
                    tmpBufferEnd += TBL / 2;
                    this.getTrackData(tmpBuffer, tmpBufferStart, tmpBufferEnd,
                            intOffset, vol);
                    intOffset += TBL / 2;
                }

                var outOffsetH = [ outOffset ];
                var inOffsetH = [ offset ];

                llm.mix(outBuffer, outOffsetH, length, tmpBuffer, inOffsetH,
                        tmpBufferEnd, TBL, grad);

                outOffset = outOffsetH[0];
                offset = inOffsetH[0];
                tmpBufferStart = offset;
            }

            if (channel == Const.DefaultMixer.Track.MONO || channel == Const.DefaultMixer.Track.LEFT) {
                offsetLeft = offset;
            } else {
                offsetRight = offset;
            }
        }

        this.getTrackData = function(buffer, bufferStart,
                bufferEnd, sampleOffset, vol) {
            var res = 0;
            if (loopType == Const.Sample.NO_LOOP) {
                res = this.noLoop(buffer, bufferStart, bufferEnd, sampleData,
                        sampleOffset, vol);
            } else if (loopType == Const.Sample.FORWARD) {
                res = this.forwardLoop(buffer, bufferStart, bufferEnd, sampleData,
                        sampleOffset, vol, loopStart, loopLength);
            } else if (loopType == Const.Sample.PING_PONG) {
                res = this.pingPongLoop(buffer, bufferStart, bufferEnd, sampleData,
                        sampleOffset, vol, loopStart, loopLength);
            }
            return res;
        }

        this.noLoop = function(buffer, bufferStart, bufferEnd,
                sampleData, sampleOffset, vol) {

            var bufferLength = buffer.length - 1,
                bufferOffset = bufferStart,
                sampleLength = sampleData.length,
                volume = (vol * 256);

            while (sampleOffset < sampleLength && bufferOffset < bufferEnd) {
                buffer[bufferOffset & bufferLength] = ((sampleData[sampleOffset] * volume) >>> 8);
                sampleOffset++;
                bufferOffset++;
            }
            while (bufferOffset < bufferEnd) {
                buffer[bufferOffset & bufferLength] = 0;
                bufferOffset++;
            }
            return bufferOffset;
        }

        this.forwardLoop = function(buffer, bufferStart, bufferEnd,
                sampleData, sampleOffset, vol,
                loopStart, loopLength) {
            
            var bufferLength = buffer.length - 1,
                bufferOffset = bufferStart,
                sampleLength = loopStart + loopLength;
                volume = (vol * 256);

            if (sampleLength >= sampleData.length)
                sampleLength = sampleData.length;


            while (sampleOffset < loopStart && bufferOffset < bufferEnd) {
                buffer[bufferOffset & bufferLength] = ((sampleData[sampleOffset] * volume) >>> 8);
                sampleOffset++;
                bufferOffset++;
            }

            // loop
            while (bufferOffset < bufferEnd) {
                if (sampleOffset >= sampleLength)
                    sampleOffset = ((sampleOffset - loopStart) % loopLength)
                            + loopStart;
                buffer[bufferOffset & bufferLength] = ((sampleData[sampleOffset] * volume) >>> 8);
                sampleOffset++;
                bufferOffset++;
            }
            return bufferOffset;
        }

        this.pingPongLoop = function(buffer, bufferStart, bufferEnd,
                sampleData, sampleOffset, vol,
                loopStart, loopLength) {

            var bufferLength = buffer.length - 1,
                bufferOffset = bufferStart,
                volume = (vol * 256),
                sampleLength = loopStart + loopLength;

            if (sampleLength >= sampleData.length)
                sampleLength = sampleData.length;

            // before the loop end is reached first time
            while (sampleOffset < sampleLength && bufferOffset < bufferEnd) {
                buffer[bufferOffset & bufferLength] = ((sampleData[sampleOffset] * volume) >>> 8);
                sampleOffset++;
                bufferOffset++;
            }

            // loop
            sampleOffset = ((sampleOffset - loopStart) % (loopLength * 2))
                    + loopStart;
            var sampleLengthX2 = sampleLength * 2;
            while (bufferOffset < bufferEnd) {
                while (sampleOffset < sampleLength && bufferOffset < bufferEnd) {
                    buffer[bufferOffset & bufferLength] = ((sampleData[sampleOffset] * volume) >>> 8);
                    sampleOffset++;
                    bufferOffset++;
                }
                while (sampleLengthX2 - sampleOffset > loopStart
                        && bufferOffset < bufferEnd) {
                    sampleOffset++;
                    buffer[bufferOffset & bufferLength] = ((sampleData[sampleLengthX2
                            - sampleOffset] * volume) >>> 8);
                    bufferOffset++;
                }
                // it has either reached loopStart or buffer is full -> no if needed
                // if (sampleLengthX2 - sampleOffset <= loopStart)
                sampleOffset = loopStart;
            }
            return bufferOffset;
        }
    }
}