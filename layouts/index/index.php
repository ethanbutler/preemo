<?php preemo_partial('header', 'index'); ?>
<main class="index">
  <?php if(have_posts()): ?>
    <?php while(have_posts()): the_post(); ?>

      <?php preemo_partial('content', 'index'); ?>

    <?php endwhile; ?>
  <?php endif; ?>
</main>
<?php preemo_partial('footer', 'index'); ?>
  