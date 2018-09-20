# ACF Vimeo PRO Data field

### Description

Adds a 'Vimeo Pro Data' field type for the Advanced Custom Fields WordPress plugin.

The field offers an easy way to fetch video data (sources, poster-frames, sizes and more) from a specified Vimeo Pro account.

![image](https://user-images.githubusercontent.com/557990/30244505-2fc60e04-95bf-11e7-99e4-c8fe1800647b.png)

### Compatibility

This ACF field type is compatible with:
* ACF 5

### Installation


#### Automatic (Recommended)

To keep your plugin up to date, install the [GitHub updater](https://github.com/afragen/github-updater) plugin and follow the instructions to install this repo. 

#### Manual

1. Copy the `acf-vimeo_pro_data` folder into your `wp-content/plugins` folder
2. Activate the Vimeo Pro Data plugin via the plugins admin page


#### Usage

1. Inside your Vimeo Admin, [register a new app](https://developer.vimeo.com/api/start), generate an Access Token. Make sure you tick the `Video Files` scope (as well as `Public` and `Private` depending on your needs).
2. Open the Vimeo Pro Data settings (inside the Settings menu) and paste the generated token. 
3. Create a new field via ACF and select the `Vimeo Pro` Data type

### Changelog
Please see `readme.txt` for changelog
