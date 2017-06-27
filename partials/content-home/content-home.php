<div class="content contentHome">
  <div class="content-gradTop"></div>
  <div class="content-gradLeft"></div>
  <div class="content-inner">
    <h2 class="content-heading"><?php the_title(); ?></h2>
    <div class="content-excerpt"><?php the_excerpt(); ?></div>
    <div class="content-meta">
      <div class="content-date"><?php the_date('Y'); ?></div>
    </div>
    <a class="content-link" href="<?php the_permalink(); ?>"><?php _e('Read More'); ?></a>
  </div>
</div>
