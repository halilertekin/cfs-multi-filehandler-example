Images = new CollectionFS('images');// The cfs collection named "images"


if (Meteor.isClient) {
    //this variable is set if someone clicks on an image in the list
    Session.setDefault("selectedImageId",null);


    //all images for the list
    Template.imageList.images = function () {
        return Images.find()
    };

    //Example data for the list item
    Template.imageItem.formattedUploadedDate = function () {
        return new Date(this.uploadDate);
    };
    Template.imageItem.formatedSize = function () {
        return Math.round(this.length / 1024)+" KB";
    };
    //Handle the click events on the image in the list, sets the selectedImageItemId and shows the modal
    Template.imageItem.events = {

        "click .open-modal" : function(e,t){
            e.preventDefault();
            Session.set("selectedImageId", t.data._id);
            $('#imageModal').modal().modal("show");
        }
    };



    Template.imageModal.preserve(["#imageModal"]);//this is black magic, do not remove
    //this makes the selected image available in the modal template
    Template.imageModal.image = function(){
        var imageId = Session.get("selectedImageId");

        return Images.findOne({_id: imageId});
    }


    //drag and drop eventhandling, a simple stop/prevent handler for dragenter,-exit and -over
    //just the drop handler needs special code
    function noopHandler(e, t) {
        e.stopPropagation();
        e.preventDefault();
    };
    Template.dropZone.events = {
        'dragenter .drop-zone': noopHandler,
        'dragexit .drop-zone': noopHandler,
        'dragover .drop-zone': noopHandler,
        'drop .drop-zone': function (e, t) {
            noopHandler(e,t);

            var files = e.dataTransfer.files;//access all files that are dropped in

            for (var i = 0, f; f = files[i]; i++) { //store each file
                Images.storeFile(f);
            }

        }
    };

}

if (Meteor.isServer) {

    //configure file handler
    var handler = {
        "64x64": function (options) {
            //... Test that it's an actual image...

            // Uses meteorite package imagemagick.
            var destination = options.destination();
            Imagemagick.resize({
                srcData: options.blob,
                dstPath: destination.serverFilename, // Imagemagick will create the file for us.
                width: 64,
                height: 64
            });


            // Return the url
            return destination.fileData;
        },
        "bigSize": function (options) {
            //... Test that it's an actual image...

            // Uses meteorite package imagemagick.
            var destination = options.destination();
            Imagemagick.resize({
                srcData: options.blob,
                dstPath: destination.serverFilename, // Imagemagick will create the file for us.
                width: 512,
                height: 512
            });


            // Return the url
            return destination.fileData;
        }
    }
    Images.fileHandlers(handler);

}
