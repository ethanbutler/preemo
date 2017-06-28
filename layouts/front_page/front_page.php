<?php preemo_partial('header', 'front_page'); ?>
<main class="front_page">
  <?php if(have_posts()): ?>
    <div class="home-content">
      <?php while(have_posts()): the_post(); ?>
        <?php preemo_partial('content', 'home'); ?>
      <?php endwhile; ?>
    </div>
  <?php endif; ?>
</main>
<?php preemo_partial('footer', 'front_page'); ?>
