import api from "@/components/ApiList";
import fetchData from "@/components/fetchData";
import { useStorage} from "@vueuse/core";

const useSetting = (remote = false) => {
  const settingData = useStorage("setting", {});
  const isLoading = ref(false);
  
  // 如果本地已有数据且不需要远程获取，则直接返回
  if (remote === false && Object.keys(settingData.value).length !== 0) {
    return computed(() => settingData.value);
  }
  
  // 如果数据为空或需要远程获取，则异步获取数据
  if (Object.keys(settingData.value).length === 0 || remote === true) {
    isLoading.value = true;
    
    // 使用Promise确保数据获取完成
    new Promise((resolve) => {
      fetchData(api.getSetting, "", (res) => {
        settingData.value = res;
        localStorage.setItem("setting", JSON.stringify(res));
        isLoading.value = false;
        resolve(res);
      });
    });
  }
  
  // 返回一个computed属性，确保只有在数据加载完成后才会返回有效值
  return computed(() => {
    // 如果仍在加载中但已有部分数据，也返回该数据
    // 这是为了避免白屏，允许应用程序先使用已有数据
    return settingData.value;
  });
};

export default useSetting;