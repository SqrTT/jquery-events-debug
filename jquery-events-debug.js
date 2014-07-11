;(function ($) {
	$.fn.getEventsHandlers = function (target) {
		var result = {};
			target = target || this;
		function getHandlers (node) {
			var handlers,
				result = {};

			if ($.fn.jquery.substr(0, 3) > '1.8') {
				handlers = $._data(node, 'events');
			} else {
				handlers = $(node).data('events');
			}

			for (var eventName in handlers) {
				var stack = handlers[eventName],
					targetStack = [];

				for (var i = 0; i < stack.length; ++i) {
					var handler = stack[i];

					if (target.is(node) || (handler.selector && $(node).find(handler.selector).is(target))) {
						if (!target.is(node)) {
							handler.originalEl = node;
						}
						targetStack.push($.extend({}, handler));
					}
				}

				if (targetStack.length) {
					result[eventName] = targetStack;
				}
			}

			return result;
		}

		this.each(function () {
			$.extend(result, getHandlers(this));

			if (this.parentNode) {
				var parentHandlers = $(this.parentNode).getEventsHandlers($(target));

				for (var eventName in parentHandlers) {
					var stack = parentHandlers[eventName];

					if (result[eventName]) {
						result[eventName] = result[eventName].concat(stack);
					} else {
						result[eventName] = stack;
					}
				}
			}
		});

		return result;
	};
}(jQuery));