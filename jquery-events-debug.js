;(function ($) {
	$.fn.getEventsHandlers = function (target) {
		var result = {};
			target = target || this;
		
		function extendEvent (event, originalEl) {
			if (event.extend === void(0)) {
				var handler = event.handler;
				event.extend = true;
				
				if (originalEl) {
					event.originalEl = originalEl;
				}
				
				event.enableDebug = function () {
					event.handler = function () {
						debugger;
						handler.apply(this, Array.prototype.slice.call(arguments, 0));
					};
				};
				
				event.repair = function () {
					event.handler = handler;
				};
			}
		}
		
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
						extendEvent(handler, !target.is(node) ? node : null);
						targetStack.push(handler);
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