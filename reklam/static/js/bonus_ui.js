/* =========================================================
   BONUS LIST (middle section)
   Model fields used: baslik, video, miktar, aciklama, tiklama_url, tag?, onde?
   ========================================================= */
(function(){
  var allBonuses = [];
  var activeTag = "all";

  // map API item -> UI fields (Turkish keys)
  function mapItem(it){
    return {
      img: it.video || "",                          // gif/webp url
      amount: it.miktar || "30.000 ₺",              // miktar
      title: it.baslik || "500% FREEBET",           // baslik
      desc: it.aciklama || "Hoşgeldin Bonusu",      // aciklama
      url: it.tiklama_url || "#",                   // tiklama_url
      tag: (it.tag || "all").toLowerCase(),         // tag (optional in as_dict)
      featured: !!it.onde                            // onde (optional in as_dict)
    };
  }

  function renderHeroFromFirst(list){
    if(!list.length) return;
    var f = list[0];
    var brand = (f.title || "").split(" ")[0] || "Kingroyal";
    $(".hero-title").html(`<span class="brand">${brand}</span> ${f.amount} Bonus`);
    $("#hero-cta").attr("href", f.url);
    $("#sticky-promo .promo-title").text(`${brand} ${f.amount} Bonus`);
    $("#sticky-cta").attr("href", f.url);
    $("#sticky-promo").prop("hidden", false);
  }

  function renderPills(list){
    var $row = $("#pill-row").empty();
    // Show featured first if available
    var pills = list
      .slice() // copy
      .sort(function(a,b){ return (b.featured|0) - (a.featured|0); })
      .slice(0, 8);

    pills.forEach(function(b){
      var $pill = $(`
        <div class="pill-card">
          <div class="pill-top">
            <div class="pill-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
              </svg>
              <span>${b.amount}</span>
            </div>
          </div>
          <div class="relative h-12 mt-1">
            <img class="pill-img" src="${b.img}" alt="${b.title}">
          </div>
          <div class="pill-bottom">
            <a class="btn-cta small" href="${b.url}" target="_blank" rel="noopener">Bonusu Al</a>
          </div>
        </div>
      `);
      $row.append($pill);
    });
  }

  function renderList(list){
    var $list = $("#bonus-list").empty();
    list.forEach(function(b){
      var $row = $(`
        <div class="row">
            <img class="row-img" src="${b.img}" alt="${b.title}">
            <div class="row-text">
              <div class="row-amount">${b.amount}</div>
              <div class="row-desc">${b.desc}</div>
          </div>
          <a class="btn-cta" href="${b.url}" target="_blank" rel="noopener">Bonusu Al</a>
        </div>
      `);
      $list.append($row);
    });
  }

  function applyFilter(){
    var q = ($("#bonus-search").val() || "").toLowerCase();
    var filtered = allBonuses.filter(function(b){
      var okTag = (activeTag === "all") || (b.tag === activeTag);
      var okSearch = !q || b.title.toLowerCase().includes(q);
      return okTag && okSearch;
    });
    renderList(filtered);
  }

  function bindUI(){
    $(document).on("click",".seg-pill",function(){
      $(".seg-pill").removeClass("seg-active");
      $(this).addClass("seg-active");
      activeTag = ($(this).data("filter") || "all").toLowerCase(); // all|trend|guncel
      applyFilter();
    });
    $("#bonus-search").on("input", applyFilter);
  }

  function loadBonuses(){
    $.getJSON("/api/bonuses/", function(data){
      var arr = (data && data.results) || [];
      allBonuses = arr.map(mapItem);
      renderHeroFromFirst(allBonuses);
      renderPills(allBonuses);
      renderList(allBonuses);
      bindUI();
    }).fail(function(xhr){
      console.error("Failed to load bonuses", xhr.status, xhr.responseText);
    });
  }

  $(function(){
    if ($("#bonus-ui").length) loadBonuses();
  });
})();

/* =========================================================
   TOP PILL CAROUSEL (header carousel)
   Exactly 3 items per rotation (page-based, not free scroll)
   ========================================================= */
(function(){
  var perPage = 3; // fixed group size

  function mapItem(it){
    return {
      img: it.video || "",
      amount: it.miktar || "30.000 ₺",
      title: it.baslik || "500% FREEBET",
      url: it.tiklama_url || "#",
      featured: !!it.onde
    };
  }

  function chunk(list, size){
    var pages = [];
    for (var i = 0; i < list.length; i += size){
      pages.push(list.slice(i, i + size));
    }
    return pages;
  }

  function renderTopPills(items){
    var $viewport = $("#pill-row-top").empty(); // treat this as the viewport
    // sort + take up to 12
    var sorted = items.slice().sort(function(a,b){ return (b.featured|0) - (a.featured|0); }).slice(0,12);

    var pages = chunk(sorted, perPage);
    if (!pages.length) { $("#pill-dots").empty(); return; }

    // build track with pages
    var $track = $('<div class="pill-track" />');
    pages.forEach(function(page){
      var $page = $('<div class="pill-page"><div class="pill-page-grid"></div></div>');
      var $grid = $page.find(".pill-page-grid");
      page.forEach(function(b){
        var $pill = $(`
          <div class="pill-card">
            <div class="pill-head">👑 ${b.amount}</div>
            <div class="pill-img-wrap">
              <img class="pill-img" src="${b.img}" alt="${b.title}">
            </div>
            <div class="pill-foot">
              <a href="${b.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">Bonusu Al ⚡</a>
            </div>
          </div>
        `);
        $grid.append($pill);
      });
      $track.append($page);
    });

    $viewport.append($track);
    buildDots($viewport, $track, pages.length);
  }

  function buildDots($viewport, $track, pageCount){
    var $dots = $("#pill-dots").empty();
    var current = 0;

    for (var i=0; i<pageCount; i++){
      $dots.append(`<span class="pill-dot${i===0?' active':''}" data-page="${i}"></span>`);
    }

    function goTo(p){
      current = Math.max(0, Math.min(pageCount-1, p));
      $track.css('transform', 'translateX(' + (-current * 100) + '%)');
      $dots.children().removeClass('active').eq(current).addClass('active');
    }

    // dot clicks
    $dots.off('click', '.pill-dot').on('click', '.pill-dot', function(){
      var page = Number($(this).data('page') || 0);
      goTo(page);
    });

    // resize guard (pages are 100% width; no recalculation needed)
    $(window).off('resize.pilltrack').on('resize.pilltrack', function(){ goTo(current); });

    goTo(0);
  }

  function loadTopPills(){
    if (!$("#pill-row-top").length) return;
    $.getJSON("/api/bonuses/", function(data){
      var arr = (data && data.results) || [];
      renderTopPills(arr.map(mapItem));
    }).fail(function(xhr){
      console.error("Failed to load top pills", xhr.status, xhr.responseText);
    });
  }

  $(function(){ loadTopPills(); });
})();
