function Pattern(tracks, divisions) {
    var tracks;
    var divisions;

    this.tracks = tracks;
    this.divisions = divisions;

    this.getTrack = function (n) {
        if (n >= tracks.length || n < 0)
            return null;
        return tracks[n];
    }

    this.getTrackCount = function () {
        return tracks.length;
    }

    this.getDivisions = function () {
        return divisions;
    }

    this.getCode = function (division) {
        var sb = new String();
        for (var m = 0; m < tracks.length; m++)
            sb += (tracks[m].getInfo(division) + " ");
        return sb;
    }

    this.getInfo = function () {
        var sb = new String();
        sb += (
			"#tracks: " + tracks.length + " #divisions:" + divisions + "\r\n");
        for (var n = 0; n < divisions; n++) {
            for (var m = 0; m < tracks.length; m++)
                sb += (tracks[m].getInfo(n) + " ");
            sb += ("\r\n");
        }
        sb += ("\r\n");
        return sb;
    }

    this.getTable = function () {
        var patTable = new String();
        var divLength = this.getDivisions();
        var trackLength = this.getTrackCount();
        patTable += "<div class=\"Pattern\">";
        for (var trackLoop = 0; trackLoop < trackLength; trackLoop++) {
            patTable += "<div class=\"Channel\">";
            for (var divLoop = 0; divLoop < divLength; divLoop++) {
                patTable += this.getTrack(trackLoop).getInfo(divLoop);
                patTable += "<br />";
            }
            patTable += "</div>";
        }
        patTable += "</div>";
        return patTable;
    }
}
