var irc = require("irc");
var translate = require("translate");
var format = require("./format");
var reporter = require("./reporter");
var builds = require("./builds");

function welshify(text, callback)
{
  translate.text({input:'English',output:'Welsh'}, text, function (err, result) {
    callback(err ? text : result);
  });
}

function say()
{
  var text = format.apply(null, arguments);
  client.say(kChannels[0], text);
}

builds.on("problem", function (event) {
  if (event.result === builds.kBuildbotSuccess) {
    reporter.success(say, event);
  } else {
    reporter.failure(say, event);
  }
});

var kChannels = [
  "#afrosdwilsh",
];

var client = new irc.Client("irc.mozilla.org", "afrosdwilsh", {
  debug: true,
  channels: kChannels,
});

client.addListener("error", function(m) {
  console.error(m);
});
client.addListener("message", function(from, to, message) {
  var action = /ACTION (.+)/.exec(message);
  if (action) {
    console.log(" * " + from + " " + action[1]);
  }
  else {
    console.log("<" + from + "> " + message);
  }
});
