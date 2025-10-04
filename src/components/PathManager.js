// 创建路径联动工具类 - 更通用、可复用的实现
/**
 * 路径管理器类，用于管理音乐路径和依赖路径
 */
export default class PathManager {
  /**
   * 构造函数
   * @param {Object} dataRef - 数据引用对象
   * @param {Object} pathsConfig - 路径配置对象
   */
  constructor(dataRef, pathsConfig) {
    this.data = dataRef; // 存储数据引用
    this.pathsConfig = pathsConfig; // 存储路径配置
    this.localPaths = {}; // 存储本地路径引用
    
    // 初始化本地路径引用
    this.initLocalPaths();
  }
  
  // 初始化本地路径引用
  initLocalPaths() {
    Object.keys(this.pathsConfig).forEach(key => {
      this.localPaths[key] = ref('');
    });
  }
  
  // 获取计算属性配置
  getComputedProps() {
    const computedProps = {};
    
    // 音乐路径计算属性
    computedProps.music_path = computed({
      get: () => {
        return this.data.value && this.data.value.music_path ? this.data.value.music_path : 'music';
      },
      set: (val) => {
        if (!this.data.value) return;
        
        const oldMusicPath = this.data.value.music_path || 'music';
        this.data.value.music_path = val;
        
        // 更新所有相关路径
        Object.keys(this.pathsConfig).forEach(key => {
          this.updateDependentPath(key, val, oldMusicPath);
        });
      }
    });
    
    // 为每个依赖路径创建计算属性
    Object.keys(this.pathsConfig).forEach(key => {
      computedProps[key] = computed({
        get: () => {
          return this.localPaths[key].value;
        },
        set: (val) => {
          if (!this.data.value || !this.data.value.music_path) return;
          
          this.localPaths[key].value = val;
          // 更新完整路径
          const fullPathKey = this.pathsConfig[key].fullPathKey;
          this.data.value[fullPathKey] = this.data.value.music_path + '/' + val;
        }
      });
    });
    
    return computedProps;
  }
  
  // 更新依赖路径
  updateDependentPath(key, newMusicPath, oldMusicPath) {
    const config = this.pathsConfig[key];
    const fullPathKey = config.fullPathKey;
    const defaultSubPath = config.defaultSubPath;
    
    if (this.data.value[fullPathKey]) {
      // 提取子路径部分
      const subPath = this.data.value[fullPathKey].replace(oldMusicPath + '/', '');
      // 使用新的音乐目录和原有的子路径重新构建完整路径
      this.data.value[fullPathKey] = newMusicPath + '/' + subPath;
      // 更新对应的本地路径值
      this.localPaths[key].value = subPath;
    } else {
      // 如果没有设置路径，使用默认值
      this.data.value[fullPathKey] = newMusicPath + '/' + defaultSubPath;
      this.localPaths[key].value = defaultSubPath;
    }
  }
  
  // 获取初始化watch处理函数
  getInitWatchHandler() {
    return (newData) => {
      if (!newData || !newData.music_path) return;
      
      // 初始化所有本地路径值
      Object.keys(this.pathsConfig).forEach(key => {
        const config = this.pathsConfig[key];
        const fullPathKey = config.fullPathKey;
        
        if (newData[fullPathKey] && !this.localPaths[key].value) {
          this.localPaths[key].value = newData[fullPathKey].replace(newData.music_path + '/', '');
        }
      });
    };
  }
}