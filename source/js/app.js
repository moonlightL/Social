;
(function($) {
    "use strict";

    let APP = {
        plugins: {
            APlayer: {
                css: baseLink + "/source/js/APlayer/APlayer.min.css",
                js: baseLink + "/source/js/APlayer/APlayer.min.js"
            },
            highlight: {
                js: baseLink + "/source/js/highlightjs/highlight.pack.js"
            },
            share: {
                js: baseLink + "/source/js/overshare/js/social-share.min.js"
            },
            aos: {
                js: baseLink + "/source/js/aos/aos.min.js"
            },
            toc: {
                js: baseLink + "/source/js/toc.js"
            },
            affix: {
                js: baseLink + "/source/js/affix.js"
            },
            hideseek: {
                js: baseLink + "/source/js/jquery.hideseek.min.js"
            }
        }
    };

    console.log("%c Theme." + themeName + " v" + version + " %c https://www.extlight.com/ ", "color: white; background: #e9546b; padding:5px 0;", "padding:4px;border:1px solid #e9546b;");

    $.ajaxSetup({
        cache: true
    });


    const toTopEvent = function() {
        let $toTop = $("#to-top");
        $(window).scroll(function(e) {
            let scrollTop = $(document).scrollTop();
            if (scrollTop > 1000) {
                $toTop.css({"opacity": 1});
            } else {
                $toTop.css({"opacity": 0});
            }
        });

        $toTop.off("click").on("click",function() {
            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 10);
        });
    };

    const loadLazy = function() {
        $("img.lazy-load").lazyload({
            placeholder : baseLink + "/source/images/loading.gif",
            effect: "fadeIn"
        });
    };

    const modeEvent = function() {
        let theme = localStorage.getItem('data-theme');
        let style = document.getElementById("style-switch");

        let changeThemeToDark = () => {
            document.documentElement.setAttribute("data-theme", "dark");
            style.setAttribute('href', '/theme/Social/source/css/style-dark.css');
            localStorage.setItem("data-theme", "dark");
        };

        let changeThemeToLight = () => {
            document.documentElement.setAttribute("data-theme", "light");
            style.setAttribute('href', '/theme/Social/source/css/style.css');
            localStorage.setItem("data-theme", 'light');
        };

        if(theme === 'dark'){
            changeThemeToDark()
        } else if (theme == null || theme === 'light' ) {
            changeThemeToLight();
        }

        $("#darkModeSwitch").off("click").on("click", function() {
            let theme = localStorage.getItem('data-theme');
            if (theme ==='dark'){
                changeThemeToLight()
            } else{
                changeThemeToDark()
            }
        });
    };

    const searchEvent = function() {
        $.getScript(APP.plugins.hideseek.js, function() {
            $("#keyword").hideseek({
                highlight: true,
                nodata: '没有相应数据'
            });
        });
    };

    const aosEvent = function() {
        $.getScript(APP.plugins.aos.js, function() {
            AOS.init({
                offset: 200,
                duration: 600,
                easing: 'ease-in-sine',
                delay: 100,
            });
        });
    };

    const archiveEvent = function() {
        let archiveBody = $("#archive-body");
        let loadText = $("#load-text");
        $("#archive-load").off("click").on("click", function() {
            let that = $(this);
            let pageNum = that.data("page");
            if (pageNum <= 0) {
                return;
            }
            loadText.text("加载中...")
            $.ajax({
                "type": "POST",
                "url": "/loadArchive/" + pageNum,
                "dataType": "JSON",
                "success": function(resp) {
                    if (resp.success) {
                        let pageInfo = resp.data;
                        loadText.text("加载更多")
                        if (!pageInfo.hasNextPage) {
                            that.data("page", -1);
                            loadText.text("文章见底了~~");
                        } else {
                            that.data("page", pageNum + 1);
                        }

                        for (let key in pageInfo.data) {
                            let list = pageInfo.data[key];
                            let archiveItem = $("#year-" + key);
                            if (archiveItem.length > 0) {
                                let htmlArr = [];
                                for (let i = 0; i < list.length; i ++) {
                                    let obj = list[i];
                                    htmlArr.push('<li>');
                                    htmlArr.push('<div class="rounded d-sm-flex border-0 mb-1 p-3 position-relative">');
                                    htmlArr.push('<div class="avatar text-center">');
                                    htmlArr.push('<img class="avatar-img rounded-circle lazy-load" data-original="'+obj.coverUrl+'" alt="" src="'+obj.coverUrl+'" style="display: inline;">');
                                    htmlArr.push('</div>');
                                    htmlArr.push('<div class="mx-sm-3 my-2 my-sm-0">');
                                    htmlArr.push('<p class="small mb-2">');
                                    htmlArr.push('<a data-pjax href="/'+obj.link+'">'+obj.title+'</a>');
                                    htmlArr.push('</p>');
                                    htmlArr.push('<a class="btn btn-sm btn-outline-light py-1 me-2" data-pjax="" href="/categories/'+obj.categoryName+'/">'+obj.categoryName+'</a>');
                                    htmlArr.push('</div>');
                                    htmlArr.push('<div class="d-flex ms-auto">');
                                    htmlArr.push('<p class="small me-5 text-nowrap">'+obj.month + '月' + obj.day + '日'+'</p>');
                                    htmlArr.push('<div class="position-absolute end-0 top-0 mt-3 me-3">');
                                    htmlArr.push('<a data-pjax href="/'+obj.link+'" class="z-index-1 text-secondary btn position-relative py-0 px-2"><i class="fa fa-bookmark"></i></a>');
                                    htmlArr.push('</div>');
                                    htmlArr.push('</div>');
                                    htmlArr.push('</div>');
                                    htmlArr.push('</li>');

                                }
                                archiveItem.find("ul").append(htmlArr.join(""));
                            } else {
                                let htmlArr = ['<div id="year-' + key + '">'];
                                htmlArr.push('<div class="card-header py-3 border-0 d-flex align-items-center justify-content-between">')
                                htmlArr.push('<h1 class="h5 mb-0">' + key + ' 年</h1>');
                                htmlArr.push('</div>');
                                htmlArr.push('<div class="card-body p-2">');
                                htmlArr.push('<ul class="list-unstyled">');
                                for (let i = 0; i < list.length; i ++) {
                                    let obj = list[i];
                                    htmlArr.push('<li>');
                                    htmlArr.push('<div class="rounded d-sm-flex border-0 mb-1 p-3 position-relative">');
                                    htmlArr.push('<div class="avatar text-center">');
                                    htmlArr.push('<img class="avatar-img rounded-circle lazy-load" data-original="'+obj.coverUrl+'" alt="" src="'+obj.coverUrl+'" style="display: inline;">');
                                    htmlArr.push('</div>');
                                    htmlArr.push('<div class="mx-sm-3 my-2 my-sm-0">');
                                    htmlArr.push('<p class="small mb-2">');
                                    htmlArr.push('<a data-pjax href="/'+obj.link+'">'+obj.title+'</a>');
                                    htmlArr.push('</p>');
                                    htmlArr.push('<a class="btn btn-sm btn-outline-light py-1 me-2" data-pjax="" href="/categories/'+obj.categoryName+'/">'+obj.categoryName+'</a>');
                                    htmlArr.push('</div>');
                                    htmlArr.push('<div class="d-flex ms-auto">');
                                    htmlArr.push('<p class="small me-5 text-nowrap">'+obj.month + '月' + obj.day + '日'+'</p>');
                                    htmlArr.push('<div class="position-absolute end-0 top-0 mt-3 me-3">');
                                    htmlArr.push('<a data-pjax href="/'+obj.link+'" class="z-index-1 text-secondary btn position-relative py-0 px-2"><i class="fa fa-bookmark"></i></a>');
                                    htmlArr.push('</div>');
                                    htmlArr.push('</div>');
                                    htmlArr.push('</div>');
                                    htmlArr.push('</li>');
                                }
                                htmlArr.push('</ul>');
                                htmlArr.push('</div>');
                                htmlArr.push('</div>');
                                archiveBody.append(htmlArr.join(""));
                            }
                        }
                    }
                }
            })
        });
    };

    const dynamicEvent = function() {

        let prizeBtnArr = $(".dynamic-praise-btn");
        prizeBtnArr.each(function(index, domEle) {
            let dynamicId = $(domEle).data("id");
            let key = "dynamic-praise-" + dynamicId;
            let flag = localStorage.getItem(key);
            if (flag) {
                $(domEle).addClass("active");
            }
        });

        prizeBtnArr.off("click").on("click", function() {
            let that = this;
            let dynamicId = $(that).data("id");
            let key = "dynamic-praise-" + dynamicId;
            let flag = localStorage.getItem(key);
            if (flag) {
                return;
            }

            $.ajax({
                "type": "POST",
                "url": "/praiseDynamic/" + dynamicId,
                "success": function(resp) {
                    if (resp.success) {
                        localStorage.setItem(key, "y");
                        $(that).addClass("active").find(".praise-num").text(resp.data);
                    }
                }
            })
        });
    };

    const postEvent = function() {
        let $detail = $("#post-content");
        if ($detail.length > 0) {

            $("#tocBox").show();

            $.getScript(APP.plugins.affix.js, function () {
                let $sidebar = $(".stick-toc");
                $sidebar.affix({ offset: 600});
            });

            $.getScript(APP.plugins.toc.js, function () {
                $(".post-toc").html(tocHelper("#post-content"));
                $('body').scrollspy({ offset: 300, target: '.stick-toc' });
            });

            $.getScript(APP.plugins.highlight.js, function () {
                document.querySelectorAll('figure span').forEach((block) => {
                    hljs.highlightBlock(block);
                });
            });

            let praiseBtn = $("#post-praise-btn");
            let postId = praiseBtn.data("id");
            let key = "post-praise-" + postId;
            let flag = localStorage.getItem(key);
            if (flag) {
                praiseBtn.html("<i class='fa fa-thumbs-up'></i> 已点赞")
            }

            praiseBtn.off("click").on("click", function() {
                if (flag) {
                    return;
                }

                $.ajax({
                    "type": "POST",
                    "url": "/praisePost/" + postId,
                    "success": function(resp) {
                        if (resp.success) {
                            localStorage.setItem(key, "y");
                            praiseBtn.html("<i class='fa fa-thumbs-up'></i> 已点赞")
                        }
                    }
                })
            });

        } else {
            $("#tocBox").hide();
        }
    };

    const pjaxEvent = function() {
        $(document).pjax('a[data-pjax]', '#wrap', {fragment: '#wrap', timeout: 8000});
        $(document).on('pjax:send', function() { NProgress.start();});
        $(document).on('pjax:complete',   function(e) {
            archiveEvent();
            dynamicEvent();
            postEvent();
            NProgress.done();
        });
        $(document).on('pjax:end', function() {
            let $navBar = $("#navBar");
            $navBar.find("a").removeClass("active");
            let $target = $navBar.find("a").filter("[href='" + window.location.pathname + "']");
            $target.addClass("active");
            loadLazy();
            aosEvent();
        });
    };

    $(function() {
        toTopEvent();
        modeEvent();
        searchEvent();

        loadLazy();
        aosEvent();

        archiveEvent();
        dynamicEvent();
        postEvent();
        pjaxEvent();
    });


})(jQuery);