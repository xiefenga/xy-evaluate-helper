// ==UserScript==
// @name         评教助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  新余学院评教
// @author       xie feng
// @match        http://jwxt.xyc.edu.cn/*
// @grant        none
// ==/UserScript==


(function () {

    const url = window.location.pathname;

    const delay = n => new Promise(resolve => setTimeout(resolve, n));

    const inject = () => {

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
        }
        `

        const injectStyle = () => {
            $('<style id="inject"></style>').html(NOTIFICATION_STYLE).appendTo('body');
        }

        const notificate = async (title, content, duration = 2000) => {
            const NOTIFICATION_ELEMENT = NOTIFICATION_TEMPLATE.replace(
                /{{title}}|{{content}}/g,
                match => match.includes('title') ? title : content
            );

            const notification = $(NOTIFICATION_ELEMENT).css('transform', 'translateX(110%)').appendTo('body');

            const close = () => {
                if (notification) {
                    notification.one('transitionend', () => {
                        notification.remove();
                    });
                    notification.css('transform', 'translateX(110%)');
                }
            }

            await delay(100);
            notification
                .css('transform', 'translateX(0)')
                .find('.inject-notification-close')
                .one('click', close);
            await delay(duration);
            close();
        }
        injectStyle();
        window.$notificate = notificate;
    }

    inject();

    const complete = window.sessionStorage.getItem('complete');

    if (complete) {
        window.$notificate('提示', '评教完成，请关闭脚本。');
        return;
    } else if (url.endsWith('.jsp')) {
        window.confirm('开始评教?') && $('.wap a')[1].click();
    } else if (url.includes('xspj_find.do')) {
        const links = $('tr').eq(2).find('td').eq(-1).find('a');
        if (!links.length) {
            window.$notificate('提示', '暂无评教，请关闭脚本。');
        } else {
            links[0].click();
        }
    } else if (url.includes('xspj_list.do')) {
        toEvaluateTeaching();
    } else if (url.includes('xspj_edit.do')) {
        autoEvaluate();
    }

    async function toEvaluateTeaching() {
        const list = Array.from($('tr td a')).filter(a => a.innerText.includes('评价'));
        const nextBtn = $('#PagingControl1_btnNextPage').get(0);
        const hasNext = nextBtn.getAttribute('disabled') !== "disabled";
        if ((!list.length && !hasNext)) {
            window.sessionStorage.setItem('complete', true);
            window.$notificate('提示', '评教完成，请关闭脚本。');
            return;
        }
        window.$notificate('提示', '浏览器可能会阻止新窗口，请注意开启', 5000);
        const count = $('.Nsb_r_list_fy3 span').html().trim().slice(1, 2);
        const cur = $('#pageIndex').val();
        window.$notificate('提示', `正在评教 ${cur} / ${count}，请等待。`);
        for (const a of list) {
            a.click();
            // 等待 1000ms 防止浏览器窗口拦截
            await delay(1000);
        }
        if (hasNext) {
            nextBtn.click();
        } else {
            window.location.reload();
        }
    }

    async function autoEvaluate() {
        window.alert = () => true;
        window.confirm = () => true;
        $('#table1 tbody tr td:odd')
            .find('input:first-child')
            .click().end().eq(0).find('input:nth-child(3)').click();
        $('#tj').click();
        await delay(100);
        window.close();
    }
})();