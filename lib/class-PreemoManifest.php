<?php

class PreemoManifest {
  private static $instance;

  const VERSION          = '0.1';
  const MANIFESTLOCATION = '/manifest.json';

  private $default_manifest = [
    'name'                 => 'Hello World',
    'short_name'           => 'Hello World',
    'start_url'            => '/',
    'display'              => 'standalone',
    'background_color'     => '#fff',
    'theme_color'          => '#56a0d3',
    'description'          => 'This is my site.',
    'icons'                => [
      [
        'src'    => '/test.png',
        'sizes'  => '48x48',
        'type'   => 'image/png'
      ],
      [
        'src'    => '/test.png',
        'sizes'  => '72x72',
        'type'   => 'image/png'
      ],
      [
        'src'    => '/test.png',
        'sizes'  => '96x96',
        'type'   => 'image/png'
      ],
      [
        'src'    => '/test.png',
        'sizes'  => '144x144',
        'type'   => 'image/png'
      ],
      [
        'src'    => '/test.png',
        'sizes'  => '168x168',
        'type'   => 'image/png'
      ],
      [
        'src'    => '/test.png',
        'sizes'  => '192x192',
        'type'   => 'image/png'
      ],
      [
        'src'    => '/test.png',
        'sizes'  => '512x512',
        'type'   => 'image/png'
      ]
    ],
    'related_applications' => []
  ];

  function __construct(){
    if($_SERVER['REQUEST_URI'] === self::MANIFESTLOCATION){
      $this->intercept_manifest_request();
    }
  }

  public static function init(){
    if(!self::$instance){
      self::$instance = new self();
    }
  }

  private function intercept_manifest_request(){
    header("Content-Type: application/json");
    header('Expires: '.gmdate('D, d M Y H:i:s \G\M\T', time() + (60 * 60 * 24 * 30)));
    print json_encode($this->default_manifest);
    exit;
  }

}
