$(window).on("scroll resize", function() {
  var pos = $(".top-position-sticky").offset();
  $("#triggerTop").each(function() {
    if (pos.top >= $(this).offset().top) {
      $("#receiveContent").html($(".filter-schedules-top").html());
      return;
    } else {
      $("#receiveContent").html(
        '<img src="images/tugende.png" class="tugende-label-image" alt="" />'
      );
    }
  });
});

$(document).ready(function() {
  $(window).trigger("scroll");
});
