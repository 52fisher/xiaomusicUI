import api from "@/components/ApiList";
import fetchData from "@/components/fetchData";
import { useStorage } from "@vueuse/core";

const useSetting = (remote = false) => {
  const settingData = useStorage("setting", {});
  if (remote == false) {
    if (Object.keys(settingData.value).length !== 0) {
      return settingData;
    }
  }

  fetchData(api.getSetting, "", (res) => {
    settingData.value = res;
    localStorage.setItem("setting", JSON.stringify(res));
  });
  return settingData;
};
export default useSetting;
