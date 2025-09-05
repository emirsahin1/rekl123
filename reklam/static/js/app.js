(function () {
    function isMobile() {
        return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    }

    function renderAds(ads) {
        var $list = $('#reklam-liste');
        $list.empty();

        if (!ads || !ads.length) {
            $list.append('<p></p>');
            return;
        }
        ads.forEach(function (ad) {
            var video = ad.video ? `<video class="reklam-video" src="${ad.video}" type="video/webm" muted playsinline autoplay></video>` : '';

            var $card = $(`
            <a class="reklam-card" href="${ad.tiklama_url}" target="_blank" rel="noopener noreferrer"">
            ${video}
            </div>
            </a>
    `);
            $list.append($card);
        });
    }


    function loadAds() {
        $.getJSON('/api/reklamlar/', function (data) {
            renderAds((data && data.results) || []);
        }).fail(function (xhr) {
            console.error('Failed to load ads', xhr.status, xhr.responseText);
            renderAds([]);
        });
    }

    function init() {
        if (isMobile()) {
            loadAds();
        }
    }

    $(document).ready(init);
    $(window).on('resize', function () {
        if (isMobile() && $('#reklam-liste').children().length === 0) {
            loadAds();
        }
    });
})();