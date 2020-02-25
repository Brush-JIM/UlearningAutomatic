// ==UserScript==
// @name         优学院自动静音播放、自动做练习题、自动翻页、修改播放速率
// @namespace    [url=mailto:moriartylimitter@outlook.com]moriartylimitter@outlook.com[/url]
// @version      1.4.3
// @description  自动静音播放每页视频、自动作答、修改播放速率!
// @author       EliotZhang、Brush-JIM
// @match        *://*.ulearning.cn/learnCourse/*
// @updateURL    https://raw.githubusercontent.com/ZhangEliot/UlearningAutomatic/master/ulearning.js
// @downloadURL  https://raw.githubusercontent.com/ZhangEliot/UlearningAutomatic/master/ulearning.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    /*  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     *  优学院自动静音播放、自动做练习题、自动翻页、修改播放速率脚本v1.4.3由EliotZhang、Brush-JIM @ 2020/02/25 最后更新
     *  特别感谢Brush-JIM (Mail:Brush-JIM@protonmail.com) 提供的脚本改进支持！
     *  使用修改播放速率功能请谨慎！！！产生的不良后果恕某概不承担！！！
     *  请保持网课播放页面在浏览器中活动，避免长时间后台挂机（平台有挂机检测功能），以减少不必要的损失
     *  如果您不需要自动静音功能，请将EnableAutoMute赋值为false
     *  如果您不需要自动修改播放速率，请将EnableAutoChangeRate赋值为false
     *  如果你需要改变自动修改的播放速率，请更改本注释下第一行N的赋值(别改的太大，否则可能产生不良后果！！！默认是1.5倍速，这是正常的！！！最大为15.0，否则可能失效！！！)
     *  自动作答功能由于精力有限目前只支持单/多项选择、判断题、部分填空问答题，如果出现问题请尝试禁用这个功能：将EnableAutoFillAnswer赋值为false
     *  如果脚本无效请优先尝试刷新页面，若是无效请查看脚本最后的解决方案，如果还是不行请反馈给本人，本人将会尽快修复
     *  如果是因为网络问题，本人也无能为力
     *  如果在使用中还有什么问题请通过邮箱联系EliotZhang：moriartylimitter@outlook.com
     *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */

    // 自动修改的倍率
    var N = 1.50;
    // 将下面AutoFillAnswer赋值为false可以禁用自动作答功能！
    var EnableAutoFillAnswer = true;
    // 将下面EnableAutoMuted赋值为false可以禁用自动静音功能！
    var EnableAutoMute = true;
    // 将下面EnableAutoChangeRate赋值为false可以禁用自动修改速率功能！
    var EnableAutoChangeRate = true;

    // 新增函数 By Brush-JIM
    function Video(func = {}, slept = false) {
        if (autoAnswer) {
            setTimeout(function () {
                Video({}, true);
            }, '1000');
            return;
        }
        if (!slept) {
            setTimeout(function () {
                Video({}, true);
            }, '1000');
            return;
        }
        var A_tmp = $('video');
        var A = [];
        for (let d = 0; d < A_tmp.length; d++) {
            if (A_tmp[d].src != "") {
                A.push(A_tmp[d]);
            }
        }
        if (A.length === 0) {
            GotoNextPage();
            return;
        }
        var B = [];
        var tmp = $('div[class="video-bottom"]');
        for (let b = 0; b < tmp.length; b++) {
            let span = tmp[b].getElementsByTagName("span")[0];
            if (span) {
                let data_bind = span.getAttribute('data-bind');
                if (data_bind == 'text: $root.i18nMessageText().finished' || data_bind == 'text: $root.i18nMessageText().viewed' || data_bind == 'text: $root.i18nMessageText().unviewed') {
                    B.push(data_bind);
                }
            }
        }

        function video_ctrl(func) {
            for (let c = 0; c < A.length; c++) {
                if (B[c] == 'text: $root.i18nMessageText().viewed' || B[c] == 'text: $root.i18nMessageText().unviewed' || B[c] === false) {
                    if (c - 1 >= 0) {
                        if (A[c - 1].currentTime != 0) {
                            if (A[c - 1].paused === true) {
                                A[c - 1].play()
                            }
                            if (EnableAutoMute && A[c - 1].muted === false) {
                                A[c - 1].muted = true;
                            }
                            if (EnableAutoChangeRate && A[c - 1].playbackRate != N) {
                                A[c - 1].playbackRate = N
                            }
                            break;
                        }
                    }
                    if (A[c].paused === true) {
                        A[c].play();
                    }
                    if (EnableAutoMute && A[c].muted === false) {
                        A[c].muted = true;
                    }
                    if (EnableAutoChangeRate && A[c].playbackRate != N) {
                        A[c].playbackRate = N;
                    }
                    break;
                }
            }
            if (B[B.length - 1] == 'text: $root.i18nMessageText().finished' || B[B.length - 1] === true) {
                if (A[A.length - 1].currentTime != 0) {
                    if (A[A.length - 1].paused === true) {
                        A[A.length - 1].play()
                    }
                    if (EnableAutoMute && A[A.length - 1].muted === false) {
                        A[A.length - 1].muted = true
                    }
                    if (EnableAutoChangeRate && A[A.length - 1].playbackRate != N) {
                        A[A.length - 1].playbackRate = N
                    }
                    setTimeout(func, "2000", func);
                } else {
                    GotoNextPage();
                }
            } else {
                setTimeout(func, "2000", func);
            }
        }
        if (A.length == B.length) {
            video_ctrl(Video);
        } else {
            B = [];
            for (let d = 0; d < A.length; d++) {
                B[d] = false;
                A[d].addEventListener("ended", function () {
                    B[d] = true;
                }, true);
            }
            video_ctrl(video_ctrl);
        }
    }

    function GotoNextPage() {
        if (autoAnswer)
            return;
        var nextPageBtn = $('.mobile-next-page-btn, .next-page-btn next-page-btn cursor');
        if (nextPageBtn.length === 0)
            return;
        nextPageBtn.each((k, n) => {
            n.click();
        });
        setTimeout(Video, "500");
    }

    function CheckModal() {
        if (autoAnswer)
            return;
        var continueBtn = $('.btn-submit');
        if (continueBtn.length > 0)
            continueBtn.each((k, v) => {
                if ($(v).text() != '提交')
                    $(v).click();
            });
        var qw = $('.question-wrapper');
        if (qw.length > 0 && EnableAutoFillAnswer) {
            ShowAndFillAnswer();
            return;
        }
        var alertModal = document.getElementById("alertModal");
        if (alertModal === undefined)
            return;
        if (alertModal.className.match(/\sin/)) {
            var op = alertModal.children[0].children[0].children[2].children[1].children[1].children[0];
            if (!EnableAutoFillAnswer)
                op = alertModal.children[0].children[0].children[2].children[1].children[1].children[1];
            if (op === undefined)
                return;
            op.click();
            if (EnableAutoFillAnswer)
                ShowAndFillAnswer();
        }
        var statModal = $('#statModal');
        if (statModal.length > 0) {
            var ch = statModal[0];
            ch.getElementsByTagName('button');
            if (ch.length >= 2)
                ch[1].click();
        }
    }

    function RemoveDuplicatedItem(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }

    function FillAnswers() {
        if (!autoAnswer)
            return;
        var ansarr = [];
        var idList = [];
        var re = [];
        var txtAreas = $('textarea, .blank-input');
        $(txtAreas).each((k, v) => {
            var reg = /question\d+/;
            var fa = $(v).parent();
            while (!reg.test($(fa).attr('id'))) {
                fa = $(fa).parent();
            }
            var id = $(fa).attr('id').replace('question', '');
            idList.push(id);
        });
        idList = RemoveDuplicatedItem(idList);
        $(idList).each((k, id) => {
            $.ajax({
                async: false,
                type: "get",
                url: 'https://api.ulearning.cn/questionAnswer/' + id,
                datatype: 'json',
                success: function (result) {
                    re.push(result.correctAnswerList);
                }
            });
        });

        $(re).each((k1, v1) => {
            if (v1.length == 1) {
                ansarr.push(v1[0]);
            } else {
                $(v1).each(function (k2, v2) {
                    ansarr.push(v2);
                });
            }
        });
        $(txtAreas).each((k, v) => {
            $(v).trigger('click');
            v.value = ansarr.shift();
            $(v).trigger('change');
        });
    }

    function ShowAndFillAnswer() {
        if (autoAnswer)
            return;
        autoAnswer = true;
        var sqList = [];
        var qw = $('.question-wrapper');
        var an = [];
        qw.each(function (k, v) {
            var id = $(v).attr('id');
            sqList.push(id.replace('question', ''));
        });
        if (sqList.length <= 0) {
            autoAnswer = false;
            return;
        }
        $(sqList).each(function (k, id) {
            $.ajax({
                async: false,
                type: "get",
                url: 'https://api.ulearning.cn/questionAnswer/' + id,
                datatype: 'json',
                success: function (result) {
                    an.push(result.correctAnswerList);
                }
            });
        });
        var t = qw.find('.question-title-html');
        t.each(function (k, v) {
            var ans = an.shift();
            $(v).after('<span style="color:red;">答案：' + ans + '</span>');
            an.push(ans);
        });
        var checkBox = qw.find('.checkbox');
        var choiceBox = qw.find('.choice-btn');
        var checkList = [];
        var choiceList = [];
        let lasOffsetP = '';
        checkBox.each((k, cb) => {
            if (lasOffsetP == $(cb).offsetParent().attr('id')) {
                checkList[checkList.length - 1].push(cb);
            } else {
                var l = [];
                l.push(cb);
                checkList.push(l);
                lasOffsetP = $(cb).offsetParent().attr('id');
            }
        });
        lasOffsetP = '';
        choiceBox.each((k, cb) => {
            if (lasOffsetP == $(cb).offsetParent().attr('id')) {
                choiceList[choiceList.length - 1].push(cb);
            } else {
                var l = [];
                l.push(cb);
                choiceList.push(l);
                lasOffsetP = $(cb).offsetParent().attr('id');
            }
        });
        an.forEach(a => {
            if (a.length <= 0) {
                return;
            }
            if (a[0].match(/[A-Z]/) && a[0].length == 1) {
                var cb = checkList.shift();
                a.forEach(aa => {
                    $(cb[aa.charCodeAt() - 65]).click();
                });
            } else if (a[0].match(/(true|false)/)) {
                var ccb = choiceList.shift();
                a.forEach(aa => {
                    if (aa == 'true')
                        ccb[0].click();
                    else
                        ccb[1].click();
                });
            }
            return;

        });
        FillAnswers();
        $('.btn-submit').click();
        var A_tmp = $('video');
        var A = [];
        for (let d = 0; d < A_tmp.length; d++) {
            if (A_tmp[d].src != "") {
                A.push(A_tmp[d]);
            }
        }
        if (A.length === 0) {
            autoAnswer = false;
            GotoNextPage();
            return;
        }
        autoAnswer = false;
    }

    function Main() {
        Video();
        setInterval(CheckModal, "1000");
    }

    var autoAnswer = false;

    // 如果脚本无效则有可能是网络问题，请尝试修改下面的3000为更大数值，或者换个网络负荷小的时候重试！
    setTimeout(Main, "5000");

})();