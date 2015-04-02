module.exports = {
    vhosts: [
        'example1.com': {
            /**
             * The host and port to which we forward the requests.
             */
            'host': '127.0.0.1',
            'port': '8091',
            'rules': ['example1']
        },
        'example2.com': {
            /**
             * The host and port to which we forward the requests.
             */
            'host': '127.0.0.1',
            'port': '8092',
            'rules': ['example2']
        }
    ],
    host: "127.0.0.1",
    port: "8090"
}