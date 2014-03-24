window.Seddit = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    window.Seddit.router = new Seddit.Routers.SubRouter({
      $rootEl: $("#content")
    });
    Backbone.history.start();
  }
};

Backbone.CompositeView = Backbone.View.extend({
  subviews: function() {
    if(!this._subviews) {
      this._subviews = [];
    }
    return this._subviews;
  },

  addSubview: function(view) {
    this.subviews().push(view)
  },

  removeSubview: function(view) {
    if (this.subviews().indexOf(view) > -1) {
      this.subviews().splice(this.subviews().indexOf(view), 1);
    }
  },

  findSubviewByModel: function(model) {
    var foundView = null;
    this.subviews().forEach(function(subview) {
      if (subview.model === model) {
        foundView = subview;
      }
    });
    return foundView;
  },

  removeSubviewByModel: function(model) {
    var foundView = this.findSubviewByModel(model);
    if (foundView) {
      this.removeSubview(foundView);
    }
  },

  renderSubviewByModel: function(model) {
    var foundView = this.findSubviewByModel(model);
    if (foundView) {
      this.subviews().indexOf(foundView).render();
    }
  },

  remove: function() {
    this.subviews().forEach(function(subview) {
      subview.remove();
    })
    this.stopListening();
    this.$el.remove();
  }
});

Backbone.VotableModel = Backbone.Model.extend({
  parse: function(data, options) {
    //constructs this.vote - vote is attached to model
    if(data["already_voted"]) {
      this.vote = new Seddit.Models.Vote({
        votable_id: data["id"],
        votable_type: data["class_name"],
        up: data["upvoted"],
        id: data["vote_id"]
      });
    } else {
      this.vote = new Seddit.Models.Vote({
        votable_id: data["id"],
        votable_type: data["class_name"]
      });
    };
    return data
  },

  upvote: function(event) {
    this.vote.save({ "up": true });

    var karmaDiff = this.vote.isNew() ? 1 : 2;
    this.set("karma", this.get("karma") + karmaDiff);
  },

  downvote: function(event) {
    this.vote.save({ "up": false });

    var karmaDiff = this.vote.isNew() ? -1 : -2;
    this.set("karma", this.get("karma") + karmaDiff);
  },

  removeVote: function(event) {
    var karmaDiff = this.vote.get("up") ? -1 : 1;
    this.vote.destroy();

    //re-initialize fresh, not-yet-persisted vote
    //remember to have views listen to the new model.vote!
    this.vote = new Seddit.Models.Vote({
      votable_id: this.get("id"),
      votable_type: this.get("class_name")
    });
    this.set("karma", this.get("karma") + karmaDiff);
  }
});