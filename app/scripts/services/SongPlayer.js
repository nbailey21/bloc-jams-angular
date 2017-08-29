(function() {
  function SongPlayer(Fixtures) {
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

    return SongPlayer;
  }



  angular
    .module('blocJams')
    .factory('SongPlayer', ['Fixtures', SongPlayer]);
})();
