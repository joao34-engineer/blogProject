$(document).ready(function () {
  $(".read-more").click(function () {
    const index = $(this).data("index");
    const dots = $(`.post-content[data-index="${index}"] .dots`);
    const moreText = $(`.post-content[data-index="${index}"] .more-text`);

    if (moreText.is(":hidden")) {
      dots.hide();
      moreText.show();
      $(this).text("Read Less");
    } else {
      dots.show();
      moreText.hide();
      $(this).text("Read More");
    }
  });
});
