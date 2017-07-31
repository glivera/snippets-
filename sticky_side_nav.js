function initSidebarFunctions() {
	var sidebar = $('.m__sidebar');
	var sidebar_hold = $('.sidebar_hold');
	var sb_position;
	var sb_height;
	var sidebarH = sidebar.height();
	var footer = $('.tm-footer');
	var site = $('.tm-site');
	var firstBlock = $('.tm-primary > *:first-child');
	var header_h = 120;
	var topPadding = 100;
	//stopPosition - отступ сверху чтоб сайдбар был по центру
	var stopPosition = window_h / 2 - sidebarH / 2;
	var footer_h;
	var site_h;
	var firstBlockHeight;
	var sidebarTop;
	var $carousel;
	var sidebarState = false;
	var fixedFooterMod = false;
	var fixedMod = false;
	var past_$scrollTopGl_side;
	var sb_shift;
	var stop_end;
	var breakpoint = 1250;
	var stop_el = false;
	var first_el_reached = false;
	var wide_block_array =[];

	$window.on('load', function () {
		if(sidebar.length) {
			// Add active to parents when it's a subpage.
			$('.sub_sidebar_item').each(function () {
				var $el = $(this);
				if ($el.hasClass('active')) {
					$el.parent().parent().addClass('active');
				}
			});

			$('.tm-primary .sidebarStop, .tm-footer.sidebarStop').each(function () {
				var $el = $(this);

				var sub_array = {
					el: $el,
					el_position: false,
					el_height: false,
					checked: false
				};

				wide_block_array.push(sub_array);
			});

			resize();
			initSidebar();
			initSidebarControl();
			$window.on('resize', $.throttle(16, resize));
		}
	});


	function resize() {
		site_h = site.height();
		sb_position = sidebar_hold.position().top;
		sb_height = sidebar_hold.innerHeight();

		$.each(wide_block_array, function (key, value) {
			value.el_position = value.el.offset().top;
			value.el_height = value.el.innerHeight();
		});

		past_$scrollTopGl_side = false;

		if (window_w < breakpoint) {
			TweenMax.set(sidebar, {clearProps: 'all'});
		}
		anim_f();
	}



  function initSidebarControl() {
    if (sidebar.length) {
      $('.tm-site').append('<div class="sidebarControl">' +
        '<svg width="70" height="70">' +
        '<circle r="35" cx="35" cy="35"' +
        'fill="#FFD713" />' +
        '</svg></div>');
      $('.sidebarControl').on('click', function () {
        var that = $(this);
        if (sidebar.hasClass('open')) {
          that.removeClass('open');
          sidebar.removeClass('open');
        }
        else {
          sidebar.addClass('open');
          that.addClass('open');
        }
      });
    }
  }

	function initSidebar() {

		if (sidebar.length && window_w >= 1249) {
			sidebarState = true;
		}
		else if (sidebarState) {
			sidebarState = false;
		}

		$('.share_link').on('click', function (e) {
		      e.preventDefault();
		      $(this).parent().toggleClass('open');
		    });

		TweenLite.ticker.addEventListener("tick", anim_f);
	}

	function anim_f() {
		if(
			window_w >= breakpoint &&
			past_$scrollTopGl_side !== $scrollTopGl
		){
			stop_end = $scrollTopGl + sb_position + sb_height + 80;

			$.each(wide_block_array, function (key, value) {
				if (
						(first_el_reached === false &&
						wide_block_array[key+1].el_position - (value.el_position + value.el_height) > sb_height + 80) ||
						(first_el_reached === key &&
						wide_block_array[first_el_reached+1].el_position - (value.el_position + value.el_height) > sb_height + 80 &&
						wide_block_array[first_el_reached+1].el_position > $scrollTopGl + window_h
						)
				) {

					first_el_reached = key;

					var first_el_pos = value.el_position + value.el_height;

					if(
							 ($scrollTopGl + sb_position) - first_el_pos < wide_block_array[first_el_reached+1].el_position - ($scrollTopGl + sb_position)

					){
						sb_shift = first_el_pos - sb_position - $scrollTopGl;

						if (sb_shift < 0) {
							sb_shift = 0;
						}

						TweenMax.set(sidebar, {y: sb_shift, opacity: 1});

					}
				}
				else if( first_el_reached !== false ) {
					if(value.el_position < $scrollTopGl + window_h &&
						first_el_reached + 1 === key) {

						if (value.el_position <= stop_end) {

							var shift_bottom = value.el_position - stop_end;
							TweenMax.set(sidebar, {y: shift_bottom, opacity: 1});
							return false;

						} else if (
								value.el_position > $scrollTopGl + 80
						) {
							TweenMax.set(sidebar, {y: 0, opacity: 1});
							return false;
						}
					}
				}
			});

			past_$scrollTopGl_side = $scrollTopGl
		}
	}

}

