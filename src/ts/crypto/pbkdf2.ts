/**
 * A Wrapper for Forge's PBKDF2 function
 */

'use strict';

/*
import * as forge from "node-forge";

// declare parts of node-forge that are missing in DT's .d.ts
declare module "node-forge" {
    namespace md {
        namespace sha256 {
            function create(): any;
        }
    }

    namespace pkcs5 {
        function pbkdf2(password: string, salt: string, iter_count: number, dkLen: number, md: any): string;
    }
};
*/
declare var forge: any;

var pbkdf2: any = {};

/**
 * PBKDF2-HMAC-SHA256 key derivation with a random salt and 10000 iterations
 * @param  {String} password  The password in UTF8
 * @param  {String} salt      The base64 encoded salt
 * @param  {String} keySize   The key size in bits
 * @return {String}           The base64 encoded key
 */
pbkdf2.getKey = function(password, salt, keySize) {
    var saltUtf8 = forge.util.decode64(salt);
    var md = forge.md.sha256.create();
    var key = forge.pkcs5.pbkdf2(password, saltUtf8, 10000, keySize / 8, md);

    return forge.util.encode64(key);
};

module.exports = pbkdf2;