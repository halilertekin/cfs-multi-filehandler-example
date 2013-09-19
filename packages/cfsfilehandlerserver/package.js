/**
 * Created with JetBrains WebStorm.
 * User: max
 * Date: 18.09.13
 * Time: 14:07
 * To change this template use File | Settings | File Templates.
 */
Package.describe({
    summary: "Quick insecure http fileserver for collectionFS "
});

Npm.depends({
    "connect": "2.9.0"
});

Package.on_use(function(api) {
    api.use(['routepolicy','webapp'], 'server');

    api.add_files([
        'cfs-file-server-insecure.js',
    ], 'server');
});