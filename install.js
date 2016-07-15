(function () {
    var validExit = false;

    var path = require('path'),
        fs = require('fs-extra'),
        glob = require('glob'),
        semver = require('semver'),
        request = require('sync-request'),
        AdmZip = require('adm-zip'),
        sync = require('child_process').execSync,
        kew = require('kew');

    /** Handle event handling when an exit occurs. */
    process.on('exit', function () {
        if (!validExit) {
            console.log('Install exited unexpectedly');
            exit(1)
        }
    });

    /**
     * Handles a valid exit.
     * @param code The exit code.
     */
    function exit(code) {
        validExit = true;
        process.exit(code || 0)
    }

    exit(0);
})();
