// some little play ideas for augmenting connect

(function() {
  
  function CallChain(node, evt){
    this._calls = [];
    this._handle = dojo.connect(node, evt, this, "callback");
  }
  
  dojo.extend(CallChain, {
    then: function(fn) {
      this._calls.push(fn);
      return this;
    },
    callback: function(o){
      var no;
      for(var i = 0, ret=o; i < this._calls.length; i++) {
        no = undefined;
        no = this._calls[i](ret);
        if(no === undefined) no = o;
        ret = no;
      }
      return this;
    },
    prevent: function(){
      this.then(_prevent);
      return this;
    },
    stop: function(){
      this.then(_stop);
      return this;
    },
    disconnect: function() {
      dojo.disconnect(this._handle);
      this._calls = [];
      delete this._handle;
    }
  });
  
  function _prevent(evt) {
    evt.preventDefault();
  }
  
  function _stop(evt) {
    evt.stopPropogation();
  }

  dojo.on = function(id, name) {
    id = dojo.byId(id);
    if(!id) throw new Error("No node with id '" + id + "' found");
    return new CallChain(id, name);
  };
  
  dojo.eat = function(id, name) {
    return dojo.on(id, name).prevent();
  };
  
})();


// sample test code
dojo.ready(function(){
  dojo.on("findMe", "click")
      .prevent()
      .then(function(evt) {
        dojo.style(evt.currentTarget, "color", "red");
      });
});
