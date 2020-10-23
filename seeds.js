var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
    {
        name: 'Moraine Park Campground',
        image: 'https://www.tripsavvy.com/thmb/inFoL6NhIZC1DNRU8nO7-fTcCUg=/800x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-600968284-5a564d98e258f800375e04bf.jpg',
        description: 'Rocky Mountain National Park has five excellent campsites, but our favorite by far is Moraine Park. Not only does the site offer excellent views of the breathtaking landscapes of the nearby peaks, but campers are often able to spot passing wildlife, too. With black bears, moose, mountain lions, sheep, and elk all living within the park, sharp-eyed travelers can often see these creatures wandering through their natural habitat. Best of all, the site is open year-round for those who want a winter camping excursion that is even more quiet and secluded.'
    },
    {
        name: 'Bear Lake Campground',
        image: 'https://www.tripsavvy.com/thmb/erLy6CMG5WByDddTjUY0naQSwcc=/800x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-699107115-5a564b439802070037207b40.jpg',
        description: 'Bear Lake is another scenic campsite that provides great access for anglers looking to catch some Colorado trout. The nearby Cucharas River is an excellent fishing hole for both casual and serious fly fishers looking to spend some time on the water. This campground also provides easy access to the 14-mile long Indian Creek Trail too, which is open not only to hikers and mountain bikers, but also ATVs and horses as well'
    },
    {
        name: 'Maroon Bells',
        image: 'https://www.tripsavvy.com/thmb/SgqD3unyzBBtwNQb7KBqDc-ytik=/800x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Maroonbells3-1-b6c31281721e4bfe82ef1ea442f84973.jpg',
        description: 'One of the most famous settings in the entire state of Colorado is the Maroon Bells, a pair of 14,000-foot mountains that are amongst the most photographed peaks in all of North America. Backpackers and car campers will find three campsites in the shadow of the mountain, each of which provides access to this spectacular wilderness setting, which includes the gorgeous Maroon Lake.'
    }
]

function seedDB(){
    // Remove all Campgrounds
    Campground.remove({},function(err){
        if(err) console.log(err);
        else console.log('removed');

        // Add a few Campgrounds
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err) console.log(err);
                else{ 
                    console.log('Added a campground');
                    // Add a few commnets eventually 
                    Comment.create(
                        {
                            text: 'This place is great, but I wish there was internet',
                            author: 'nandu'
                        } , 
                        function(err,comment){
                            if(err) console.log(err);
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log('Created a new comment');
                            }
                        }
                    );
                }
            });
        });
    });
}

module.exports = seedDB;
