function Module(name, id, tracker,
            instruments, patterns, patternOrder,
            restartPos, initialBPM, initialSpeed,
            initialVolume, panningType, initialPanning) {

    var name,
        id,
        tracker,
        instruments,
        patterns,
        patternOrder,
        restartPos,
        initialBPM,
        initialSpeed,
        initialVolume,
        initialPanning,
        panningType;

    name = name;
    id = id;
    tracker = tracker;
    instruments = instruments;
    patterns = patterns;
    patternOrder = patternOrder;
    restartPos = restartPos;
    initialBPM = initialBPM;
    initialSpeed = initialSpeed;
    initialVolume = initialVolume;
    panningType = panningType;
    initialPanning = initialPanning;
    
    function pad(str, len, padding) {
        var sb = new String();
        if (str.length > len)
            sb += (str.substring(0, len));
        else
            sb += (str);
        while (sb.length < len)
            sb += (padding);
        return sb;
    }

    this.getName = function () {
        return name;
    }

    this.getId = function () {
        return id;
    }

    this.getTracker = function () {
        return tracker;
    }

    this.getNumberOfInstruments = function () {
        return instruments.length;
    }

    this.getInstrument = function (n) {
        if (n >= instruments.length || n < 0)
            return null;
        return instruments[n];
    }

    this.getInstruments = function () {
        return instruments;
    }

    this.getNumberOfPatterns = function () {
        return patterns.length;
    }

    this.getNumberOfPositions = function () {
        return patternOrder.length;
    }

    this.getPatternIndexAtPos = function (n) {
        return patternOrder[n];
    }

    this.getPattern = function (n) {
        return patterns[n];
    }

    this.getPatternAtPos = function (n) {
        return this.getPattern(this.getPatternIndexAtPos(n));
    }

    this.getRestartPos = function () {
        return restartPos;
    }

    this.getInitialBpm = function () {
        return initialBPM;
    }

    this.getInitialSpeed = function () {
        return initialSpeed;
    }

    this.getInitialVolume = function () {
        return initialVolume;
    }

    this.getPanningType = function () {
        return panningType;
    }

    this.getInitialPanning = function (track) {
        return initialPanning[track];
    }

    this.getTrackCount = function () {
        return this.getPatternAtPos(0).getTrackCount();
    }

    this.getInfo = function () {
        var sb = new String();
        sb += ("Name:    ");
        sb += (pad(this.getName(), 25, ' '));
        sb += (" Chan: ");
        sb += (pad(this.getPatternAtPos(0).getTrackCount() + "", 3, ' '));
        sb += (" Pos: ");
        sb += (this.getNumberOfPositions());
        sb += ("\n");
        sb += ("Type:    ");
        sb += (pad(this.getId(), 25, ' '));
        sb += (" Inst: ");
        sb += (pad(this.getNumberOfInstruments() + "", 3, ' '));
        sb += (" Pat: ");
        sb += (this.getNumberOfPatterns());
        sb += ("\n");
        sb += ("Tracker: ");
        sb += (this.getTracker());
        sb += ("\n");
        return sb;
    }
}
