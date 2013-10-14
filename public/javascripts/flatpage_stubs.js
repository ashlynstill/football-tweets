/* flatpage_stubs.js
 *
 * This code is to be used by property developers inside iframes to
 * implement certain CMGd JS APIs via the bridge in flatpage.js
 */

function REQ(data) {
    window.parent.postMessage(JSON.stringify({
        cmg_iframe_req: data
    }), "*");
}

// Omniture stubs
if (typeof cmg === 'undefined') {

    cmg = {
        s_coxnews: {
            utilities: {
                track_event: function() {
                    var ev = Array.prototype.shift.call(arguments);
                    var el = Array.prototype.shift.call(arguments);
                    var desc = Array.prototype.pop.call(arguments);
                    var props = Array.prototype.slice.call(arguments);
                    REQ({'metric': {
                        event: ev,
                        properties: props,
                        description: desc
                    }});
                }
            }
        }
    };
}

// Adgeletti stubs
if (typeof Adgeletti === 'undefined') {
    Adgeletti = {
        refresh: function() {
            REQ({ad: "refresh"});
        }
    };
}
