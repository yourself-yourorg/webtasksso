const convict = require('convict');

const config = convict({
    http: {
        svc_url: {
            doc: 'The microservice URL',
            default: 'https://wt-a0a68818c7b34a465e865e888dc419c9-0.run.webtask.io/spasso',
            env: 'SVC_URL'
        }
    },
    authentication: {
        google: {
            "clientId": {
                "doc": "The Client ID from Google to use for authentication",
                "default": "802095148185-54pkf994b1loejoh36pmniqnj1s54e1v.apps.googleusercontent.com",
                "env": "GOOGLE_CLIENTID"
            },
            "clientSecret": {
                "doc": "The Client Secret from Google to use for authentication",
                "default": "x26y9_D-RFerD0IiPlnhDSM3",
                "env": "GOOGLE_CLIENTSECRET"
            }
        },
        facebook: {
            "clientId": {
                "doc": "The Client ID from Facebook to use for authentication",
                "default": "",
                "env": "FACEBOOK_CLIENTID"
            },
            "clientSecret": {
                "doc": "The Client Secret from Facebook to use for authentication",
                "default": "",
                "env": "FACEBOOK_CLIENTSECRET"
            }
        },
        token: {
            "secret": {
                "doc": "The signing key for the JWT",
                "default": "mmemorableGobbledyGook",
                "env": "JWT_SIGNING_KEY"
            },
            "issuer": {
                "doc": "The issuer for the JWT",
                "default": "spasso"
            },
            "audience": {
                "doc": "The audience for the JWT",
                "default": "spasso"
            }
        }
    }
});

config.validate();

module.exports = config;
