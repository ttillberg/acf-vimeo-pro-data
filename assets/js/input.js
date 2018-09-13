(function($) {
  function initialize_field($el) {
    var el = $el.find("div.acf-input");
    var $input = el.find("input.acf-vimeo-pro-data__hidden-input");
    var $display = el.find(".acf-vimeo-pro-data-display");
    var $message = el.find(".acf-vimeo-pro-data__message");
    var $entry = el.find("input.acf-vimeo-pro-data-input");
    var $refresh = el.find("a.acf-vimeo-pro-data__refresh");
    var $clear = el.find("a.acf-vimeo-pro-data__clear");
    var $search = el.find(".search");

    $search.search({
      apiSettings: {
        url: "https://api.vimeo.com/me/videos?query={query}&weak_search=true",
        beforeSend: function(settings) {
          // fixes Vimeo bug (weak_search) restricting search to lowercase
          settings.urlData.query = settings.urlData.query.toLowerCase();
          return settings;
        },
        beforeXHR: setAjaxAuthHeader,
        onResponse: function(resp) {
          if (resp.data) {
            resp.data = resp.data.map(function(o) {
              return Object.assign(o, {
                image: o.pictures.sizes[2].link,
                description: o.description || ""
              });
            });
          }
          return resp;
        }
      },
      fields: {
        results: "data",
        title: "name",
        image: "image"
        // url     : 'html_url'
      },
      minCharacters: 3,
      onSelect: function(data, resp) {
        refresh(data.link);
      }
    });

    $message.hide();

    $refresh.on("click", function() {
      refresh($entry.val());
    });

    $clear.on("click", function() {
      remove();
    });

    var initialData = getData();

    if (!!initialData) {
      initialData = JSON.parse(initialData);
      displayRefreshedData(initialData);
    }

    function display_alert(msg, level) {
      if (level == 1) {
        $el.addClass("acf-vimeo-pro-data--warning");
      }
      msg = (msg || "").replace(/\n/g, "<br />");
      $message.html(msg).show();
    }

    function clear_alert() {
      $el.removeClass("acf-vimeo-pro-data--warning");
      $message.text("").hide();
    }

    function remove() {
      setData();
      clear_alert();
      $search.find("input").val("");
      $entry.val("");
      $display.empty();
      $el.removeClass("has-data");
    }

    function refresh(id) {
      clear_alert();
      id = parse_vimeo_id(id);
      if (~~id == 0)
        return display_alert(
          "Please provide a valid Vimeo ID. It should contain about 9 digits.",
          1
        );
      display_alert("loading...");
      var API_URL = "service/vimeo-api";

      $(document).ready(function() {
        $.ajax({
          url: "https://api.vimeo.com/videos/" + id,
          type: "GET",
          dataType: "json",
          success: onDataLoaded,
          error: function(err) {
            display_alert(err && err.statusText, 1);
          },
          beforeSend: setAjaxAuthHeader
        });
      });
    }

    function onDataLoaded(data) {
      if (!data) {
        return display_alert(
          "The API didn't return any data.\nDouble check the ID or retry in a minute.",
          1
        );
      }

      if (!data.files || data.files.length == 0) {
        return display_alert(
          "The video '" +
            data.name +
            "' was found but doesn't provide any files.\nMake sure the video the video provide external access to its files.",
          1
        );
      }
      clear_alert();
      cleanupData(data);
      setData(data);

      displayRefreshedData(data);
    }

    function displayRefreshedData(data) {
      var id = parse_vimeo_id(data.uri);
      $entry.val(id);
      displayData(data);
    }

    function displayData(data) {
      $el.addClass("has-data");

      var $html = $("<div>")
        .addClass("acf-vimeo-data-display__preview")
        // poster frame wrapped inside a link to the video
        .append(
          $("<a>")
            .attr({ href: data.link, target: "_blank" })
            .append(
              $("<img>").attr({
                src: data.pictures.sizes.find(function(data) {
                  return data.height > 300;
                }).link
              })
            )
        )
        .append(
          // video info showing beneath the poster frame
          $("<div>")
            .addClass("video-info")
            // title
            .append($("<h4>").text(data.name))
            // dimensions
            .append(
              $("<div>").text(
                [
                  toMMSS(data.duration),
                  " - ",
                  data.width,
                  "x",
                  data.height
                ].join("")
              )
            )
        );

      $display.html($html);
    }

    function cleanupData(data) {
      var strip_fields = [
        "user",
        "content_rating",
        "privacy",
        "embed",
        "review_link",
        "embed_presets",
        "metadata",
        "stats",
        "ressource_key",
        "tags"
      ];
      for (var i in strip_fields) {
        data[strip_fields[i]] = "stripped_out";
      }
      return data;
    }

    function parse_vimeo_id(id) {
      return (id || "").match(/[0-9]{6,12}/);
    }

    function getData() {
      return $input.val();
    }

    function setData(data) {
      var str = JSON.stringify(data);
      $input.val(str);
    }

    function toMMSS(value) {
      var sec_num = parseInt(value, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      return minutes + "'" + seconds + '"';
    }
  }

  if (typeof acf.add_action !== "undefined") {
    /*
		*  ready append (ACF5)
		*
		*  These are 2 events which are fired during the page load
		*  ready = on page load similar to $(document).ready()
		*  append = on new DOM elements appended via repeater field
		*
		*  @type	event
		*  @date	20/07/13
		*
		*  @param	$el (jQuery selection) the jQuery element which contains the ACF fields
		*  @return	n/a
		*/

    acf.add_action("ready append", function($el) {
      // search $el for fields of type 'vimeo_pro_data'
      acf.get_fields({ type: "vimeo_pro_data" }, $el).each(function() {
        initialize_field($(this));
      });
    });
  } else {
    /*
		*  acf/setup_fields (ACF4)
		*
		*  This event is triggered when ACF adds any new elements to the DOM.
		*
		*  @type	function
		*  @since	1.0.0
		*  @date	01/01/12
		*
		*  @param	event		e: an event object. This can be ignored
		*  @param	Element		postbox: An element which contains the new HTML
		*
		*  @return	n/a
		*/

    $(document).on("acf/setup_fields", function(e, postbox) {
      $(postbox)
        .find('.field[data-field_type="vimeo_pro_data"]')
        .each(function() {
          initialize_field($(this));
        });
    });
  }

  function setAjaxAuthHeader(xhr) {
    xhr.setRequestHeader("Authorization", "bearer " + server_vars.vimeo_token);
  }
})(jQuery);
