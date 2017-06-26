<?php

global $preemo;

$preemo = [];

/**
 * Checks theme for a file. Returns whether file exists.
 * @param  string $file Path to file relative to theme directory.
 * @return bool         Whether file exists.
 */
function preemo_file_exists($file){
  $base = get_stylesheet_directory();
  return file_exists("$base/$file.php");
}

/**
 * Enqueues scripts and generates markup for a layout. This function should not be called directly.
 * @param  string $layout Layout name.
 * @return void
 */
function preemo_layout($layout = 'home'){
  preemo_router($layout, 'layouts');
  get_template_part("layouts/$layout/$layout");
}

/**
 * Enqueues scripts and generates markup for a partial This function can be called in the markup of a layout file.
 * @param  string  $partial  The name of apartial.
 * @param  string  $modifier A modifier of apartial. Works similarly to the second argument of get_template_part();
 * @return void
 */
function preemo_partial($partial, $modifier = null){
  $path_mod = "partials/$partial-$modifier/$partial-$modifier";
  $path_def = "partials/$partial/$partial";
  preemo_router($partial, 'partials');
  if($modifier && preemo_file_exists($path_mod)){
    preemo_router("$partial-$modifier", 'partials');
    get_template_part($path_mod);
  } elseif(preemo_file_exists($path_def)){
    get_template_part($path_def);
  }
}

/**
 * Generates a list of JS file aliases that should be required in a page's JS markup. This file should not be called directly.
 * @param  string $ref  Name of component or layout.
 * @param  string $type 'Layouts' or 'partials'.
 * @return [type]       [description]
 */
function preemo_router($ref, $type){
  global $preemo;
  $ref = "'$ref'";
  if(!in_array($ref, $preemo)) array_push($preemo, $ref);
}

// Registers compileed JS and CSS for theme.
add_action('wp_enqueue_scripts', function(){
  $scripts_uri = get_template_directory_uri() . '/dist/js/';
  $styles_uri  = get_template_directory_uri() . '/dist/css/';

  wp_register_script('bundle/js', "{$scripts_uri}index.js", [], false, true);
  wp_enqueue_script('bundle/js');

  wp_enqueue_style('main/css', "{$styles_uri}main.css");
}, 1000);

// Localizes necessary JS for a layout.
add_action('wp_footer', function(){
  global $preemo;
  $scripts = implode(', ', $preemo);
  print "
  <script>
    var preemo_router = [$scripts];
  </script>
  ";
});

// Layout name possibilities.
$templates = [
  'embed',
  '404',
  'search',
  'front_page',
  'home',
  'post_type_archive',
  'tax',
  'attachment',
  'single',
  'page',
  'singular',
  'category',
  'tag',
  'author',
  'date',
  'archive'
];

// Use PHP file from layouts/ in place of /. Default to layouts/index.
add_action('template_include', function() use($templates) {
  foreach($templates as $template){
    $is_template = call_user_func("is_$template");
    if($is_template && preemo_file_exists("layouts/$template/$template")){
      preemo_layout($template);
      return;
    }
  }
  preemo_layout('index');
});
