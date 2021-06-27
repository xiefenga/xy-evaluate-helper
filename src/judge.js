import { notifySuccess } from './utils'
import { confirmStart, checkEvaluations, autoEvaluate, handleEvaluates } from './evaluate'

const urls = ['.jsp', 'xspj_find.do', 'xspj_list.do', 'xspj_edit.do'];

const judge = () => {

  const url = window.location.pathname;

  const complete = Number(window.sessionStorage.getItem('complete') ?? 0);

  const canDoSomething = urls.some(u => url.includes(u));

  // 事不过三，不提醒超过 3 次
  if (!canDoSomething || complete > 3) {
    return;
  } else if (complete > 0) {
    if (!url.includes(urls[3])) {
      window.sessionStorage.setItem('complete', Number(complete) + 1);
      notifySuccess();
    }
  } else {
    if (url.endsWith(urls[0])) {
      confirmStart();
    } else if (url.includes(urls[1])) {
      checkEvaluations();
    } else if (url.includes(urls[2])) {
      handleEvaluates();
    } else if (url.includes(urls[3])) {
      autoEvaluate();
    }
  }
}

export default judge

