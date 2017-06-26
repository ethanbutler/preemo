<?php preemo_partial('header', 'home'); ?>
<main class="home">
  <?php if(have_posts()): ?>
    <?php while(have_posts()): the_post(); ?>

      <?php preemo_partial('content', 'home'); ?>

    <?php endwhile; ?>
  <?php endif; ?>
</main>
<?php preemo_partial('footer', 'home'); ?>
  