import { useStorage } from "@vueuse/core";
import fetchData from "./fetchData";
import api from "./ApiList";
const useMusicList = (remote = false) => {
  const musicTitleList = useStorage("musicTitleList", []);
  const musicList = useStorage("musicList", {});
  if (musicTitleList.value.length !== 0 && remote == false) {
    return { musicTitleList, musicList };
  }

  fetchData(api.getMusicList, "", (res) => {
    let musicKeys = Object.keys(res);
    // 删除musicKeys中的 全部 和 所有歌曲添加到第一项
    musicKeys = musicKeys.filter(
      (item) => item !== "全部" && item !== "所有歌曲"
    );
    musicTitleList.value = ["全部", "所有歌曲", ...musicKeys];
    musicList.value = res;
    localStorage.setItem(
      "musicTitleList",
      JSON.stringify(musicTitleList.value)
    );
    localStorage.setItem("musicList", JSON.stringify(res)); //保存到本地
  });
  return { musicTitleList, musicList };
};
export default useMusicList;
