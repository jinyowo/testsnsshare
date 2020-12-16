/* onstage 10th promotion js */

// DOMContentLoaded
$(() => {
    // step1
    const $step1Container = $('[data-step1-container]');
    const $conceptList = $('[data-concept-list]');

    // step2
    const $step2Container = $('[data-step2-container]');
    const $backBtn = $('[data-back-btn]');
    const $decoContainer = $('[data-deco-container]');
    const $tabList = $('[data-tab-list]');
    const $itemBox = $('[data-items]');
    const $onstageItems = $('[data-items="onstage"]');
    const $conceptItems = $('[data-items="concept"]');
    const $cubeColors = $('[data-items="cube"]');
    const $cubeItem = $('[data-cube-item]');
    const $shareArea = $('[data-share-area]');
    const $noticeArea = $('[data-notice-area]');
    const $downloadBtn = $('[data-download-btn]');
    const $shareBtn = $('[data-share-btn]');
    const $shareList = $('[data-share-list]');
    const $downloadPopup = $('[data-download-popup]');
    const $downloadPopupCloseBtn = $('[data-close-popup-btn]');
    const onstageItemClassName = 'onstage_item';
    const conceptItemClassName = 'cc_items';
    const decoItemAttributeName = 'data-move-target';

    // 선택한 concopt index
    let conceptIndex = 0;

    // SNS 공유 관련 값
    const snsInfo = {
        imageUrl: '',
        kakao: {
            key: '02642af8e793f63e38a6e18200a091a7'
        }
    };

    /** 
     * toggle item 
     */
    const toggleItem = (event, className) => {
        const $targetItem = $(event.currentTarget);
        const targetIndex = $targetItem.data('index');

        if($decoContainer.children(`.${className}[data-index="${targetIndex}"]`).length != 0) {
            $decoContainer.children(`.${className}[data-index="${targetIndex}"]`).remove();
        } else {
            const $cloneDOM = $($targetItem.clone());

            // drag-and-drop 전용 attribute, css 추가
            $cloneDOM.attr(decoItemAttributeName, '');
            $cloneDOM.css('touch-action', 'none');
            $cloneDOM.css('user-select', 'none');
            $decoContainer.append($cloneDOM.get(0));
        }
    }

    /** 
     *  drag-and-drop 기능 추가 
     *  interact.js (https://interactjs.io/)
     */
    const initInteract = () => {
        interact(`[${decoItemAttributeName}]`)
            .draggable({
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                    })
                ],
                listeners: {
                    move: (event) => {
                        const $target = $(event.target);
                        const x = (parseFloat($target.attr('data-x')) || 0) + event.dx;
                        const y = (parseFloat($target.attr('data-y')) || 0) + event.dy;
                    
                        $target.css('webkitTransform', `translate(${x}px, ${y}px)`);
                        $target.css('transform', `translate(${x}px, ${y}px)`);
                        $target.attr('data-x', x).attr('data-y', y);
                    }
                }
            });
    };

    /**
     * 이미지 저장(PC, Android)
     */
    const saveAs = (url, name) => {
        const link = document.createElement('a');
        link.download = name;
        link.href = url.replace('image/png', 'image/octet-stream')
        link.click();
    }

    /**
     * 이미지 다운로드 팝업 노출(IOS)
     */
    const showImagePopup = (url) => {
        const $imageArea = $downloadPopup.find('img')
        $imageArea.attr('src', url);
        $('#wrap').addClass('scroll_hide');
        $downloadPopup.css('display', 'block');
    }

    /** 
     * canvert base64 to file object
     * (https://stackoverflow.com/a/38936042)
     */
    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, { type: mime });
    }

    initInteract();

    // 뷰 전환 (step1 -> step2)
    $conceptList.on('click', 'li', (event) => {
        event.preventDefault();
        
        const $conceptItem = $(event.currentTarget);
        conceptIndex = $conceptItem.data('index');

        $conceptItem.addClass('on');
        $decoContainer.addClass(`bg_concept${conceptIndex}`);
        $conceptItems.find(`.concept${conceptIndex}_box`).show();

        $step1Container.hide();
        $step2Container.show();
        $backBtn.show();
    });

    // back (step2 -> step1)
    $backBtn.on('click', (event) => {
        $conceptList.find('li').removeClass('on');
        $decoContainer.removeClass(`bg_concept${conceptIndex}`);
        $conceptItems.find(`.concept${conceptIndex}_box`).hide();

        $tabList.find('li').each((index, item) => {
            if (index === 0) {
                $(item).attr('aria-selected', 'true');
                $itemBox.eq(index).show();
            } else {
                $(item).attr('aria-selected', 'false');
                $itemBox.eq(index).hide();
            }
        })

        // 요소들 초기화
        $decoContainer.children(`[${decoItemAttributeName}]`).remove();
        $cubeColors.find('button').removeClass('on');
        $cubeColors.find('button').eq(0).addClass('on');
        $cubeItem.removeClass().addClass('cube_box color1');
        $cubeItem.hide();
        $shareArea.hide();
        $noticeArea.hide();

        // 뷰 전환
        $backBtn.hide();
        $step2Container.hide();
        $step1Container.show();
    })

    // tab
    $tabList.on('click', 'li', (event) => {
        const $clickItem = $(event.currentTarget);
        var controlItemID = $clickItem.attr('aria-controls');

        $tabList.find('li').attr('aria-selected', 'false');
        $itemBox.hide();
        $itemBox.filter(`[data-items="${controlItemID}"]`).show();
        $clickItem.attr('aria-selected', 'true');
    
        if (controlItemID == 'cube') {
            $cubeItem.show();
            $shareArea.show();
            $noticeArea.show();
        }
    })

    // cube color button
    $cubeColors.on('click', 'button', (event) => {
        const $cubeColor = $(event.currentTarget);
        const colorClass = `color${$cubeColor.data('color')}`;

        $cubeColors.find('button').removeClass('on');
        $cubeColor.addClass('on');
        $cubeItem.removeClass().addClass('cube_box '+ colorClass);
    })

    // onstage item toggle
    $onstageItems.on('click', `.${onstageItemClassName}`, (event) => {
        toggleItem(event, onstageItemClassName);
    })

    // concept item toggle
    $conceptItems.on('click', `.${conceptItemClassName}`, (event) => {
        toggleItem(event, conceptItemClassName);
    })

    $shareBtn.on('click', () => {
        $shareBtn.toggleClass('on');
    })

    $shareList.on('click', 'a', (event) => {
        event.preventDefault();

        const snsType = $(event.currentTarget).data('sns-type');
        const url = encodeURIComponent(location.href) // 임시 location.href;

        

        if (snsType === 'instagram') {
            // Instagram: 앱 이동

        } else if (snsType === 'facebook') {
            // Facebook: 링크 공유 게시글 작성
            $('meta[property="og:image"]').attr('content', 'https://jinyowo.github.io/testsnsshare/img/concept/img_concept2.jpg');
			window.open(`http://www.facebook.com/sharer/sharer.php?u=${url}`);
        } else if (snsType === 'kakao') {
            // KakaoTalk: 링크 공유 메시지 작성

            if (!Kakao.isInitialized()) {
                // key 인증
                Kakao.init(snsInfo.kakao.key);
            }
            
            // html 영역에 대해 canvas로 변환하여 이미지 url 추출
            html2canvas($decoContainer.get(0), { scale: 1 })
                .then(canvas => {
                    const imageUrl = canvas.toDataURL('image/png');
                    
                    // 카카오링크용 이미지 업로드 (https://developers.kakao.com/docs/latest/ko/message/js#upload-image)
                    Kakao.Link.uploadImage({
                        file: [dataURLtoFile(imageUrl, 'sample.png')]
                    }).then(function (res) {
                        const uploadedImage = res.infos.original.url;

                        // 카카오링크 메시지 보내기 (https://developers.kakao.com/docs/latest/ko/message/js#link-send)
                        Kakao.Link.sendDefault({
                            objectType: 'feed',
                            content: {
                                title: '[제목] 디저트 사진',
                                description: '[설명] 아메리카노, 빵, 케익',
                                imageUrl: uploadedImage,
                                link: {
                                    mobileWebUrl: url,
                                    webUrl: url,
                                },
                            },
                        });
                    });
                });
		} else if (snsType === 'band') {
            // Naver Band: 링크 공유 게시글 작성
            window.open(`https://band.us/plugin/share?body=${url}&route=${url}`);
        }
    });

    $downloadBtn.on('click', (event) => {
        const captureTarget = $decoContainer.get(0);
        
        // html 영역에 대해 canvas로 변환하여 이미지 url 추출
        html2canvas(captureTarget, { scale: 1 })
            .then(canvas => {
            const url = canvas.toDataURL('image/png');
            
            if (window.navigator.userAgent.toLowerCase().indexOf('iphone') > 0) { 
                // IOS
                showImagePopup(url);
            } else { 
                // PC, Android
                saveAs(url, 'capture.png');
            }
        });
    })

    $downloadPopupCloseBtn.on('click', () => {
        $('#wrap').removeClass('scroll_hide');
        $downloadPopup.css('display', 'none');
    })
})