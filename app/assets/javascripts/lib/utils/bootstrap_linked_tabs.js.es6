
/**
 * Linked Tabs
 *
 * Handles persisting and restores the current tab selection and content.
 * Reusable component for static content.
 *
 * ### Example Markup
 *
 *  <ul class="nav-links tab-links">
 *    <li class="active">
 *      <a data-action="tab1" data-target="#tab1" data-toggle="tab" href="/path/tab1">
 *        Tab 1
 *      </a>
 *    </li>
 *    <li class="groups-tab">
 *      <a data-action="tab2" data-target="#tab2" data-toggle="tab" href="/path/tab2">
 *        Tab 2
 *      </a>
 *    </li>
 *
 *
 *  <div class="tab-content">
 *    <div class="tab-pane" id="tab1">
 *      Tab 1 Content
 *    </div>
 *    <div class="tab-pane" id="tab2">
 *      Tab 2 Content
 *    </div>
 * </div>
 *
 *
 * ### How to use
 *
 *  new window.gl.LinkedTabs({
 *    action: "#{controller.action_name}",
 *    defaultAction: 'tab1',
 *    parentEl: '.tab-links'
 *  });
 */

(() => {
  window.gl = window.gl || {};

  window.gl.LinkedTabs = class LinkedTabs {
    /**
     * Binds the events and activates de default tab.
     *
     * @param  {Object} options
     */
    constructor(options) {
      this.options = options || {};

      this.defaultAction = this.options.defaultAction;
      this.action = this.options.action || this.defaultAction;

      this.currentLocation = window.location;

      if (this.action === 'show') {
        this.action = this.defaultAction;
      }

      // since this is a custom event we need jQuery :(
      $(document).on('shown.bs.tab', `${this.options.parentEl} a[data-toggle="tab"]`, evt => this.tabShown(evt));

      this.activateTab(this.action);
    }

    /**
     * Handles the `shown.bs.tab` event to set the currect url action.
     *
     * @param  {type} evt
     * @return {Function}
     */
    tabShown(evt) {
      const source = evt.target.getAttribute('href');

      return this.setCurrentAction(source);
    }

    /**
     * Updates the URL with the path that matched the given action.
     *
     * @param  {String} source
     * @return {String}
     */
    setCurrentAction(source) {
      const copySource = source;

      copySource.replace(/\/+$/, '');

      const newState = copySource + this.currentLocation.search + this.currentLocation.hash;

      history.replaceState({
        turbolinks: true,
        url: newState,
      }, document.title, newState);
      return newState;
    }

    /**
     * Given the current action activates the correct tab.
     * http://getbootstrap.com/javascript/#tab-show
     * Note: Will trigger `shown.bs.tab`
     */
    activateTab() {
      return $(`.pipelines-tabs a[data-action='${this.action}']`).tab('show');
    }
  };
})();
