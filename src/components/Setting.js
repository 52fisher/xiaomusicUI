import { ref } from "vue";
import api from '@/components/ApiList';
function getVolume(did, callback = "") {
  //{"did":"568532341"}
  const { data, error } = get(api.getVolume + did, (res) => {
    //{"ret":"OK","volume":42}
    callback && callback(res.volume);
    data.value = res.volume; //返回音量
  });
  return data;
}
function setVolume(config) {
  //{"did":"568532341","volume":"42"}
  post(api.setVolume, config, (res) => {
    //{"ret":"OK","volume":42}
    res.ret == "ok" &&
      ElMessage({
        message: "音量已设置为" + res.volume,
        type: "success",
      });
  });
}
function getMusicList(remote=false) {
  const musicListTitle = ref([]);
  
  const { data:musicList, error } = get(api.musiclist, (res) => {
    let musicKeys = Object.keys(res);
    // 删除musicKeys中的 全部 和 所有歌曲 ，添加到第一项
    musicKeys = musicKeys.filter((item) => item !== "全部" && item !== "所有歌曲");
    musicListTitle.value = ["全部", "所有歌曲", ...musicKeys];
    localStorage.setItem("musicListTitle", JSON.stringify(musicListTitle.value));
    localStorage.setItem("musicList", JSON.stringify(res)); //保存到本地
  });

  return {
    musicList, //音乐列表
    musicListTitle, //音乐列表标题
    // currentMusicListName, //当前音乐列表
  };
}
function getMiDeviceList() {
  const XMSetting = useSetting();
  //从setting获取设备列表
  const miDeviceList = ref({});
  miDeviceList.value = XMSetting.value.devices;
  const miDidList = ref([]);
  watchEffect(() => {
    if (!XMSetting.value) {
      return;
    }
    miDidList.value = XMSetting.value.mi_did?.split(",").filter(Boolean).map((item) => {
      // console.log("%csrccomponentsSetting.js:67 item", "color: #007acc;", item);
      return toRaw(miDeviceList.value)[item];
    });
  })

  return {
    miDeviceList, //设备列表
    miDidList, //设备id列表
    // XMSetting
  };
}
function sendCmd(config) {
  //{"did":"568532341","cmd":"播放列表全部|嘉宾 - 张远"}
  post(api.cmd, config, (res) => {
    //{"ret":"OK"}
    ElMessage({
      message: res.ret,
      type: "success",
    });
  });
}
function searchMusic(name) {
  const list = ref([]);
  get(api.searchMusic + name, (res) => {
    //格式化成{value,label}
    list.value = res.map((item) => {
      return {
        value: item,
        label: item,
      };
    });
    list.value.push({
      value: name,
      label: name,
    });
  });
  return list;
}
function saveSetting(config) {
  //先保存本地
  localStorage.setItem("setting", JSON.stringify(config));
  // console.log('%csrc\components\Setting.js:108 config', 'color: #007acc;', config);
  //再保存
  post(api.saveSetting, toRaw(config), (res) => {
    ElMessage({
      message: res,
      type: "success",
      plain: true,
    });
  });
}
const clearSetting = () => {
  localStorage.removeItem("setting");
}
function useSetting() {
  //先从本地获取setting
  const results = ref({});
  let setting = localStorage.getItem("setting");
  if (setting) {
    // setting = JSON.parse(setting);
    //如果device_lsit为false,直接返回setting
      results.value = JSON.parse(setting);
      return results;
  }
  //如果本地没有，则从服务器获取
  //如果device_list为true，则添加参数'?need_device_list=true'
  const { data, error } = get(api.getSetting,(res) => {
      localStorage.setItem("setting", JSON.stringify(res));
      results.value = res;
    }
  );
  return results;
}

function getMusicUrl(title) {
  // let musicInfo = ref({})
  const { data: musicInfo, error } = get(api.musicInfo + title);
  // console.log('%csrc\components\Setting.js:123 musicInfo', 'color: #007acc;', musicInfo);
  return {
    musicInfo,
    error,
  };
}
function setCache(name,value) {
  localStorage.setItem(name,value)
}
function getCache(name, defaultValue, isNumber = false) {
  let tmp = localStorage.getItem(name)
  if (!tmp) return defaultValue
  if (isNumber) {
    return Number(tmp)
  }
  return tmp
}
function delMusic(name) {
  //删除音乐
  post(api.delMusic, { name: name }, (res) => {
    ElMessage({
      message: res,
      type: "success",
      plain: true,
    });
  });
}
function get(url, callback = "") {
  const data = ref(null);
  const error = ref(null);

  const fetchData = () => {
    // reset state before fetching..
    data.value = null;
    fetch(toValue(url))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        ElMessage({
          message: "网络请求发生故障",
          type: "error",
        });
        // throw new Error("Network response was not ok.");
      })
      .then((json) => {
        data.value = json;
        if (callback) {
          callback(json);
        }
      })
      .catch((err) => (error.value = err));
  };

  watchEffect(() => {
    fetchData();
  });

  return { data, error };
}
function post(url, data, callback) {
  // 使用fetch进行POST请求
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((responseData) => {
      callback(responseData);
    })
    .catch((error) => {
      console.error("Request failed:", error);
    });
}

/**
 * @description: 通过Fetch API来获取或发送数据
 * @param {string} url  API的url
 * @param {object} [postData={}]  POST请求时要传递的数据
 * @param {function} [callback]  回调函数
 * @return {void}
 */
const fetchData = (url, postData = {}, callback) => {
  fetch(url, postData ? {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: {
      'Content-Type': 'application/json',
    }
  } : {
    method: 'GET',
  }
  ).then(res => res.json()).then(res => {
    callback && callback(res)
  })
}

export default {
  get,
  post,
  getVolume,
  setVolume,
  useSetting,
  clearSetting,
  getMusicList,
  saveSetting,
  sendCmd,
  getMiDeviceList,
  getMusicUrl,
  searchMusic,
  delMusic,
  setCache,
  getCache,
  fetchData,
};
