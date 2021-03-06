import { notificate } from './notificate'

export const delay = n => new Promise(resolve => setTimeout(resolve, n));

export const notifySuccess = () => notificate('提示', '评教完成，请注意关闭脚本。', 5000);

export const openWindow = url => {

  const width = 500, height = 500;

  const left = (window.screen.availWidth - 10 - width) / 2;

  const top = (window.screen.availHeight - 30 - height) / 2;

  const windowFeatures1 = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no';

  const windowFeatures2 = `top=${top},left=${left},width=${width}px,height=${height}px`;

  const windowFeatures = `${windowFeatures1},${windowFeatures2}`;

  return window.open(url, "_blank", windowFeatures);
}

export const testOpenWindow = async () => {
  let count = 0;
  if (!window.sessionStorage.getItem('canOpenWindow')) {
    notificate('提示', '开始弹窗测试，以检查是否允许该站点弹窗');
    await delay(1000);
    while (count < 3) {
      const newWindow = openWindow('/');
      if (newWindow === null) {
        if (count === 0) {
          notificate('提示', '弹窗被拦截，请手动开启', 5000);
          notificate('提示', '请查看浏览器提醒（例如地址栏右侧），手动允许该站点弹窗', 5000);
          await delay(1000); // 不 delay 的画，confirm 会先出来，阻塞 notification的渲染
        }
        const confirm = window.confirm('允许弹窗后点击确认'); // 别骗我
        if (!confirm) {
          return false;
        }
        count++;
      } else {
        notificate('提示', '弹窗测试通过');
        await delay(500);
        newWindow.close();
        window.sessionStorage.setItem('canOpenWindow', true);
        return true;
      }
    }
  } else {
    return true;
  }
  return false;
}