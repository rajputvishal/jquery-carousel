/**
 * $Id: jquery.pd.carausel.js 140340 2019-09-19 17:41:00Z vrajput $
 */
(function($){

    $.fn.advCarousel = function(options, extraParameter) {
        return this.each(function() {
            var data = $(this).data('AdvanceCarousel');
            if(!data) {
                data = new AdvanceCarousel(this, options);
                $(this).data('AdvanceCarousel', data);
            } else {
                if(!extraParameter) {
                    extraParameter = data.$options;
                }
                if(typeof options == "string") {
                    data[options](extraParameter);
                }
            }
        })
    }

    //constructor
    function AdvanceCarousel(element, options) {
        this.$element = $(element);
        this.$options = $.extend(true, {}, this.defaults, options);
        this.$activeSlide = null;
        this.$slides = [];
        var items = this.$options.items;
        
        this.$element.addClass(this.$options.containerClass);
        this.buildContainer();
        for(var i = 0; i < items.length; i++) {
            var itemOptions = $.extend(true, {}, this.$options.item, items[i]);
            var slide = this.buildSlide(itemOptions);
            this.$slides.push(slide);
            this.$container.children().append(slide);
        }
        this.$slides[0].addClass("active");
        this.$element.append(this.$container);
    }

    AdvanceCarousel.prototype = {
        defaults: {
            item: {
                next: {
                    class: "slide-next",
                    enabled: false,
                    text: "Next",
                    nextItem: null,
                    onNext: function(data, callback, ref) {
                        data.isApproved = true;
                        callback.apply(ref, [data]);
                    }
                },
                prev: {
                    class: "slide-prev",
                    enabled: false,
                    text: "Previouse",
                    prevItem: null,
                    onPrev: function(data, callback, ref) {
                        data.isApproved = true;
                        callback.apply(ref, [data]);
                    }
                },
                reset: {
                    class: "slide-reset",
                    enabled: false,
                    text: "Cancel",
                    onReset: function(data, callback, ref) {
                        callback.apply(ref, [data]);
                    }
                },
                class: 'slide-item',
                onCreate: $.noop,
                onLoad: $.noop,
                onUnload: $.noop
            },
            items: [],
            templates: {
                parent: '<div class="carousel slide"><div class="carousel-inner"></div></div>',
                item: '<div class="carousel-item"></div>',
                prevButton: '<button class="btn btn-default" data-loading-text="Loading..."></button>',
                nextButton: '<button class="btn btn-default" data-loading-text="Loading..."></button>',
                resetButton: '<button class="btn btn-default" data-loading-text="Loading..."></button>'
            },
            resetButtonClass: 'btn btn-default slide-reset',
            nextButtonClass: 'btn btn-default slide-next',
            prevButtonClass: 'btn btn-default slide-prev',
            slideClass: 'slide',
            containerClass: 'adv-carousel'
        },
        /**
		 * Builds the container of the carousel.
		 */
		buildContainer: function() {
            this.$container = $(this.$options.templates.parent);
            return this.$container;
		},

        buildSlide: function(item) {
            var parent = this;
            var slide = $(this.$options.templates.item).addClass(this.$options.slideClass);
            slide.addClass(item.class);
            
            //add the content here
            item.onCreate(slide);
            
            if(item.prev.enabled) {
                var prevButton = $('<button></button>').addClass(this.$options.prevButtonClass);
                prevButton.addClass(item.prev.class);
                prevButton.html(item.prev.text);
                prevButton.data("slide-next", item.prev.prevItem);
                item.prev.element = prevButton;
                prevButton.on("click", $.proxy(function(event){
                    item.prev.onPrev(item, parent.goBackward, parent);
                }, slide))
                slide.append(prevButton);
            }

            //resets everything and move to first page
            if(item.reset.enabled) {
                var resetButton = $('<button></button>').addClass(this.$options.resetButtonClass);
                resetButton.addClass(item.reset.class);
                resetButton.html(item.reset.text);

                resetButton.on("click", $.proxy(function(event){
                    item.reset.onReset(item, parent.rebuild, parent);
                }, slide))
            }
            slide.append(resetButton);

            if(item.next.enabled) {
                var nextButton = $('<button></button>').addClass(this.$options.nextButtonClass);
                nextButton.addClass(item.next.class);
                nextButton.html(item.next.text);
                nextButton.data("slide-next", item.next.nextItem);
                //store button element in item
                item.next.element = nextButton;

                nextButton.on("click", $.proxy(function(event){
                    item.next.onNext(item, parent.goForward, parent);
                }, slide))
                slide.append(nextButton);
            }

            item.$ele = slide;
            slide.data("original", item);
            return slide;
        },

        goForward: function(data) {
            var carousel = this.$container;
            var item = carousel.find(".carousel-item.active");
            var nextItem = carousel.find(data.next.nextItem );
            var back = carousel.find(".carousel-back");
            
            if(nextItem.data("show") == "back"){
                var backAction = nextItem.data("back");
                if(backAction)
                    back.data("slide-back", backAction);
        
                back.removeClass("hidden");
            }
            else {
                back.addClass("hidden");
            }
        
            var width = carousel.width();
            var nextSlideData = nextItem.data("original");
            if(nextItem.length){
                nextItem.css({left: width + "px", top: 0, position: "absolute"});
                nextItem.addClass("active");
                item.animate({left: "-=" + width}, function(){
                    item.removeClass("active");
                });
                nextItem.animate({left: "-=" + width}, function(){
                    back.fadeIn();
                    nextItem.css({position: "relative"});
                });
                data.onUnLoad(data, nextSlideData);        
                nextSlideData.onLoad(nextSlideData, data);
            }
        }, 

        goBackward: function(data) {
            var carousel = this.$container;
            var item = carousel.find(".carousel-item.active");
            var nextItem = carousel.find(data.prev.prevItem );
            var back = carousel.find(".carousel-back");
        
            if(nextItem.data("show") == "back"){
                var backAction = nextItem.data("back");
                if(backAction)
                    back.data("slide-back", backAction);
        
                back.removeClass("hidden");
            }
            else {
                back.addClass("hidden");
            }
        
            var width = carousel.width();
            var nextSlideData = nextItem.data("original");

            if(nextItem.length){
                nextItem.css({left: "-" + width + "px", top: 0, position: "absolute"});
                nextItem.addClass("active");
                item.animate({left: "+=" + width}, function(){
                    item.removeClass("active");
                });
                nextItem.animate({left: "+=" + width}, function(){
                    back.fadeIn();
                    nextItem.css({position: "relative"});
                });
                data.onUnLoad(data, nextSlideData);
                nextSlideData.onLoad(nextSlideData, data);
            }

        },

        //function to destroy the carausel and rebuild it with new options if needed.
        rebuild: function(options) {
            $.extend(true, {}, this.$options, options);

            //clear the container
            this.$container.children().html("");
            this.$slides = [];

            var items = this.$options.items;

            //remove data instance from element

            for(var i = 0; i < items.length; i++) {
                var itemOptions = $.extend(true, {}, this.$options.item, items[i]);
                var slide = this.buildSlide(itemOptions);
                this.$slides.push(slide);
                this.$container.children().append(slide);
            }
            this.$slides[0].addClass("active");
            this.$element.append(this.$container);

        }
    }

    $.fn.advCarousel.Constructor = AdvanceCarousel;
})(jQuery)
