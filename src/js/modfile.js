function ModFile(mod) {
    function trimNulls(str) {
        return str.replace(/\x00+$/, '');
    }
    function getWord(str, pos) {
        return (str.charCodeAt(pos) << 8) + str.charCodeAt(pos+1)
    }

    this.getName = function () { return this.title; }

    this.samples = [];
    this.positions = [];
    this.patternCount = 1;
    this.patterns = [];

    /* TODO: distinguish 15-sample and 31-sample mods. Currently assuming 31-sample.
    "Check the bytes at location 471 in the file. If there is text there (ASCII
    $20-$7E (32-126)), then you can probably assume it's a 31-instrument file.
    Otherwise, it's an older 15 instrument file." */

    //alert(mod.charCodeAt(471) > 31 && mod.charCodeAt(471)<127);
    this.sampleCount = 31;

    if (mod) {
        this.data = mod;
        this.title = trimNulls(mod.substr(0, 20))

        for (var i = 0; i < this.sampleCount; i++) {
            var sampleInfo = mod.substr(20 + i * 30, 30);
            var sampleName = trimNulls(sampleInfo.substr(0, 22));
            this.samples[i] = {
                name: sampleName,
                length: getWord(sampleInfo, 22) * 2,
                finetune: sampleInfo.charCodeAt(24),
                volume: sampleInfo.charCodeAt(25),
                repeatOffset: getWord(sampleInfo, 26) * 2,
                repeatLength: getWord(sampleInfo, 28) * 2
            }
        }

        this.positionCount = mod.charCodeAt(950);
        this.positionLoopPoint = mod.charCodeAt(951);
        for (var i = 0; i < 128; i++) {
            this.positions[i] = mod.charCodeAt(952 + i);
            if (this.positions[i] >= this.patternCount) {
                this.patternCount = this.positions[i] + 1;
            }
        }

        var identifier = mod.substr(1080, 4);

        var channelCountByIdentifier = {
            'TDZ1': 1, '1CHN': 1, 'TDZ2': 2, '2CHN': 2, 'TDZ3': 3, '3CHN': 3,
            'M.K.': 4, 'FLT4': 4, 'M!K!': 4, '4CHN': 4, 'TDZ4': 4, '5CHN': 5, 'TDZ5': 5,
            '6CHN': 6, 'TDZ6': 6, '7CHN': 7, 'TDZ7': 7, '8CHN': 8, 'TDZ8': 8, 'OCTA': 8, 'CD81': 8,
            '9CHN': 9, 'TDZ9': 9,
            '10CH': 10, '11CH': 11, '12CH': 12, '13CH': 13, '14CH': 14, '15CH': 15, '16CH': 16, '17CH': 17,
            '18CH': 18, '19CH': 19, '20CH': 20, '21CH': 21, '22CH': 22, '23CH': 23, '24CH': 24, '25CH': 25,
            '26CH': 26, '27CH': 27, '28CH': 28, '29CH': 29, '30CH': 30, '31CH': 31, '32CH': 32
        }

        this.channelCount = channelCountByIdentifier[identifier];
        if (!this.channelCount) {
            //console.log("Warning: unknown identifier " + identifier + ". Assuming 4 channels.");
            this.channelCount = 4;
        }

        var patternOffset = 1084;
        for (var pat = 0; pat < this.patternCount; pat++) {
            this.patterns[pat] = [];
            for (var row = 0; row < 64; row++) {
                this.patterns[pat][row] = [];
                for (var chan = 0; chan < this.channelCount; chan++) {
                    b0 = mod.charCodeAt(patternOffset);
                    b1 = mod.charCodeAt(patternOffset + 1);
                    b2 = mod.charCodeAt(patternOffset + 2);
                    b3 = mod.charCodeAt(patternOffset + 3);
                    this.patterns[pat][row][chan] = {
                        sample: (b0 & 0xf0) | (b2 >> 4),
                        period: ((b0 & 0x0f) << 8) | b1,
                        effect: b2 & 0x0f,
                        effectParameter: b3
                    };
                    patternOffset += 4;
                }
            }
        }

        var sampleOffset = patternOffset;
        for (var s = 0; s < this.sampleCount; s++) {
            this.samples[s].startOffset = sampleOffset;
            sampleOffset += this.samples[s].length;
        }
    }
    else {
        this.title = '';
        this.channelCount = 4;
        this.identifier = 'M.K.';
        for (var i = 0; i < 128; i++) {
            this.positions[i] = 0;
        }
        for (var i = 0; i < this.sampleCount; i++) {
            this.samples[i] = {
                name: '',
                length: 0,
                finetune: 0,
                volume: 64,
                repeatOffset: 0,
                repeatLength: 0
            }
            for (var pat = 0; pat < this.patternCount; pat++) {
                this.patterns[pat] = [];
                for (var row = 0; row < 64; row++) {
                    this.patterns[pat][row] = [];
                    for (var chan = 0; chan < this.channelCount; chan++) {
                        this.patterns[pat][row][chan] = {
                            sample: 0,
                            period: 0,
                            effect: 0,
                            effectParameter: 0
                        };
                    }
                }
            }
        }
    }
}