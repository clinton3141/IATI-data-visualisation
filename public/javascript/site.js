

//
//
//
//
/// plugins/extensions

_.mixin({
    /*  as_text : Normalise text values of the of the json from IATI

    The reason this can be an issue is that converting the xml to json:

    <title>The Title</title>
        ->  {title:'The Title'}

    <title xml:lang="en">The Title</title>
        ->  {title:{"@xml:lang":"en", "#text":'The Title'}}

    calling `_.to_s({…the object…})` will return the whichever value is available
    */
    as_text:function(node){
        return node['#text'] || node;
    },

    as_array: function(nodes){
      return nodes === undefined ? undefined :
               (_.isArray(nodes) ? nodes : [nodes]);
    }



});



/// API requester
var request = (function(){

  var socket = io.connect('http://' + location.host);

  var callbacks = {};
  var cbCounter = 0;

  socket.on('api', function(data) {
    if(data.error){
      console.error("Server API Request error:", data.error);
    } else {
      callbacks[data.cb](data.response);
    }
    delete callbacks[data.cb];
  });

  return function (params, callback) {
    // register callback
    var cbid = 'cb'+(cbCounter++);

    callbacks[cbid] = callback;

    _.defaults(params, request.defaults || {});

    //send request
    socket.emit ('api', {params:params, cb:cbid});
  };
}());



// alternative, use standard ajax - comment this out to 
// switch back to websocket transport
var request = function(params, callback){
	$.getJSON('api',params).done(callback);
}
