<?php

class VimeoEndpoint {

	function __construct() {
	}

	function activate() {
			global $wp_rewrite;
			$this->flush_rewrite_rules();
	}

	// Took out the $wp_rewrite->rules replacement so the rewrite rules filter could handle this.
	function create_rewrite_rules($rules) {
			global $wp_rewrite;
			$newRule = array('wp-admin/service/vimeo-api' => 'index.php?VimeoEndpoint=true');
			$newRules = $newRule + $rules;
			return $newRules;
	}

	function add_query_vars($qvars) {
			$qvars[] = 'VimeoEndpoint';
			return $qvars;
	}

	function flush_rewrite_rules() {
			global $wp_rewrite;
			$wp_rewrite->flush_rules();
	}

	function template_redirect_intercept() {

		global $wp_query;

		if (!$wp_query->get('VimeoEndpoint')) {
			return;
		}

		$current_user = wp_get_current_user();

		if (!isset($current_user) || !$current_user->allcaps['level_1']) {
			$this->pushoutput(array('error' => "You've been logged out" ));
			die();
		}

		$options = get_option( 'acf_vimeo_settings' );

		if (is_array($options)) {
			$AUTH_KEY = $options['acf_vimeo_auth_token'];
		}

		if (!$AUTH_KEY) {
			$this->pushoutput(array('error' => "Missing vimeo AUTH_KEY" ));
			die();
		}

		if (!isset($_REQUEST['vimeo_id'])) {
			$this->pushoutput(json_encode(array('error' => "Missing request parameters" )));
			die();
		}

		$ID = $_REQUEST['vimeo_id'];
		// cURL initialization
		$curl = curl_init();
		// Define the cURL request options
		curl_setopt_array($curl, array(
				CURLOPT_RETURNTRANSFER => 1,
				// Vimeo has a handy query parameter that will pre-filter the response. See: https://developer.vimeo.com/api/spec#common-parameters
				CURLOPT_URL => 'https://api.vimeo.com/videos/' . $ID,
				// Use these steps to get your token: https://developer.vimeo.com/api/start
				CURLOPT_HTTPHEADER => array('Authorization: bearer ' . $AUTH_KEY)
			)
		);

		// Execute the request and store the response
		$response = curl_exec($curl);
		header( 'Content-type: application/json' );
		echo ($response);
		curl_close($curl);
		exit;

	}

	function pushoutput($message) {
		$this->output($message);
	}

	function output( $output ) {
		header( 'Cache-Control: no-cache, must-revalidate' );

		// Commented to display in browser.
		header( 'Content-type: application/json' );
		echo json_encode( $output );
	}
}

$server_status = new VimeoEndpoint();

register_activation_hook( __file__, array($server_status, 'activate') );

// Using a filter instead of an action to create the rewrite rules.
// Write rules -> Add query vars -> Recalculate rewrite rules
add_filter('rewrite_rules_array', array($server_status, 'create_rewrite_rules'));
add_filter('query_vars',array($server_status, 'add_query_vars'));

// Recalculates rewrite rules during admin init to save resourcees.
// Could probably run it once as long as it isn't going to change or check the
// $wp_rewrite rules to see if it's active.
add_filter('admin_init', array($server_status, 'flush_rewrite_rules'));
add_action('template_redirect', array($server_status, 'template_redirect_intercept') );