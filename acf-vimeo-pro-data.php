<?php

/*
Plugin Name: Advanced Custom Fields: Vimeo Pro Data
Plugin URI: PLUGIN_URL
Description: Retrieves video sources from Vimeo Pro account
Version: 1.0.5
Author: Theo Tillberg
Author URI: theoberg.com
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
GitHub Plugin URI: ttillberg/acf-vimeo-pro-data
*/

// exit if accessed directly
if( ! defined( 'ABSPATH' ) ) exit;

require_once dirname( __FILE__ ) . '/admin-settings.php';
require_once dirname( __FILE__ ) . '/admin-endpoint.php';

// check if class already exists
if( !class_exists('acf_plugin_vimeo_pro_data') ) :

class acf_plugin_vimeo_pro_data {

	/*
	*  __construct
	*
	*  This function will setup the class functionality
	*
	*  @type	function
	*  @date	17/02/2016
	*  @since	1.0.0
	*
	*  @param	n/a
	*  @return	n/a
	*/

	function __construct() {

		// vars
		$this->settings = array(
			'version'	=> '1.0.0',
			'url'		=> plugin_dir_url( __FILE__ ),
			'path'		=> plugin_dir_path( __FILE__ )
		);


		// set text domain
		// https://codex.wordpress.org/Function_Reference/load_plugin_textdomain
		load_plugin_textdomain( 'acf-vimeo_pro_data', false, plugin_basename( dirname( __FILE__ ) ) . '/lang' );


		// include field
		add_action('acf/include_field_types', 	array($this, 'include_field_types')); // v5
		add_action('acf/register_fields', 		array($this, 'include_field_types')); // v4

	}


	/*
	*  include_field_types
	*
	*  This function will include the field type class
	*
	*  @type	function
	*  @date	17/02/2016
	*  @since	1.0.0
	*
	*  @param	$version (int) major ACF version. Defaults to false
	*  @return	n/a
	*/

	function include_field_types( $version = false ) {

		// support empty $version
		if( !$version ) $version = 4;


		// include
		include_once('fields/acf-vimeo_pro_data-v' . $version . '.php');

	}

}


// initialize
new acf_plugin_vimeo_pro_data();


// class_exists check
endif;

?>
