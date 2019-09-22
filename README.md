# jquery-carousel

### Features

Dependencies: 
Jquery.

Advance carousel is a simple and superfast plugin to make a "wizard" or a just a caraousel with more customizable options such as
where you need to perform operations on **create** or on **moving backward / forward** or on **loading or unloading** of a slide.

# How to use
- Include "jquery.carousel.js" in your html but make sure you add it **after** Jquery source files.
- Once that's done its time to make use caraousel.
- In your javascript file call "advCarousel" function on the element inside which you want to create the carousel. 
- Supply  the set of options to the "advCaraousel" function to let it know how many slide do you want to create and what do you want to do on while moving forward and backward.
example:

   		 $("#myCaraousel").advCarousel({
    			 items: [{
    			class: "slide1", //class for slide1 
    			next: {
    				enabled: true,
    				 nextItem: ".slide2", //selector for next slide
    				class: "next button class", //class that you wan to be added on next button
    				onNext: function(data, superCallback, ref) {
    					console.log("moving forward");
    					//change the data here if you need and call supercallback if to allow moving forward
    					superCallback.apply(ref, [data]);
    				}
    			},
    			onLoad: function(currentSlide, oldSlide) {
    				//code for handling on onload of current slide goes here.
    				//here you can call functions like gettting data from old slide that you want to use 
    				//in current slide.
    			},
    			onUnLoad: function(currentSlideData, nextSlideData) {
    				console.log("unloaded slide1")
    			},
    			prev: {
    				enabled: false, // as there is no slide to go back from slide 1
    			},
    		}],
		 });
###End
