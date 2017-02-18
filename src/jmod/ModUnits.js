function ModUnits(amigaClock, traditional) {
    var maxNote;
    var minNote;
    var minPeriod;
    var maxPeriod;
    var ac;

    this.period2rate = function (period) {
        return ac / (2 * period);
    }

    this.rate2period = function (rate) {
        return ac / (2 * rate);
    }

    this.period2note = function (period) {
        return this.rate2note(this.period2rate(period));
    }

    this.note2period = function (note) {
        return this.rate2period(this.note2rate(note));
    }

    this.note2rate = function (note) {
        var c0rate = ac / (2 * maxPeriod);
        return c0rate * Math.pow(2, note / 12);
    }

    this.rate2note = function (rate) {
        var c0rate = ac / (2 * maxPeriod);
        return 12 * Math.log(rate / c0rate) / Math.log(2);
    }

    this.addPeriod = function (note, period) {
        return this.period2note(this.note2period(note) + period);
    }

    this.getUpperNoteLimit = function () {
        return maxNote;
    }

    this.getLowerNoteLimit = function () {
        return minNote;
    }

    ac = amigaClock;
    if (traditional) {
        minPeriod = Const.ModUnits.TRADITIONAL_MIN_PERIOD;
        maxPeriod = Const.ModUnits.TRADITIONAL_MAX_PERIOD;
        maxNote = this.period2note(minPeriod);
        minNote = this.period2note(maxPeriod);
    } else {
        minPeriod = Const.ModUnits.NEW_MIN_PERIOD;
        maxPeriod = Const.ModUnits.NEW_MAX_PERIOD;
        maxNote = this.period2note(minPeriod);
        minNote = this.period2note(maxPeriod);
    }
}
