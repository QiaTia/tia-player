import Toast from '../src/toast'
import './style.less'

const temp = '<script src="https://i.qiatia.cn/public/tia-player/tia-player.mini.js"><\/script>\n<script>$Tia(*int playlist, string apiaddress)<\/script>';
document.getElementById('code').innerHTML = temp
document.getElementById('copy').addEventListener('click', function (){
  if (window.clipboardData){
    window.clipboardData.clearData();
    clipboardData.setData("Text", temp);
    Toast('已复制，右键可粘贴');
  }else if(document.execCommand('copy')){
    const oInput = document.createElement('input')
    oInput.value = temp
    document.body.appendChild(oInput)
    // oInput.style.display='none'
    oInput.select() // 选择对象
    document.execCommand("Copy") // 执行浏览器复制命令
    oInput.remove()
    Toast('已复制，右键可粘贴');
  }else{
    Toast('你的浏览器不兼容，请手动复制');
  }
})
