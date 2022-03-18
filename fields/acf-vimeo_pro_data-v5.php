<?php


// check if class already exists
if (!class_exists('acf_field_vimeo_pro_data')) :


class acf_field_vimeo_pro_data extends acf_field {

    /*
    *  initialize
    *
    *  This function will setup the field type data
    *
    *  @type    function
    *  @date    5/03/2014
    *  @since   5.0.0
    *
    *  @param   n/a
    *  @return  n/a
    */

    function initialize()
    {

        /*
        *  name (string) Single word, no spaces. Underscores allowed
        */

        $this->name = 'vimeo_pro_data';


        /*
        *  label (string) Multiple words, can include spaces, visible when selecting a field type
        */

        $this->label = __('Vimeo Pro Data', 'acf-vimeo_pro_data');


        /*
        *  category (string) basic | content | choice | relational | jquery | layout | CUSTOM GROUP NAME
        */

        $this->category = 'basic';


        /*
        *  defaults (array) Array of default settings which are merged into the field object. These are used later in settings
        */

        $this->defaults = array(
        );


        /*
        *  l10n (array) Array of strings that are used in JavaScript. This allows JS strings to be translated in PHP and loaded via:
        *  var message = acf._e('vimeo_pro_data', 'error');
        */

        $this->l10n = array(
            'error' => __('Error! Please enter a higher value', 'acf-vimeo_pro_data'),
        );


        /*
        *  settings (array) Store plugin settings (url, path, version) as a reference for later use with assets
        */


    }




    /*
    *  render_field()
    *
    *  Create the HTML interface for your field
    *
    *  @param   $field (array) the $field being rendered
    *
    *  @type    action
    *  @since   3.6
    *  @date    23/01/13
    *
    *  @param   $field (array) the $field being edited
    *  @return  n/a
    */

    function render_field($field) {

        /*
        *  Review the data of $field.
        *  This will show what data is available
        */



        ?>
        <div class="acf-vimeo-pro-data">
            <div class="ui search">
                <input class="prompt" type="text" placeholder="Look up title..." autocomplete="on">
                <div class="results"></div>
            </div>
            <input type="hidden" placeholder="VIMEO ID" class="acf-vimeo-pro-data-input" />
            <div class="acf-vimeo-pro-data-display"></div>
            <div class="acf-vimeo-pro-data__buttons">
                <a class="button button-secondary button-small acf-vimeo-pro-data__refresh " href="javascript:void(0);">Refresh</a>&nbsp;
                <a class="button button-secondary button-small acf-vimeo-pro-data__clear" href="javascript:void(0);">Clear</a>
            </div>
            <input type="hidden" class="acf-vimeo-pro-data__hidden-input" name="<?php echo esc_attr($field['name']) ?>" value="<?php echo esc_attr($field['value']) ?>" />

            <div class="acf-vimeo-pro-data__message"></div>
        </div>
        <?php
    }

    function getVimeoToken()
    {
        return get_option('options_acf_vimeo_auth_token');
    }


    /*
    *  input_admin_enqueue_scripts()
    *
    *  This action is called in the admin_enqueue_scripts action on the edit screen where your field is created.
    *  Use this action to add CSS + JavaScript to assist your render_field() action.
    *
    *  @type    action (admin_enqueue_scripts)
    *  @since   3.6
    *  @date    23/01/13
    *
    *  @param   n/a
    *  @return  n/a
    */

    function input_admin_enqueue_scripts()
    {
                
        // vars

        $url = plugin_dir_url( __DIR__ );
        $version = acf_get_setting('version');

        // register search plugin
        wp_register_script('acf-input-vimeo_pro_data--ui-search', "{$url}assets/search/search.js");
        wp_enqueue_script('acf-input-vimeo_pro_data--ui-search');
        wp_register_style('acf-input-vimeo_pro_data--ui-search', "{$url}assets/search/search.css");
        wp_enqueue_style('acf-input-vimeo_pro_data--ui-search');

        // register & include JS
        wp_register_script('acf-input-vimeo_pro_data--ui', "{$url}assets/js/input.js", array('acf-input'), $version);

        $client_vars = array(
        'vimeo_token' => $this -> getVimeoToken(),
        );
        wp_localize_script('acf-input-vimeo_pro_data--ui', 'server_vars', $client_vars);
        wp_enqueue_script('acf-input-vimeo_pro_data--ui');


        // register & include CSS
        wp_register_style('acf-input-vimeo_pro_data--ui', "{$url}assets/css/input.css", array('acf-input'), $version);
        wp_enqueue_style('acf-input-vimeo_pro_data--ui');
    }






    /*
    *  load_value()
    *
    *  This filter is applied to the $value after it is loaded from the db
    *
    *  @type    filter
    *  @since   3.6
    *  @date    23/01/13
    *
    *  @param   $value (mixed) the value found in the database
    *  @param   $post_id (mixed) the $post_id from which the value was loaded
    *  @param   $field (array) the field array holding all the field options
    *  @return  $value
    */



    function load_value($value, $post_id, $field)
    {
        return $value;
    }



    /*
    *  update_value()
    *
    *  This filter is applied to the $value before it is saved in the db
    *
    *  @type    filter
    *  @since   3.6
    *  @date    23/01/13
    *
    *  @param   $value (mixed) the value found in the database
    *  @param   $post_id (mixed) the $post_id from which the value was loaded
    *  @param   $field (array) the field array holding all the field options
    *  @return  $value
    */


    function update_value($value, $post_id, $field)
    {
        return $value;
                
    }



    /*
    *  format_value()
    *
    *  This filter is appied to the $value after it is loaded from the db and before it is returned to the template
    *
    *  @type    filter
    *  @since   3.6
    *  @date    23/01/13
    *
    *  @param   $value (mixed) the value which was loaded from the database
    *  @param   $post_id (mixed) the $post_id from which the value was loaded
    *  @param   $field (array) the field array holding all the field options
    *
    *  @return  $value (mixed) the modified value
    */



    function format_value($value, $post_id, $field)
    {

        // bail early if no value
        if (empty($value)) {
            return $value;
        }

        $json = json_decode($value);

        return ($json);
    }


}




// initialize
acf_register_field_type( 'acf_field_vimeo_pro_data' );


// class_exists check
endif;

?>
