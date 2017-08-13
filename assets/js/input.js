(function($){

	function initialize_field( $el ) {

		var el 				= $el.find('div.acf-input');
		var $input 		= el.find('input.acf-vimeo-pro-data-hidden-input');
		var $display 	= el.find('.acf-vimeo-pro-data-display');
		var $message 	= el.find('.acf-vimeo-pro-data-message');
		var $entry 		= el.find('input.acf-vimeo-pro-data-input');
		var $refresh 	= el.find('a.refresh')
		var $remove 	= el.find('a.remove')

		$message.hide()

		$refresh.on('click', function() {
			refresh($entry.val())
		})

		$remove.on('click', function() {
			remove()
		})

		var initialData = getData();

		if (!!initialData) {
			initialData = JSON.parse(initialData);
			displayRefreshedData(initialData);
		}

		function display_alert(msg, level) {
			if (level == 1) {
				$el.addClass('warning')
			}
			msg = (msg || "").replace(/\n/g, "<br />");
			$message.html(msg).show();
		}

		function clear_alert() {
			$el.removeClass('warning')
			$message.text("").hide();
		}

		function remove() {
			setData();
			clear_alert()
			$entry.val("")
			$display.empty()
			$el.removeClass('has-data')

		}

		function refresh(id) {
			clear_alert();
			id = parse_vimeo_id(id);
			if (~~id == 0) return display_alert("Please provide a valid Vimeo ID. It should contain about 9 digits.", 1)
			display_alert('loading...')
			var API_URL = "service/vimeo-api"
			$.getJSON(API_URL + "/?vimeo_id=" + id, onDataLoaded);
		}

		function onDataLoaded(data) {
			if (!data) {
				return display_alert("The API didn't return any data.\nDouble check the ID or retry in a minute.", 1);
			}
			if (data.error) {
				return display_alert(data.error, 1);
			}
			if (!data.files || data.files.length == 0) {
				return display_alert("The video '" + data.name + "' was found but doesn't provide any files.\nMake sure the video the video provide external access to its files.", 1);
			}
			clear_alert()
			cleanupData(data)
			setData(data)

			displayRefreshedData(data);
		}

		function displayRefreshedData(data) {
			var id = parse_vimeo_id(data.uri);
			$entry.val(id)
			displayData(data);
		}

		function displayData(data) {

			$el.addClass('has-data')

			var list = [];

      list.push("<div class='acf-vimeo-data-display-preview'>")
			list.push("<img src='" + data.pictures.sizes[2] . link + "' />")
      list.push("</div>");
			list.push("<div class='video-info'>")
      list.push("<h4>" + data.name + "</h4>")
			list.push(data.width + "x" + data.height + "/" + data.time)
			list.push(data.files.map(function(o){ return (o.height ? o.height + 'p ' : '') + (o.quality || "NA").toUpperCase() }).join(', '))
			list.push("</div>");
			var html = list.join('<br/>')
			$display.html(html)
		}

		function cleanupData(data) {
			var strip_fields = [
				'user', 'content_rating', 'privacy', 'embed', 'review_link', 'embed_presets', 'metadata','stats', 'ressource_key', 'tags'
			]
			for ( var i in strip_fields ) {
				data[strip_fields[i]] = 'stripped_out'
			}
			return data;
		}

		function parse_vimeo_id(id) {
			return ((id || "").match(/[0-9]{6,12}/));
		}

		function getData() {
			return $input.val()
		}

		function setData(data) {
			var str = JSON.stringify(data)
			$input.val(str);
		}
	}


	if( typeof acf.add_action !== 'undefined' ) {

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

		acf.add_action('ready append', function( $el ){

			// search $el for fields of type 'vimeo_pro_data'
			acf.get_fields({ type : 'vimeo_pro_data'}, $el).each(function(){

				initialize_field( $(this) );

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

		$(document).on('acf/setup_fields', function(e, postbox){

			$(postbox).find('.field[data-field_type="vimeo_pro_data"]').each(function(){

				initialize_field( $(this) );

			});

		});


	}


})(jQuery);
