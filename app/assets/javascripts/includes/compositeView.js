Backbone.CompositeView = Backbone.View.extend({
  subviews: function() {
    if(!this._subviews) {
      this._subviews = [];
    }
    return this._subviews;
  },

  addSubview: function(view) {
    //unshift rather than push so that newer entries will be first
    this.subviews().unshift(view)
  },

  removeSubview: function(view) {
    if (this.subviews().indexOf(view) > -1) {
      this.subviews().splice(this.subviews().indexOf(view), 1);
    }
    view.remove();
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
    this.undelegateEvents();
    this.$el.remove();
  }
});