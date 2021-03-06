var navs = {
  "#nav-home": "#content-home",
  "#nav-resume": "#content-resume",
  "#nav-blog": "#content-blog",
  "#nav-contact": "#content-contact"
};
// This map determines the page left/right order
var contents = {
  "#none": 0,
  "#content-home": 1,
  "#content-resume": 2,
  "#content-blog": 3,
  "#content-contact": 4
};
var heights = {
  "#content-home": "content-home-height",
  "#content-resume": "content-resume-height",
  "#content-blog": "content-blog-height",
  "#content-contact": "content-contact-height"
};
var scrollers = {
  // clicked scroller link  // link to scroll to      // nav container that scroll to is in 
  "#scroller-employment": [ "#resume-employment", "#nav-resume" ],
  "#scroller-education": [ "#resume-education", "#nav-resume" ],
  "#scroller-skills": [ "#resume-skills", "#nav-resume" ],
  "#scroller-activities": [ "#resume-activities", "#nav-resume" ]
};

// -------------------------------------------------
// Main ready function
//
$(document).ready( function(){
  
  // Nav icon clicks
  for (var nav in navs) {
    if (navs.hasOwnProperty(nav)) {
      navClick(nav);
    }
  }
  
  // Scrollers
  for (var link in scrollers) {
    if (scrollers.hasOwnProperty(link)) {
      scrollTo(link);
      scrollerClick(link);
    }
  } 
  $(".backToTop").click(scrollToTop);
  
  // Scroll mask transitions
  for (var i=0; i < maskIds.length; i++) {
    scrollThumbnailMask(maskIds[i], maskContents[i]);
  }

  // Modals
  modalHandler();
});

// -------------------------------------------------
// Others
//

function navClick(navClick) {	
  $(navClick).click( function(e) { 	 	
    // Prevent jumping to anchor (top of page) when clicked
  	switchPage(navClick, true);
  	e.preventDefault();
    // log nav click  	
    $.ajax({
      type: "GET",
      url: "/nav?n=" + navClick.substring(1, navClick.length)
    });
  	return false;
  });
}

function scrollerClick(scrollerClick) {	
  $(scrollerClick).click( function(e) { 	 	
    // log scroller click  	
    $.ajax({
      type: "GET",
      url: "/scroller?n=" + scrollerClick.substring(1, scrollerClick.length)
    });
  	return false;
  });
}

function switchPage(navClick, wiggleOn) {	
  	var contentClick = navs[navClick];
    var contentCurrent = getCurrentContent(); 	
  	var contentChanged = false;
  	
  	if (contentClick != contentCurrent) {	
  	  contentChanged = true;
  	  var navCurrent = getCurrentNav();	
  	  
  	  // change height of page wrapper to the clicked page height
  	  contentHeightTransition(contentCurrent, contentClick);
  	  
  	  // clear previous moves and/or positioning
  	  clearMoves(contentClick);
  	  clearMoves(contentCurrent);
  	  clearSets(contentCurrent);
      clearSets(contentClick);
      
      // check the pages relative positioning, and then move pages and navs accordingly
  	  if (isALeftOfB(contentCurrent, contentClick)) {
        $(contentCurrent).addClass("content-moveToLeft").removeClass("content-current");
      	$(contentClick).addClass("content-moveFromRight").addClass("content-current");
       	navTransition(navCurrent, navClick);
      }
      else {
        $(contentCurrent).addClass("content-moveToRight").removeClass("content-current");
        $(contentClick).addClass("content-moveFromLeft").addClass("content-current");
        navTransition(navCurrent, navClick);	
      }            
   } else if (wiggleOn) {
     animateIcon(navClick, "wiggle");
   }
   return contentChanged;
}

function getCurrentContent() {
  for (var content in contents) {
    if (contents.hasOwnProperty(content)) {
      if ($(content).hasClass("content-current")) {
        return content;
      }
    }
  }	 
  return "#none";	
}

function getCurrentNav() {
  for (var nav in navs) {
    if (navs.hasOwnProperty(nav)) {
      if ($(nav).hasClass("nav-current")) {
        return nav;
      }
    }
  }	 
  return "#none";	
}


function contentHeightTransition(contentFrom, contentTo) {
  var $wrapper = $("#content-wrapper");
  $wrapper.removeClass(heights[contentFrom]);
  $wrapper.addClass(heights[contentTo]);
}

function isALeftOfB(A, B) {
  return contents[A] < contents[B];
}
function isARightOfB(A, B) {
  return contents[A] > contents[B];
}

function clearSets(content) {
  var setClasses = ["setToLeft", "setToCenter", "setToRight"]; 
  for (var i in setClasses) {
    if (setClasses.hasOwnProperty(i)) {
      if ($(content).hasClass(setClasses[i])) {
        $(content).removeClass(setClasses[i]);
      }
    }
  }	
}

function clearMoves(content) {
  var moveClasses = [
    "content-moveToLeft", 
    "content-moveToCenter", 
    "content-moveToRight",
    "content-moveFromLeft",
    "content-moveFromRight"
  ]; 
  for (var i in moveClasses) {
    if (moveClasses.hasOwnProperty(i)) {
      if ($(content).hasClass(moveClasses[i])) {
        $(content).removeClass(moveClasses[i]);
      }
    }
  }	
}

function navTransition(navFrom, navTo) {
  $(navFrom).removeClass("nav-current");
  $(navTo).addClass("nav-current");
  animateIcon(navTo, "bounce");
}

function animateIcon(nav, animateClass) {
  $(nav).addClass(animateClass);	
  setTimeout(function() {
  	$(nav).removeClass(animateClass);
  }, 650);
}	

function scrollTo(link) {
  $(link).click( function(e) {
  	// First make sure we are on the right displayed page
  	var navClick = scrollers[link][1];
  	var doDelay = switchPage(navClick, navClick == "#nav-home");
  	var delay = doDelay ? 200 : 0;
  	// Then scroll
  	var goToElement = scrollers[link][0];
  	if (goToElement !== "#") { 
      $('html,body').animate({
    	  scrollTop: $(goToElement).offset().top
      }, 800);
    }
  });
}

var scrollToTop = function() {
  $('html,body').animate({
  	scrollTop: 0
  }, 800);
};
