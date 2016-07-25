'use strict';

var React = require('react-native');
var immutable = require('immutable');
var Unicycle = require('../../Unicycle');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostUtils = require('../../Utils/Post/PostUtils');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var MAX_POSTS_PER_PAGE = 12;

var manageGroupPhotosStore = Unicycle.createStore({

  init: function() {
    this.set({
      posts: [],
      isLoading: true,
      isNextPageLoading: false,
      isDeletePostsRequestInFlight: false,
      offset: 0,
      noMorePostsToFetch: false,
      selectedPosts: []
    });
  },

  reInit: function() {
    this.set({
      posts: [],
      isLoading: true,
      isNextPageLoading: false,
      isDeletePostsRequestInFlight: false,
      offset: 0,
      noMorePostsToFetch: false,
      selectedPosts: []
    });
  },
  
  requestPosts: function(groupId) {
    var that = this,
        currentPosts = this.getPosts(),
        offset = this.getOffset();
  
    if (offset === 0) {
      this.set({
        isLoading: true
      });
    }
    else {
      this.set({
        isNextPageLoading: true
      });
    }
  
    AjaxUtils.ajax(
      '/feed/getGroupFeed',
      {
        requestingUserEmail: userLoginMetadataStore.getEmail(),
        groupIdString: groupId,
        maxToFetch: MAX_POSTS_PER_PAGE,
        fetchOffset: offset
      },
      (res) => {
        var postsArray = PostUtils.createPostsJsonFromGreedy(res.body.posts, offset);
        var newPosts = immutable.List(postsArray);
        var allPosts = immutable.List(currentPosts).concat(newPosts);
  
        that.set({
          posts: allPosts,
          offset: offset + MAX_POSTS_PER_PAGE,
          isLoading: false,
          isNextPageLoading: false,
          noMorePostsToFetch: !res.body.moreToFetch
        });
      },
      () => {
        that.set({
          isLoading: false,
          isNextPageLoading: false
        });
      }
    );
  },

  removePosts: function(groupId, callback) {
    var that = this,
        currentOffset = this.getOffset(),
        posts = this.get('posts'),
        selectedPosts = this.getSelectedPosts(),
        postIdStringsToDelete = this.getSelectedPostIdStrings();

    this.set({
      isDeletePostsRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/group/removePosts',
      {
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        groupIdString: groupId,
        postIdStrings: postIdStringsToDelete
      },
      (res) => {
        let postIdsToDelete = [];
        for (var i = 0; i < selectedPosts.size; i++) {
          postIdsToDelete.push(selectedPosts.get(i).id);
        }
        
        let updatedPostList = PostUtils.removePostsFromList(posts, postIdsToDelete);

        this.set({
          isDeletePostsRequestInFlight: false,
          selectedPosts: [],
          posts: updatedPostList,
          offset: currentOffset - postIdStringsToDelete.length
        });
        callback();
      },
      () => {
        this.set({
          isDeletePostsRequestInFlight: false
        });
      }
    );
  },
  
  togglePostInList: function(post) {
    var posts = this.get('selectedPosts'),
        indexOfPost = posts.indexOf(post),
        isPostInList = indexOfPost !== -1;
    
    if (isPostInList) {
      this.set({
        selectedPosts: posts.splice(indexOfPost, 1)
      });
    }
    else {
      this.set({
        selectedPosts: posts.push(post)
      });
    }
  },
  
  isLoading: function() {
    return this.get('isLoading');
  },
  
  isNextPageLoading: function() {
    return this.get('isNextPageLoading');
  },

  isDeletePostsRequestInFlight: function() {
    return this.get('isDeletePostsRequestInFlight');
  },
  
  isPostIdSelected: function(id) {
    return this.getSelectedPostIdStrings().indexOf(id) !== -1;
  },
  
  getPosts: function() {
    return this.get('posts').toJSON();
  },
  
  getOffset: function() {
    return this.get('offset');
  },
  
  getNoMorePostsToFetch: function() {
    return this.get('noMorePostsToFetch');
  },
  
  getSelectedPosts: function() {
    return this.get('selectedPosts');
  },

  getSelectedPostIdStrings: function() {
    var selectedPosts = this.getSelectedPosts(),
        postIdStrings = [];

    for (var i = 0; i < selectedPosts.size; i++) {
      postIdStrings.push(selectedPosts.get(i).postIdString);
    }

    return postIdStrings;
  }

});

module.exports = manageGroupPhotosStore;
