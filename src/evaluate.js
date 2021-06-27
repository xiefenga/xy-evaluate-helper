import { notificate } from './notificate'
import { delay, notifySuccess, testOpenWindow } from './utils'

export const confirmStart = async () => {
  const start = window.confirm('是否开始开始评教?');
  if (start) {
    if (!await testOpenWindow()) {
      notificate('提示', '取消自主评教');
      return;
    }
    notificate('提示', '即将开始自动评教');
    await delay(1000);
    $('.wap a')[1].click();
  } else {
    notificate('提示', '取消自主评教');
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

export const handleEvaluates = async () => {

  // 简单考虑有人直接进入该页面的情况（测试窗口拦截），别的复杂情况就不判断了
  if (!await testOpenWindow()) {
    notificate('提示', '取消自主评教');
    return;
  }

  const count = $('.Nsb_r_list_fy3 span').html().trim().slice(1, 2);
  const cur = $('#pageIndex').val();

  // 这一页所有需要评价的列表
  const list = Array.from($('tr td a')).filter(a => a.innerText.includes('评价'));

  // 下一页评价的按钮
  const nextBtn = $('#PagingControl1_btnNextPage').get(0);
  // 查看是否有下一页
  const hasNext = nextBtn.getAttribute('disabled') !== "disabled";

  if (!list.length && hasNext) {
    nextBtn.click();
  } else if (!list.length && !hasNext) {
    window.sessionStorage.setItem('complete', 1);
    notifySuccess();
    return;
  }

  notificate('提示', '开始评教', 1000);

  await delay(500);

  notificate('提示', `正在评教 ${cur} / ${count}，请等待。`, null);

  for (const a of list) {
    a.click();
    await delay(1000); // 慢点打开，窗口需要加载
  }
  window.location.reload();

}
