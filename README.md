# TiaPlayer

  https://qiatia.cn/tools/viaplayer/via-mini.html

## 轻量级的 JavaScript 在线音乐播放器 三行代码嵌入任意网页

简约不简单, 内置我苦心钻研多年的一个Toast模块, $http 发送网络请求模块(没办法, 实在不想用JQuery咯), 动画全使用CSS3实现! 你在问我兼容性? 什么! 风太大我听不见, 其他浏览器还好辣, IE真没啥信心.

### 大致功能

    歌手图片显示, 歌词滚动, 歌曲列表, 常用的歌曲切换, 播放顺序切换, 播放进度控制, 播放音量控制, 后台获取网易云音乐歌单

### 兼容性

### 开始使用 && 再本地或服务器

```CMD

git clone git@github.com:QiaTia/viaplayer.git TiaPlayer

cd TiaPlayer

npm insatll

npm run serve  // 本地调试 会启动一个node后台服务

npm run build  // 编译

```

```html
<script src="dist/index.js"></script>
<script>$Tia(*int playlist)</script>
```

``` 
* 为必填字段
playlist: 网易云音乐的歌单 id，  接受int数据
apiaddress: api链接地址，可选，接受string数据
```
### 如需手机上不显示
添加css样式即可
```css
@media (max-width:600px){
   #viaplayer{display: none}
}
```
### 高清预览

![view](https://github.com/QiaTia/tia-player/raw/master/preview/1.png)
![view](https://github.com/QiaTia/tia-player/raw/master/preview/2.png)
![view](https://github.com/QiaTia/tia-player/raw/master/preview/3.png)
![view](https://github.com/QiaTia/tia-player/raw/master/preview/4.png)
![view](https://github.com/QiaTia/tia-player/raw/master/preview/5.png)

### 反馈&建议&疑问

<a href="https://qiatia.cn/content.php?i=27#reply">点这里告诉我吧</a>

### 入坑小记：

bug嘛，前几天刚刚弄出来的时候，，会把我主页面的所有元素监听无效化(轮播图片,返回顶部按钮监听全部失效)，一直没找到原因，后面慢慢删减代码排除才发现，不能直接选择body元素添加内容进去，否则就会让页面监听失败，只能先 createElement 父div出来然后再将内容插进去，算得上一个经验了吧，真是坑的伤心流泪，一直没找到问题，但是却能正常工作，也没想到这样会出错

歌词滚动的时候，可能会解析失败，大概不会影响正常播放，只是会显示出错，还有更换歌曲的时候开始歌词不会复位到开始，但是播放一段事件会跳上去。
现在版权保护比较严重, 本地又是用的网易云在线api, 所有会出现一些付费歌曲无法播放的问题, 具体来说, 无解, 下次我可以考虑屏蔽掉这些歌曲. 现在只能争取选一个无不可以播放的歌单

### emmm

# 后台 API & 致谢

项目下基于node的后台api是我翻阅下面php的api实现的, 完全就是照抄的, 不需要担心
<a href='https://github.com/metowolf/NeteaseCloudMusicApi'>NeteaseCloudMusicApi</a>

# Ta们也在用ViaPlayer

https://qiatia.github.io/

https://tia.qiatia.cn
