/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$( document ).ready(function() {


function createTweetElement (tweet) {
  let $article = $("<article>").addClass("tweet");
// header part
  let $header = $("<header>");
  let $img = $("<img>").addClass("avatar").attr("src", tweet.user.avatars.small);
  $header.append($img);
  let $name = $("<h3>").text(tweet.user.name);
  $header.append($name);
  let $handle = $("<p>").text(tweet.user.handle);
  $header.append($handle);
  $article.append($header);
// Content part
  let $tweetContent = $("<p>").addClass("tweet-body").text(tweet.content.text);
  $article.append($tweetContent);
// Footer part
  let $footer = $("<footer>").addClass("clearfix");
  let $dayCounter = $("<p>").text(moment(moment(tweet.created_at).format()).fromNow());
  $footer.append($dayCounter);
  let $div = $("<div>").addClass("icons");
  let $heart = $("<i>").addClass("fa fa-heart").attr("aria-hidden", "true");
  $div.append($heart);
  let $reTweet = $("<i>").addClass("fa fa-retweet").attr("aria-hidden", "true");
  $div.append($reTweet);
  let $flag = $("<i>").addClass("fa fa-flag").attr("aria-hidden", "true");
  $div.append($flag);
  $footer.append($div);
  $article.append($footer);

  return $article;
};


function renderTweets(data) {
  let $container = $("#tweets");
  data.forEach(function(tweetData) {
    const section = createTweetElement(tweetData);
    $container.prepend(section);
 })
};


//=====================================================================================================================================
// Form toggle and auto selecting the textarea
//=====================================================================================================================================

$("#compose").click(function(){
  if ($(".new-tweet").is(":hidden")) { // if it's up, slide down, then focus on textarea
    $(".new-tweet").slideDown("slow");
    $(".new-tweet").find("textarea").focus();
    } else {
     $(".new-tweet").find("textarea").focusout(); // if it's down, focus out, then slide up
     $(".new-tweet").slideUp("slow");
    }
});

//=====================================================================================================================================
// Recieving the tweet text from the server
//=====================================================================================================================================
function loadTweets () {
  $.ajax({
  url: '/tweets',
  method: 'GET',
  dataType: 'json',
  contentType: "application/json; charset=utf-8",
  success: function (response) {
  renderTweets(response);
  }
});
}
loadTweets();


//=====================================================================================================================================
// Sending the tweet text to the server
//=====================================================================================================================================
$(".new-tweet form").submit(function (event) {
  event.preventDefault();
  var data = $(this).serialize();
  let tweetContent = $(this).find("textarea").val();
  if (tweetContent === "") {
    let $emptyTweetErr = $("<p>").text("You can not post an empty Tweet!").css("color", "red");
    $("#errors").append($emptyTweetErr);
  } else if ($(".counter").text() < 0){
    let $counterTweetErr = $("<p>").text("Your tweet should be less than 140 characters!").css("color", "red");
    $("#errors").append($counterTweetErr); 
  } else {
    $.ajax({
    url: '/tweets',
    method: 'POST',
    data: data,
    success: function (response) {
      // let arr = []; arr.push(response); renderTweets(arr)
      renderTweets([response]) //instead of above: put the object into brackets
    }
    });
    this.reset(); // Resets the textarea
    $(".counter").text(140) // Resets the character counter to 140
    }
});




});

