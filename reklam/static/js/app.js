(function () {
  function isMobile() {
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  }

  // --- state for sequential popups ---
  var popupQueue = [];
  var popupIndex = 0;

  // ----- RENDER ADS -----
  function renderAds(ads) {
    var $list = $('#reklam-liste');
    $list.empty();

    if (!ads || !ads.length) {
      $list.append('<p></p>');
      return;
    }

    ads.forEach(function (ad) {
      var src = ad.media || ad.video || '';
      var media = src ? `<img class="reklam-video" src="${src}" alt="${ad.baslik || 'Reklam'}">` : '';

      var $card = $(`
        <a class="reklam-card" href="${ad.tiklama_url}" target="_blank" rel="noopener noreferrer">
          <button class="x_button ad-close" aria-label="Kapat">&times;</button>
          <div class="tikla_button">Tıkla!</div>
          ${media}
        </a>
      `);

      $list.append($card);
    });
  }

  // ----- POPUP HELPERS -----
  function pickTwoDistinct(list) {
    // return up to 2 unique items randomly
    if (!list || !list.length) return [];
    if (list.length === 1) return [list[0]];

    var i = Math.floor(Math.random() * list.length);
    var j;
    do { j = Math.floor(Math.random() * list.length); } while (j === i);

    return [list[i], list[j]];
  }

  function renderPopup(popup) {
    $('#popup-overlay').remove();
    if (!popup) return;

    var popupImg = popup.resim || popup.media || popup.video || '';
    var popupUrl = popup.tiklama_url || '#';
    var popupTitle = popup.ad || popup.baslik || 'Popup';

    var $overlay = $(`
      <div id="popup-overlay" role="dialog" aria-label="${popupTitle}">
        <div class="popup-backdrop"></div>
        <div class="popup-card">
          <button class="popup-close x_button" aria-label="Kapat">&times;</button>
          <a class="popup-link" href="${popupUrl}" target="_blank" rel="noopener noreferrer">
            <img class="popup-image" src="${popupImg}" alt="${popupTitle}">
          </a>
        </div>
      </div>
    `);

    $('body').append($overlay);
    setTimeout(function () { $overlay.addClass('open'); }, 10);
  }

  function showNextPopup() {
    var popup = popupQueue[popupIndex] || null;
    if (popup) {
      renderPopup(popup);
    } else {
      // no more popups, show the follow-up UI
      showPostPopupUI();
    }
  }

    function showPostPopupUI() {
        $('#popup-overlay').remove();
        const $list = $('#reklam-liste');
        $list.empty()
        const $mobileAds = $('#mobile-ads');
        $mobileAds.empty().append('<div id="post-popup-ui" class="post-popup"></div>');
        $mobileAds.css('background-color', '#0f172a');


        $.get('/partials/bonus-list/', function (html) {
            $('#post-popup-ui').html(html);
        }).fail(function (xhr) {
            console.error('Failed to load partial', xhr.status, xhr.responseText);
        });
    }


  // ----- LOAD POPUPS & START SEQUENCE -----
  function startPopupSequence() {
    $.getJSON('/api/popups/', function (data) {
      var list = (data && data.results) || [];
      popupQueue = pickTwoDistinct(list);
      popupIndex = 0;
      showNextPopup();
    }).fail(function (xhr) {
      console.error('Failed to load popups', xhr.status, xhr.responseText);
      showPostPopupUI(); // fallback
    });
  }

  // ----- LOAD ADS -----
  function loadAds() {
    $.getJSON('/api/reklamlar/', function (data) {
      renderAds((data && data.results) || []);
    }).fail(function (xhr) {
      console.error('Failed to load ads', xhr.status, xhr.responseText);
      renderAds([]);
    });
  }

  // ----- INIT -----
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

  // ----- EVENTS -----
  // Clicking any ad X removes ALL ads and begins popup sequence
  $(document).on('click', '.ad-close', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#reklam-liste').empty();
    startPopupSequence();
  });

  // Close current popup (either X or backdrop)
  $(document).on('click', '#popup-overlay .popup-close, #popup-overlay .popup-backdrop', function (e) {
    e.preventDefault();
    $('#popup-overlay').remove();
    popupIndex += 1;
    showNextPopup();
  });
})();
