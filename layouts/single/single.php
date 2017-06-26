<?php preemo_partial('header', 'single'); ?>
<main class="single">
  <?php if(have_posts()): ?>
    <?php while(have_posts()): the_post(); ?>

      <?php preemo_partial('content', 'single'); ?>

    <?php endwhile; ?>
  <?php endif; ?>
</main>
<?php preemo_partial('footer', 'single'); ?>
  