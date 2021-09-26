<script>
  import { page } from '$app/stores';

  $: {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-ZPGFWYWMHX', {
        page_path: $page.path,
      });
    }
  }
</script>
