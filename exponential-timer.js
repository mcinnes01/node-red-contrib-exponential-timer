module.exports = function(RED) {
    function ExponentialTimer(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg, send, done) {
            let timeout = context.get("timer");
            let timeoutId = context.get("timeoutId");
            clearTimeout(timeoutId);
            
            this.scalefactor = config.scalefactor;
            this.duration = config.duration;
            this.maxduration = config.maxduration;
            
            if(msg.reset) {
                context.set("timer",null);
                node.status({text: 'reset'});
                return;
            }
            
            if(timeout) {
                timeout = Math.min(this.duration * this.scalefactor, this.maxduration);
            } else {
                timeout = this.duration;
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

            // If an error is hit, report it to the runtime
            if (err) {
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