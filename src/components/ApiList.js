const base = import.meta.env.VITE_BASE_URL;

const api = {
  getVolume: base + "getvolume?did=", // get {did}
  setVolume: base + "setvolume", // post {volume , did}
  saveSetting: base + "savesetting", // post {setting , did}
  musiclist: base + "musiclist", // get {}
  searchMusic: base + "searchmusic?name=", // get {name}
  playingMusic: base + "playingmusic?did=", // get {did}
  sendCmd: base + "cmd", // post {cmd , did}
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
  musicInfoWithTag: base + "musicinfo?musictag=true&name=", // get { name}
  refreshMusicTag: base + "refreshmusictag", // get
};
export default api;
