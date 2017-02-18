function Instrument(name, note2sample, samples, autoEffects, panning) {
    var name;
    var samples;
    var note2sample;
    var autoEffects;
    var panning;

    this.name = name;
    this.note2sample = note2sample;
    this.samples = samples;
    this.autoEffects = autoEffects;
    this.panning = panning;

    this.getInfo = function () {
        var sb = new String();
        sb += ("Instrument name: ");
        sb += (name);
        sb += ("\n");
        sb += ("#samples:        ");
        sb += (getNumberOfSamples());
        sb += ("\n");
        for (var n = 0; n < this.getNumberOfSamples(); n++)
            sb += (samples[n].getInfo());
        return sb;
    }

    this.getName = function () {
        return name;
    }

    this.getSampleByNum = function (num) {
        if (num > samples.length || num < 0)
            return null;
        return samples[num];
    }

    this.getSampleByNote = function (note) {
        if (note == Const.Instrument.NO_NOTE
			|| note2sample === null
			|| note >= note2sample.length
			|| note < 0)
            return null;
        return samples[note2sample[note]];
    }

    this.getNumberOfSamples = function () {
        if (samples === null)
            return 0;
        return samples.length;
    }

    this.getNumberOfAutoEffects = function () {
        if (autoEffects === null)
            return 0;
        return autoEffects.length;
    }

    this.getAutoEffect = function (num) {
        if (autoEffects === null || num >= autoEffects.length || num < 0)
            return null;
        return autoEffects[num];
    }

    this.getAutoEffects = function () {
        return autoEffects;
    }

    this.getPanning = function () {
        return panning;
    }
}
