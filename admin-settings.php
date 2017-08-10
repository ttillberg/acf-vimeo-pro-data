<?php

add_action( 'admin_menu', 'acf_vimeo_add_admin_menu' );
add_action( 'admin_init', 'acf_vimeo_settings_init' );


function acf_vimeo_add_admin_menu(  ) {

	add_menu_page( 'acf-vimeo-pro-data', 'acf-vimeo-pro-data', 'manage_options', 'acf-vimeo-pro-data', 'acf_vimeo_options_page' );

}


function acf_vimeo_settings_init(  ) {

	register_setting( 'pluginPage', 'acf_vimeo_settings' );

	add_settings_section(
		'acf_vimeo_pluginPage_section',
		__( 'API Settings', 'wordpress' ),
		'acf_vimeo_settings_section_callback',
		'pluginPage'
	);

	add_settings_field(
		'acf_vimeo_auth_token',
		__( 'AUTH token', 'wordpress' ),
		'acf_vimeo_auth_token_render',
		'pluginPage',
		'acf_vimeo_pluginPage_section'
	);


}


function acf_vimeo_auth_token_render(  ) {

	$options = get_option( 'acf_vimeo_settings' );
	?>
	<input type='text' name='acf_vimeo_settings[acf_vimeo_auth_token]' value='<?php echo $options['acf_vimeo_auth_token']; ?>'>
	<?php

}


function acf_vimeo_settings_section_callback(  ) {

	echo __( 'Refer to https://developer.vimeo.com/apps - Create an app and generate a token', 'wordpress' );

}


function acf_vimeo_options_page(  ) {

	?>
	<form action='options.php' method='post'>

		<h2>ACF Vimeo Pro Data</h2>

		<?php
		settings_fields( 'pluginPage' );
		do_settings_sections( 'pluginPage' );
		submit_button();
		?>

	</form>
	<?php

}

?>
