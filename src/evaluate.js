import { notificate } from './notificate'
import { delay, notifySuccess, testOpenWindow } from './utils'

export const confirmStart = async () => {
  const start = window.confirm('是否开始开始评教?');
  if (start) {
    if (await testOpenWindow()) {
      notificate('提示', '即将开始自动评教');
      await delay(1000);
      $('.wap a')[1].click();
    }
  }
}

export const checkEvaluations = async () => {
  const links = $('tr').eq(2).find('td').eq(-1).find('a');
  if (!links.length) {
    notificate('提示', '暂无评教，请关闭脚本。');
  } else {
    notificate('提示', '即将进入评教页面');
    await delay(800);
    links[0].click();
  }
}

export const autoEvaluate = async () => {
  window.alert = () => true;
  window.confirm = () => true;
  $('#table1 tbody tr td:odd')
    .find('input:first-child')
    .click().end().eq(0).find('input:nth-child(3)').click();
  $('#tj').click();
  await delay(100);
  window.close();
}

// 不考虑有人直接进入该页面的情况，太麻烦了
export const handleEvaluates = async () => {

  const count = $('.Nsb_r_list_fy3 span').html().trim().slice(1, 2);
  const cur = $('#pageIndex').val();

  // 该页面被评教次数
  const nums = Number(window.localStorage.getItem('page' + cur) ?? 0);

  // 这一页所有需要评价的列表
  const list = Array.from($('tr td a')).filter(a => a.innerText.includes('评价'));

  // 下一页评价的按钮
  const nextBtn = $('#PagingControl1_btnNextPage').get(0);
  // 查看是否有下一页
  const hasNext = nextBtn.getAttribute('disabled') !== "disabled";

  if (nums > 0 && list.length) {
    window.confirm('请确保浏览器不会拦截新窗口，并点击确认');
    await delay(2000);  // 点击允许之后，那些被拦截的窗口会被打开，等一会让他们自动提交
    window.location.reload();
  } else if (!list.length) {
    window.localStorage.removeItem('page' + cur);
    if (hasNext) {
      nextBtn.click();
    }
  }

  if ((!list.length && !hasNext)) {
    window.sessionStorage.setItem('complete', 1);
    notifySuccess();
    return;
  }

  notificate('提示', '开始评教', 1000);

  await delay(500);

  notificate('提示', `正在评教 ${cur} / ${count}，请等待。`, 5000);

  for (const a of list) {
    a.click();
    await delay(1000); // 慢点打开，窗口需要加载
  }

  window.localStorage.setItem('page' + cur, Number(nums) + 1);
  window.location.reload();
}
