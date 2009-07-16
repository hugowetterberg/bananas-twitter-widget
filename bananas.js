jQuery('head').append('<link rel="stylesheet" href="bananas.css" type="text/css" media="screen" charset="utf-8" />');
function GoBananas(selector, kwargs) {
  var max_id=0, tweet_wrapper, tweets,
    url_to_a = /\b(http:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,4}(?:[-a-z0-9_:&?=+,.!\/*%\$]*)?)\b/gim,
    user_to_a = /@([a-z0-9-_]+)\b/gim,
    hash_to_a = /#([^"\s]+)\b/gim,
    get_tweets = function() {
      jQuery.getJSON('http://search.twitter.com/search.json?callback=?', {
        'q': kwargs.keywords.join(' OR '),
        'rpp': 10,
        'since_id': max_id
      }, loaded);
    },
    loaded = function(data) {
      var i, rcount = data.results.length, text, tweet, 
        animate=jQuery('#bananas .tweet').length;
      if (data.max_id>0) {
        max_id = data.max_id;
      }
      for (i=rcount-1; i>=0; i--) {
        tweet = jQuery('<div class="tweet"></div>').hide().prependTo(tweets);
        tweet.append('<a target="blank" href="http://twitter.com/' + data.results[i].from_user + '">' + data.results[i].from_user + '</a>: ');
        text = data.results[i].text
          .replace(url_to_a, '<a target="blank" href="$1">$1</a>')
          .replace(user_to_a, '<a target="blank" href="http://twitter.com/$1">@$1</a>')
          .replace(hash_to_a, '<a target="blank" href="http://search.twitter.com/search?q=%23$1">#$1</a>');
        jQuery('<p></p>').appendTo(tweet).html(text);
        if (animate) {
          tweet.slideDown(1000);
        }
        else {
          tweet.show();
        }
      }
      setTimeout(get_tweets, 5000);
      setTimeout(clean_up, 1000);
    },
    clean_up = function() {
      var max_top = jQuery(tweet_wrapper).height();
      // Remove or fade out tweets that goes too far down
      jQuery('#bananas .tweet').each(function() {
        var top = jQuery(this).position().top;
        if (top > max_top) {
          jQuery(this).remove();
        }
        else if ( top + jQuery(this).height() > max_top ) {
          jQuery(this).fadeOut(1000);
        }
      });
    };

  jQuery(selector)
    .append('<strong class="title">Live feed from twitter.com</strong>')
    .append('<span class="keywords">Keywords: ' + kwargs.keywords.join(', ') + '</span>');
  tweet_wrapper = jQuery('<div class="tweet-wrapper"></div>').appendTo(selector);
  tweets = jQuery('<div class="tweets"></div>').appendTo(tweet_wrapper);
  get_tweets();
}