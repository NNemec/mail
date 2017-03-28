/**
 * Update handler for transition database version 5 -> 6
 */
export default function update(options) {
    var emailDbType = 'email_',
        versionDbType = 'dbVersion',
        postUpdateDbVersion = 6;

    // remove the emails
    return options.userStorage.removeList(emailDbType).then(function() {
        // update the database version to postUpdateDbVersion
        return options.appConfigStorage.storeList([postUpdateDbVersion], versionDbType);
    });
}
