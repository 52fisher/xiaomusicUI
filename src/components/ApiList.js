// const base = "/";
const base = "http://192.168.6.131:5678/";
const api = {
  getVolume: base + "getvolume?did=", // get {did}
  setVolume: base + "setvolume", // post {volume , did}
  saveSetting: base + "savesetting", // post {setting , did}
  musiclist: base + "musiclist", // get {}
  searchmusic: base + "searchmusic?name=", // get {name}
  playingmusic: base + "playingmusic", // get {did}
  cmd: base + "cmd", // post {cmd , did}
  getSetting: base + "getsetting?need_device_list=true", //
  getMusicList: base + "musiclist", // get {did}
  getCurPlaylist: base + "curplaylist", // get {did}
  delMusic: base + "delmusic", // post {mid , did}
  downloadJson: base + "downloadjson", // get {did}
  downloadLog: base + "downloadlog", // get {did}
  playUrl: base + "playurl", // get {mid , did}
  debugPlayByMusicUrl: base + "debug_play_by_music_url", // get {mid , did}
  music: base + "music/", // get {file_path }
  musicInfo: base + "musicinfo?name=", // get { name}
};
export default api;
