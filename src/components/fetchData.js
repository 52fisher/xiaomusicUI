/**
 * @description: 通过Fetch API来获取或发送数据
 * @param {string} url  API的url
 * @param {object} [postData={}]  POST请求时要传递的数据
 * @param {function} [callback]  回调函数
 * @return {void}
 */
const fetchData = (url, postData = {}, callback) => {
  fetch(
    url,
    postData
      ? {
          method: "POST",
          body: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      : {
          method: "GET",
        }
  )
    .then((res) => res.json())
    .then((res) => {
      callback && callback(res);
    });
};
export default fetchData;