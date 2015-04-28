/**
 * Author: shuson
 * Date: Apr/02/2015
 */
'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var chalk = require('chalk');

var cmd = {
    "debug" : false
};

var loadConfig = function () {
    var config = {};
    
    if(fs.existsSync(cmd.config)) {
        config = require(path.join(__dirname, "../", cmd.config)); //fs has different path with require module
        
        _reversedProxy(config);
        
        if(cmd.debug) console.log(config.port);
    }else{
        console.log(chalk.red(cmd.config + " doesn't exsist!"));
        process.exit(1);
    }
};

//create proxy-reverser server
var _reversedProxy = function (cfg){
    var pr_server = http.createServer();
    
    var host = cfg.host || "127.0.0.1";
    var port = cfg.port || "8090";
    
    pr_server.on("request", function (req, res){
        if(cmd.debug) console.log("connected by " + req.headers.host);
        
        var vhosts = cfg.vhosts;
        
        vhosts.forEach(function(vhost){
            
            vhost.rules.forEach(function(rule){
                var regxRule = new RegExp(rule);
                
                if(regxRule.test(req.url)) {
                    var options = {
                        hostname: vhost.host,
                        port: vhost.port,
                        path: req.url,
                        method: req.method,
                        headers: req.headers
                    };

                    var reversedReq = http.request(options, function(reverseRes) {
                        if(cmd.debug) console.log('Status Code: ' + reverseRes.statusCode);
                        if(cmd.debug) console.log('Headers: ' + JSON.stringify(reverseRes.headers));

                        reverseRes.setEncoding('utf8');
                        reverseRes.on('data', function (chunk) {
                            if(cmd.debug) console.log('BODY: ' + chunk);

                            res.write(chunk);
                            res.end();
                        });
                    });


                    reversedReq.on('error', function(e) {
                        console.log('problem with request: ' + e.message);
                    });

                    reversedReq.end();
                    break;
                }
            });
        });
    });
    
    pr_server.listen(port, host, function (){    
        console.log("Server is on %s:%s", host, port);
    });
}

//git pull request test 2
module.exports = {
    cmd: cmd,
    run: loadConfig
};
