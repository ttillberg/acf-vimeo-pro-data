<?php

add_action('acf/init', initSettings);

function initSettings () {
	
	if( !function_exists('acf_add_options_page') || !function_exists('acf_add_local_field_group')) 
	
		return;	
	
	// registers a settings pages under general options 
	
	acf_add_options_sub_page(array(
		'page_title' 	=> 'Vimeo Pro Settings',
		'menu_title'	=> 'ACF Vimeo Pro Data',
		'parent_slug'	=> 'options-general.php',
	));
	
	// creates a field, a group and adds it all 
	// together to the options page
	
	acf_add_local_field_group(array (
		'title' => 'ACF Vimeo Pro Data',
		'fields' => array (
			array (
				'label' => 'Vimeo Auth Token',
				'name' => 'acf_vimeo_auth_token',
				'type' => 'text',
				'instructions' => 'Create a new app and generate a client access token to paste here. 
	More instructions here: https://developer.vimeo.com/api/start',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array (
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'default_value' => '',
				'placeholder' => '',
				'prepend' => '',
				'append' => '',
				'maxlength' => '',
			),
		),
		'location' => array (
			array (
				array (
					'param' => 'options_page',
					'operator' => '==',
					'value' => 'acf-options-acf-vimeo-pro-data',
				),
			),
		),
		'menu_order' => 0,
		'position' => 'normal',
		'style' => 'seamless',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => 1,
		'description' => '',
	));
	
}