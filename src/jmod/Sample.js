function Sample(name,
		volume,
		panning,
		length,
		loopType,
		loopStart,
		loopLength,
		relativeNote,
		fineTune,
        units) {
    var name;
    var volume;
    var panning;
    var length;
    var loopType;
    var loopStart;
    var loopLength;
    var relativeNote;
    var fineTune;

    var units;

    var data;

    this.name = name;
    this.volume = volume;
    if (this.panning < 0)
        this.panning = 0;
    if (this.panning > 1)
        this.panning = 1;
    this.panning = panning;
    this.length = length;
    this.loopType = loopType;
    this.loopStart = loopStart;
    this.loopLength = loopLength;
    this.relativeNote = relativeNote;
    this.fineTune = fineTune;
    this.units = units;

    this.getInfo = function () {
        var sb = new String();
        sb += "Sample name: " + name + "\n";
        sb += "Length: " + length + "\n";
        var loop = null;
        if (loopType == NO_LOOP)
            loop = "no loop ";
        else if (loopType == FORWARD)
            loop = "forward ";
        else if (loopType == PING_PONG)
            loop = "ping pong ";
        sb += loop + " " + loopStart + " " + loopLength + "\n";
        return sb;
    }

    this.setData = function (data) {
        this.data = data;
    }

    this.getData = function () {
        return this.data;
    }

    this.getName = function () {
        return this.name;
    }

    this.getVolume = function () {
        return this.volume;
    }

    this.getPanning = function () {
        return this.panning;
    }

    this.getLength = function () {
        return this.length;
    }

    this.getLoopType = function () {
        return this.loopType;
    }

    this.getLoopStart = function () {
        return this.loopStart;
    }

    this.getLoopLength = function () {
        return this.loopLength;
    }

    this.getRelativeNote = function () {
        return this.relativeNote;
    }

    this.getFineTune = function () {
        return this.fineTune;
    }

    this.setUnits = function (units) {
        this.units = units;
    }

    this.getUnits = function () {
        return this.units;
    }
}
