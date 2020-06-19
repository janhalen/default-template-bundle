/**
 * Base slide, that just displays for slide.duration, then calls the callback.
 */

// Register the function, if it does not already exist.
if (!window.slideFunctions['base']) {
  window.slideFunctions['base'] = {
    /**
     * Setup the slide for rendering.
     * @param scope
     *   The slide scope.
     */
    setup: function setupBaseSlide(scope) {
      var slide = scope.ikSlide;

      // Only show first image in array.
      if (slide.media_type === 'image' && slide.media.length > 0) {
        slide.currentImage = slide.media[0].image;
      }

      // Set currentLogo.
      slide.currentLogo = slide.logo;

      // Setup the inline styling
      scope.theStyle = {
        width: "100%",
        height: "100%",
        fontsize: slide.options.fontsize * (scope.scale ? scope.scale : 1.0)+ "px"
      };

      // Set the responsive font size if it is needed.
      if (slide.options.responsive_fontsize) {
        scope.theStyle.responsiveFontsize = slide.options.responsive_fontsize * (scope.scale ? scope.scale : 1.0)+ "vw";
      }
    },

    /**
     * Run the slide.
     *
     * @param slide
     *   The slide.
     * @param region
     *   The region object.
     */
    run: function runBaseSlide(slide, region) {
      region.itkLog.info("Running base slide: " + slide.title);

      // Darkmode.
      if (slide.options.darkmode) {
        slide.darkmodeEnabled = false;

        var darkmodeFrom = slide.options.darkmode_from;
        var darkmodeTo = slide.options.darkmode_to;

        var hourNow = (new Date()).getHours();

        // Darkmode starts one day and ends the next.
        if (darkmodeFrom > darkmodeTo) {
          if (hourNow > darkmodeFrom) {
            slide.darkmodeEnabled = true;
          }
          else if (hourNow < darkmodeTo) {
            slide.darkmodeEnabled = true;
          }
        }
        else {
          if (hourNow >= darkmodeFrom && hourNow < darkmodeTo) {
            slide.darkmodeEnabled = true;
          }
        }
      }

      var duration = slide.duration !== null ? slide.duration : 15;

      // Wait fadeTime before start to account for fade in.
      region.$timeout(function () {
        // Set the progress bar animation.
        region.progressBar.start(duration);

        // Wait for slide duration, then show next slide.
        // + fadeTime to account for fade out.
        region.$timeout(function () {
          region.nextSlide();
        }, duration * 1000 + region.fadeTime);
      }, region.fadeTime);
    }
  };
}
