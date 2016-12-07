'use strict';

var Call = require('./call.js').call;

var fetch = new Call('git');
fetch.setArguments(['fetch']);

fetch.onClose = ()=> {
  baseHash.new = localHash.new = remoteHash.new = false;
  baseHash.run();
  localHash.run();
  remoteHash.run();
};

var localHash = new Call('git');
localHash.setArguments(['rev-parse', '@']);
localHash.outHandler = (data)=> {
  localHash.new = true;
  localHash.data = data;
  compare();
};

var remoteHash = new Call('git');
remoteHash.setArguments(['rev-parse', '@{u}']);
remoteHash.outHandler = (data)=> {
  remoteHash.new = true;
  remoteHash.data = data;
  compare();
};

var baseHash = new Call('git');
baseHash.setArguments(['merge-base', '@', '@{u}']);
baseHash.outHandler = (data)=> {
  baseHash.new = true;
  baseHash.data = data;
  compare();
};

var pull = new Call('git');
pull.setArguments(['pull']);
pull.outHandler = (data)=> {
  console.log(data);
};

pull.onClose = ()=> {
  console.log('Updated!');
  location.reload();
};

var compare = ()=> {
  if (localHash.new && remoteHash.new && baseHash.new) {

    if (remoteHash.data == baseHash.data || localHash.data == remoteHash.data) {
      console.log('Up to date.');
    } else {
      pull.run();
    }
  }
};

setInterval(fetch.run, 6000);
