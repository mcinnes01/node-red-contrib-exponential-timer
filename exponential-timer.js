module.exports = function(RED) {
    function ExponentialTimer(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var context = node.context();

        node.on('input', function(msg, send, done) {
            try {
                let timeout = context.get("timer");
                let timeoutId = context.get("timeoutId");
                clearTimeout(timeoutId);
                
                node.scalefactor = config.scalefactor;
                node.duration = config.duration;
                node.maxduration = config.maxduration;
                
                if(msg.reset) {
                    context.set("timer",null);
                    node.status({text: 'reset'});
                    return;
                }
                
                if(timeout) {
                    timeout = Math.min(node.duration * node.scalefactor, node.maxduration);
                } else {
                    timeout = node.duration;
                }
                
                timeoutId = setTimeout(() => {
                    context.set("timer",null);
                    node.status({});
                    node.send(msg);
                    node.done();
                }, timeout * 1000);
                
                context.set("timer", timeout);
                context.set("timeoutId", timeoutId);
                node.status({text: timeout});
            }
            catch(err) {
                if (done) {
                    // Node-RED 1.0 compatible
                    done(err);
                } else {
                    // Node-RED 0.x compatible
                    node.error(err, msg);
                }
            }
        });
    }
    RED.nodes.registerType("exponential-timer",ExponentialTimer,{
        settings: {
            scalefactor: {
                value: 1.5,
                exportable: true
            },
            duration: {
                value: 60,
                exportable: true
            },
            maxduration: {
                value: 300,
                exportable: true
            }
        }
    });
}