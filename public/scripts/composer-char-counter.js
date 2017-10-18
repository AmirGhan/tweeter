$( document ).ready(function() {
    $("textarea").on("keyup", function() {

      var textLength = $(this).val().length;
      var charLeft = 140 - textLength;

      if (charLeft >= 0) {
        $(this).parent().find("span.counter").text(charLeft).css("color", "black");
      } else {
        $(this).parent().find("span.counter").text(charLeft).css("color", "red");
      };
    });
});