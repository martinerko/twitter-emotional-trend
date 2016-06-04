var basic_choropleth = new Datamap({
  element: document.getElementById('basic_choropleth'),
  projection: 'mercator',
  fills: {
    defaultFill: '#ABDDA4'
  },
  geographyConfig: {
    highlightOnHover: false,
    highlightBorderColor: '#bada55',
    popupTemplate: function(geography, data) {
      if (!data) {
        return '<div class="hoverinfo">' + geography.properties.name + '</div>';
      }
      var tweet = data.tweet;
      var template = '<div class="hoverinfo">';
      template += 'Last tweet from: ' + geography.properties.name + ' by: ';
      template += '<a href="https://twitter.com/' + tweet.user + '" target="_blank">@' + tweet.user + '</a>';
      template += '<div class="tweet">';
      template += '<a href="https://twitter.com/' + tweet.user + '/status/' + tweet.id + '" target="_blank">' + tweet.text + '</a>';
      template += '</div>';
      template += '</div>';
      return template;
    }
  }
});

var socket = io('http://localhost:3000');
socket.on('tweet', function(tweet) {
  var data = {};
  data[tweet.countryCode] = {
    color: tweet.color,
    tweet: tweet
  };
  basic_choropleth.updateChoropleth(data);
});
