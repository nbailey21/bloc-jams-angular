(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};
    var currentAlbum = Fixtures.getAlbum();

    // @desc Buzz object audio file
    // @type {Object}

    var currentBuzzObject = null;

    // @function setSong
    // @desc Stops currently playing song and loads new audio file as currentBuzzObject
    // @param {object} song

    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    };

    // @function playSong
    // @desc Plays currentBuzzObject and sets playing property of song object to true
    // @param {object} song

    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    }

    var stopSong = function(song) {
        currentBuzzObject.stop();
        song.playing = null;
    }

    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    SongPlayer.currentSong = null;

    // @desc Current playback time (in seconds) of currently playing song
    // @type {Number}

    SongPlayer.currentTime = null;

    // @desc Current volume
    // @type {Number}

    SongPlayer.volume = 70;

    // @method SongPlayer.play
    // @desc Sets song and plays song, if song is paused, then plays song
    // @param {object} song

    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          currentBuzzObject.play();
        }
      }
    };

    // @method SongPlayer.pause
    // @desc pauses current song
    // @param {object} song

    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if(currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if(currentSongIndex > currentAlbum.songs.length - 1) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    // @function setCurrentTime
    // @desc Set current time (in seconds) of currently playing song
    // @param {Number} time

    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    SongPlayer.setVolume = function(volume) {
      if (currentBuzzObject) {
        currentBuzzObject.setVolume(volume);
      }
    }

    return SongPlayer;
  }



  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
