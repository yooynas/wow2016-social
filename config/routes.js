// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {
  this.root('pages#dashboard');

  this.match('/chat', 'pages#chat');
  this.match('/data', 'pages#data');

  this.match('/api/web/conversation', 'api#web_conversation', { via : "post"} );

  this.match('/api/socialdata', 'api#social_data');

  this.match('/api/sentiment', 'api#sentiment');
  // Add the emotional tone route here

  this.match('/api/emotionaltoneovertime', 'api#emotional_tone_over_time');

  this.match('/api/incoming', 'api#deleteIncoming', { via : "delete" });

  this.match('/login', 'auth#login');
  this.match('/logout', 'auth#logout');
  this.match('/authenticate', 'auth#authenticate', { via : 'post' });
}
