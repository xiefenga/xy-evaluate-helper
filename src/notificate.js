import { delay } from './utils'

const notifications = [];

const NOTIFICATION_TEMPLATE = `
<div class="inject-notification">
  <div class="inject-notification-box">
    <h2 class="inject-notification-title">{{title}}</h2>
    <div class="inject-notification-content">
      <p>{{content}}</p>
    </div>
    <div class="inject-notification-close">×</div>
  </div>
</div>`;

const NOTIFICATION_STYLE = `
.inject-notification {
  display: flex;
  width: 330px;
  padding: 14px 26px 14px 13px;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  transition: .4s ease-in-out;
  overflow-wrap: anywhere;
  overflow: hidden;
}

.inject-notification p {
    margin: 0;
}

.inject-notification-box {
    margin-left: 13px;
    margin-right: 8px
}

.inject-notification-title {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #303133;
    margin: 0;
}

.inject-notification-content {
    font-size: 14px;
    line-height: 24px;
    margin: 6px 0 0;
    color: #606266;
    text-align: justify;
}

.inject-notification-close {
    position: absolute;
    top: 5px;
    right: 15px;
    cursor: pointer;
    color: #909399;
    font-size: 24px;
    font-weight: 100;
}

.inject-notification-close:hover{
    color: #606266;
}`;

const initTitle = "标题";

const initContent = "这是一段提示";

// 初始定位的 top
const startTop = 16;
// 每两个 notification 的间隔
const offset = 4;

const injectStyle = () => {
  $('<style></style>')
    .attr('id', "inject")
    .html(NOTIFICATION_STYLE)
    .appendTo('body');
}

const notificate = async (title = initTitle, content = initContent, duration = 2000) => {
  const NOTIFICATION_ELEMENT = NOTIFICATION_TEMPLATE.replace(
    /{{title}}|{{content}}/g,
    match => match.includes('title') ? title : content
  );

  // outerHeight -> 边框盒高度
  const top = notifications.reduce((acc, cur) => acc + cur.outerHeight() + offset, startTop);

  const notification = $(NOTIFICATION_ELEMENT).css({
    transform: 'translateX(110%)',
    top: top + 'px'
  }).appendTo('body');

  notifications.push(notification);
  await delay(100);
  notification
    .css('transform', 'translateX(0)')
    .find('.inject-notification-close')
    .one('click', () => close(notification));
  if (duration != null) {
    await delay(duration);
    close(notification);
  }
}

const close = (notification) => {
  const index = notifications.indexOf(notification);
  if (index !== -1) {
    notification.one('transitionend', () => {
      const height = notification.outerHeight() + offset;
      notifications.splice(index, 1);
      // 更新后面所有 notification 的位置
      notifications.forEach((n, i) => {
        if (i >= index) {
          n.css('top', parseInt(n.css('top')) - height + 'px');
        }
      });
      notification.remove();
    });
    notification.css('transform', 'translateX(110%)');
  }
}

export { injectStyle, notificate }
