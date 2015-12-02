'use strict';

var React = require('react-native');
var Unicycle = require('./../../../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var postLikeModalStore = Unicycle.createStore({

  init: function() {
    this.set({
      isVisible: false,
      isRequestInFlight: false,
      likers: []
    });
  },

  $getLikersForPost(postId) {
    var that = this;

    this.set({
      isRequestInFlight: true
    });

    request
     .post('/post/getLikerDisplayNames')
     .use(prefix)
     .send({
       postIdString: postId
     })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if ((res !== undefined) && (res.ok)) {
         that.set({
           likers: res.body.users
         });
       }
       else {
         //TODO: implement failed case (show user error message or cached results)
       }
       that.set({
         isRequestInFlight: false
       })
    });
  },

  $setIsModalVisible: function(isVisible) {
    this.set({
      isVisible: isVisible
    });
  },

  getIsVisible: function() {
    return this.get('isVisible');
  },

  getLikerDisplayNames: function() {
    return this.get('likers');
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
  }

});

module.exports = postLikeModalStore;
