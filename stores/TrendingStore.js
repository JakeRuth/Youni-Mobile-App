'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var trendingStore = Unicycle.createStore({

  init: function() {
    this.set({
      trendingProfiles: []
    });
  },

  $populateTrendingProfiles() {
    var profiles = [];
    for (var i = 0; i < 24; i++) {
      profiles.push({
        profileImageUrl: this._getFakeProfileImageUrl()
      });
    }
    this.set({
      trendingProfiles: profiles
    });
  },

  getTrendingProfiles: function() {
    return this.get('trendingProfiles');
  },

  _getFakeProfileImageUrl: function() {
    var randomIndex = Math.floor(Math.random() * 16);
    var randomUrls = [
      'http://blog.soundidea.co.za/home/22/files/A%20quick%20guide%20to%20opt%20pic%202.jpg',
      'http://levoleague-wordpress.s3.amazonaws.com/wp-content/uploads/2013/02/How-to-take-a-professional-headshot.jpg',
      'http://www.customerparadigm.com/images/photography/colorado/Boulder-Denver/Professional-Headshots/professional-headshot-photographer-carl.jpg',
      'http://www.movementislifecaucus.com/wp-content/uploads/headshot-Templeton.jpg',
      'http://allthingsd.com/files/2011/11/Peter-Pham-headshot.png',
      'http://www.davidnoles.com/wp/wp-content/uploads/2014/02/headshots-nyc-new-york-city_lupita-393.jpg',
      'http://www.colemanphotographix.com/wp-content/uploads/MensHeadshot-0020.jpg',
      'https://studio311.files.wordpress.com/2010/11/actor-headshot-ali-grant-1.jpg',
      'http://www.leifhurst.com/wp-content/uploads/2013/08/Dallas_Headshot_Photographer_Actor-5.jpg',
      'http://www.colemanphotographix.com/wp-content/uploads/NicholasJColeman-Headshot-WEB-357x500.jpg',
      'http://static1.squarespace.com/static/511526cde4b067782b69109c/517aa359e4b0ab81ac8d931c/517aa3c2e4b0aef614c676ab/1366992242284/21-corporate-headshot-photo-ac_111002_115153_2554-12x18.JPG-1500px.JPG',
      'http://highlinewest.com/wp-content/uploads/2013/05/lien-yeung-cbc-headshot-photographer.jpg',
      'http://www.jandjphotography.net/sites/default/files/gallery/headshot2.jpg',
      'http://cdn.picturecorrect.com/wp-content/uploads/2013/11/modern-corporate-headshot-technique-3.jpg',
      'http://www.digitalheadshotsnyc.com/blog/wp-content/uploads/2013/01/Straight-On-Headshot4.JPG',
      'http://cdn23.us1.fansshare.com/photos/morganfreeman/mf-headshot-high-res-cropped-1769147625.jpg'
    ];
    return randomUrls[randomIndex];
  }

});

module.exports = trendingStore;
