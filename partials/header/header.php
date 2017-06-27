<?php
$css_path = get_stylesheet_directory_uri() . '/dist/css/';
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <title><?php wp_title('|', true, 'right');?></title>
    <style>
      <?php include(get_stylesheet_directory() . '/dist/css/global.css'); ?>
    </style>
    <noscript>
      <link rel="stylesheet" href="<?= $css_path . 'style.css'; ?>">
    </noscript>
  </head>
  <body>
    <header class="header">
      <nav class="header-nav">
        <ul class="header-menu">
          <li class="header-menuItem"><?php _e('Open Source'); ?></li>
          <li class="header-menuItem"><?php _e('Client Work'); ?></li>
          <li class="header-menuItem"><?php _e('About Me'); ?></li>
          <li class="header-menuItem"><?php _e('Blog'); ?></li>
        </ul>
      </nav>
    </header>
