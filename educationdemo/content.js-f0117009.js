// ... existing code ...
// 添加空值检查
if (obj && obj.videoInWhiteList) {
    // 使用 videoInWhiteList 属性
    const result = obj.videoInWhiteList;
} else {
    // 处理对象或属性不存在的情况
    console.log('videoInWhiteList not available');
}
// ... existing code ...