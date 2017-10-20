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
  let $dayCounter = $("<p>").text(calculateSince(tweet.created_at));
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


//=====================================================================================================================================
// Calculate Since Function
//=====================================================================================================================================

function calculateSince(datetime) {
  var tTime = new Date(datetime);
  var cTime = new Date();
  var sinceMin = Math.round((cTime - tTime) / 60000);
  if (sinceMin === 0) {
      var sinceSec = Math.round((cTime - tTime) / 1000);
      if (sinceSec < 10)
        var since = 'less than 10 seconds ago';
      else if (sinceSec < 20)
        var since = 'less than 20 seconds ago';
      else
        var since = 'half a minute ago';
  }
  else if(sinceMin === 1) {
      var sinceSec = Math.round((cTime - tTime) / 1000);
      if (sinceSec === 30)
        var since = 'half a minute ago';
      else if(sinceSec<60)
        var since = 'less than a minute ago';
      else
        var since = '1 minute ago';
  }
  else if (sinceMin < 45)
      var since = sinceMin + ' minutes ago';
  else if (sinceMin > 44 && sinceMin < 60)
      var since = 'about 1 hour ago';
  else if (sinceMin < 1440) {
      var sinceHr = Math.round(sinceMin / 60);
  if (sinceHr === 1)
    var since = 'about 1 hour ago';
  else
    var since = 'about ' + sinceHr + ' hours ago';
  }
  else if (sinceMin > 1439 && sinceMin < 2880)
      var since = '1 day ago';
  else {
      var sinceDay = Math.round(sinceMin / 1440);
      var since = sinceDay + ' days ago';
  }
  return since;
};




});

