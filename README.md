# viaplayer
## 轻量级的HTMl5播放器 三行代码嵌入任意网页
没错啦就是左下角那个东东，超轻量级，三行代码，不算jq依赖不到20k，功能还算是齐全

我也不想依赖jquery啊，但是使用jq能减少好多工作量哎，特别是ajax方法用起来特别爽，等以后看有空去掉jq依赖吧
### 大致功能：

后台获取网易云音乐歌单，歌手显示，歌词滚动，歌曲列表，常用的歌曲切换，播放顺序切换

嗯嗯，控制条啊，音量控制打算以后有时间加上去，大致有个思路了，但是最近挺忙的
### 开始使用

也就三行代码，算上依赖jq的

<script src="//libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
<script src="//tia.nos-eastchina1.126.net/public/viaplayer/viaplayerAll.js">
</script><script>viaplayer.player(*int playlist, string apiaddress)</script>
* 为必填字段
playlist  ：网易云音乐的歌单 id，  接受int数据
apiaddress  ：api链接地址，可选，接受string数据
### 高清预览：
![view](/preview/1.png)
![view](/preview/2.png)
![view](/preview/3.png)
![view](/preview/4.png)
![view](/preview/5.png)

其实，左下角那个随便体验
### 出现的bug：

bug嘛，前几天刚刚弄出来的时候，，会把我主页面的所有元素监听无效化，，一直没找到原因，后面慢慢减代码排除才发现，不能直接选择body元素添加内容进去，否则就会让页面监听失败，只能先 createElement 父div出来然后再将内容插进去，算得上一个经验了吧，真是坑的伤心流泪，一直没找到问题，但是却能正常工作，也没想到这样会出错

歌词滚动的时候，可能会解析失败，大概不会影响正常播放，只是会显示出错，还有更换歌曲的时候开始歌词不会复位到开始

### emmm

本来打算叫tiapalayer，但是跟via太近。然后我又一直再用手机上哪款via浏览器，一直代码写下来都没发现毛病，，结果现在才想起来名字都不对头了-- 09.03

