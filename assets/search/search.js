(function($) {
  $.fn.searchApi = function(settings) {
    var $el = this;

    var $prompt = $el.find(".prompt");
    var $results = $el.find(".results");

    var resultCache = [];

    var keys = {
      enter: 13,
      escape: 27,
      upArrow: 38,
      downArrow: 40
    };

    var state = {
      active: false,
      currentIndex: -1,
      items: []
    };

    $prompt.on("keyup", function(e) {
      var specialKey = Object.keys(keys).find(function(index) {
        return keys[index] === e.which;
      });
      if (specialKey) {
        return;
      }
      query(event.target.value);
      $el.addClass("active");
    });

    // setActive(true);
    $prompt.on("focus", function() {
      setActive(true);
    });
    $prompt.on("blur", function() {
      setTimeout(function() {
        // the extra delay seems to allow click
      }, 100);
      setActive(false);
    });

    function handleKeyboard(e) {
      var key = e.which;
      if (key === keys.downArrow) {
        var index = Math.min(state.items.length - 1, state.currentIndex + 1);
        if (index !== state.currentIndex) {
          e.preventDefault();
          setIndex(index);
        }
      }
      if (key === keys.upArrow) {
        var index = Math.max(0, state.currentIndex - 1);
        if (index !== state.currentIndex) {
          e.preventDefault();
          setIndex(index);
        }
      }
      if (key === keys.enter) {
        settings.onSelect(state.items[state.currentIndex].data);
        setActive(false);
        e.preventDefault();
      }
      if (key === keys.escape) {
        setActive(false);
        e.preventDefault();
      }
    }

    function setActive(active) {
      if (active) {
        if (!state.active) {
          state.currentIndex = -1;
          $el.addClass("active");
          $(window).on("keydown", handleKeyboard);
          query();
        }
      } else {
        state.currentIndex = -1;
        $el.removeClass("active");
        $(window).off("keydown", handleKeyboard);
      }
      setIndex(state.currentIndex);
      state.active = active;
    }

    function setIndex(index) {
      state.currentIndex = index;
      var item = state.items[state.currentIndex];
      state.items.forEach(function(item) {
        item.$el.removeClass("active");
      });
      if (item) {
        item.$el.addClass("active");
      }
    }

    function query(str) {
      var cache = resultCache[str];

      if (cache && cache.status === "success") {
        populate(cache.value);
        return;
      }

      var params = Object.assign(
        {
          type: "GET",
          success: function(data, textStatus, request) {
            populate(data);
            console.log(data);
            resultCache[str] = { status: "success", value: data };
          },
          error: function(request, textStatus, errorThrown) {}
        },
        settings.createQuery(str)
      );
      $.ajax(params);
    }

    function populate(resp) {
      // register and keep track of the item array for later
      var items = (state.items = []);
      // setup the drop down and attach it to the DOM
      var $ul = $('<div class="dropdown" />');
      $results.html($ul);
      // cycle through data to build drop down optinos
      resp.data.forEach(function(entry, index) {
        // setup option container and listeners
        var $li = $("<a/>");

        // associate element + data for laster use in listeners etc.
        items.push({ $el: $li, data: entry });

        $li.on("mousedown", function() {
          // NOTE: mousedown is used rather than click since,
          // blur hides the dropdown and cancels the click
          settings.onSelect(entry);
        });

        $li.on("hover", function() {
          // sync keyboard navigation to hovered item
          setIndex(index);
        });

        // thumbnail
        var imageSource = entry.pictures.sizes[2].link.replace(/\?.*$/, "");
        $li_img = $('<img height="40" />').attr("src", imageSource);

        // description
        $li_title = $("<h5 />").text(entry.name);
        $li_info = $("<p />").text(entry.created_time);
        $li.append($li_img, $("<div>").append($li_title, $li_info));

        $ul.append($li);
      });
    }
  };
})(jQuery);
