<?php
$css_path = get_stylesheet_directory_uri() . '/dist/css/';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#56a0d3">
    <?php wp_head(); ?>
    <link rel="manifest" href="/manifest.json">
    <title><?php wp_title();?></title>
    <style>
      <?php include(get_stylesheet_directory() . '/dist/css/critical.css'); ?>
    </style>
    <noscript>
      <link rel="stylesheet" href="<?= $css_path . 'style.css'; ?>">
    </noscript>
  </head>
  <body>
    <header class="header">
      Header!
    </header>
