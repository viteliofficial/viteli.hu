(function(window) {
    const requestAnimationFrame = window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || 
        (fn => window.setTimeout(fn, 1000 / 60));

    const ticks = [];
    const html = document.documentElement;
    const body = document.body;

    const defaults = {
        duration: 500,
        preventUserScroll: true,
        scrollEvents: ['scroll', 'mousedown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'touchmove'],
        scrollKeys: [37, 38, 39, 40, 32],
        allowAnimationOverlap: false,
        easing: 'linear'
    };

    const easingFunctions = {
        linear: e => e,
        swing: e => 0.5 - Math.cos(e * Math.PI) / 2
    };

    const baseEasing = {
        Sine: p => 1 - Math.cos(p * Math.PI / 2),
        Circ: p => 1 - Math.sqrt(1 - p * p),
        Elastic: p => p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15),
        Back: p => p * p * (3 * p - 2),
        Bounce: p => {
            let pow2, bounce = 4;
            while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
            return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
        }
    };

    const prefixes = ["Quad", "Cubic", "Quart", "Quint", "Expo"];
    prefixes.forEach((prefix, i) => {
        baseEasing[prefix] = p => Math.pow(p, i + 2);
    });

    for (const [key, easeIn] of Object.entries(baseEasing)) {
        easingFunctions[`easeIn${key}`] = easeIn;
        easingFunctions[`easeOut${key}`] = p => 1 - easeIn(1 - p);
        easingFunctions[`easeInOut${key}`] = p => p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
    }

    const css = (elem, property) => {
        const style = window.getComputedStyle ? window.getComputedStyle(elem) : elem.currentStyle;
        return style[property] || '';
    };

    const getCoordinates = (elem) => {
        const box = elem.getBoundingClientRect();
        const scrollTop = window.pageYOffset || html.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || html.scrollLeft || body.scrollLeft;
        const clientTop = html.clientTop || body.clientTop || 0;
        const clientLeft = html.clientLeft || body.clientLeft || 0;
        return { top: box.top + scrollTop - clientTop, left: box.left + scrollLeft - clientLeft };
    };

    const getPos = (v, current, t) => {
        if (typeof v === "number") return v;
        const match = v.match(/^(\w+)([+-]\d+%?)?$/);
        if (!match) throw new Error("Invalid position value");

        const [ , base, offset] = match;
        let val;
        switch (base) {
            case "start": val = 0; break;
            case "end": val = t + 10; break;
            case "center": val = t / 2; break;
            default:
                val = (offset ? parseFloat(offset) : 0) + (offset.includes('%') ? (t * parseFloat(offset) / 100) : (parseFloat(offset) || 0));
        }
        return val;
    };

    const getContainerScrollPos = (elem) => elem ? { x: elem.scrollLeft, y: elem.scrollTop } : {
        x: window.pageXOffset || (document.documentElement || body.parentNode || body).scrollLeft,
        y: window.pageYOffset || (document.documentElement || body.parentNode || body).scrollTop
    };

    const getScrollPos = (p, c, e) => p > c ? c - ((c - p) * e) : ((p - c) * e) + c;

    const addEventHandler = (elem, event, fn) => {
        elem.addEventListener ? elem.addEventListener(event, fn, false) : elem.attachEvent("on" + event, fn);
    };

    const removeEventHandler = (elem, event, fn) => {
        elem.removeEventListener ? elem.removeEventListener(event, fn, false) : elem.detachEvent("on" + event, fn);
    };

    const tick = (func, complete, cancel, elem) => {
        if (cancel) {
            stop(t => t.scrollingElem === elem);
        }
        let shouldStop = false;
        const t = () => {
            if (!shouldStop) {
                func();
                requestAnimationFrame(t);
            }
        };
        const destroy = (x) => {
            if (shouldStop) return;
            shouldStop = true;
            const index = ticks.findIndex(tick => tick.destroy === destroy);
            if (index > -1) ticks.splice(index, 1);
            if (x) complete(false, true);
        };
        const res = { destroy, scrollingElem: elem };
        ticks.push(res);
        requestAnimationFrame(t);
        return { destroy };
    };

    const stop = (filter) => {
        const len = ticks.length;
        for (let i = len - 1; i >= 0; i--) {
            if (filter ? filter(ticks[i]) : true) {
                ticks[i].destroy(true);
            }
        }
        return !!len;
    };

    window.smoothScroll = function(options = {}) {
        const {
            duration = defaults.duration,
            preventUserScroll = defaults.preventUserScroll,
            scrollEvents = defaults.scrollEvents,
            scrollKeys = defaults.scrollKeys,
            allowAnimationOverlap = defaults.allowAnimationOverlap,
            easing = defaults.easing,
            complete = defaults.complete,
            scrollingElement = defaults.scrollingElement,
            toElement,
            firstAxis = defaults.firstAxis,
            block = defaults.block,
            inline = defaults.inline,
            paddingTop = defaults.paddingTop,
            paddingLeft = defaults.paddingLeft
        } = options;

        const currentPos = getContainerScrollPos();
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        let xPos = options.xPos != null ? getPos(options.xPos, currentPos.x, window.innerWidth) : currentPos.x;
        let yPos = options.yPos != null ? getPos(options.yPos, currentPos.y, window.innerHeight) : currentPos.y;
        const containerHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const containerWidth = Math.max(html.clientWidth, body.scrollWidth, html.scrollWidth, body.offsetWidth, html.offsetWidth);
        const maxScrollTop = containerHeight - window.innerHeight;
        const maxScrollLeft = containerWidth - window.innerWidth;

        if (scrollingElement) {
            if (scrollingElement instanceof Element) {
                if (scrollingElement !== body && scrollingElement !== html) {
                    const scrollingElemHeight = scrollingElement.clientHeight;
                    const scrollingElemWidth = scrollingElement.clientWidth;
                    xPos = scrollingElement.scrollLeft + (xPos - getCoordinates(scrollingElement).left) - parseInt(css(scrollingElement, 'border-left-width'), 10);
                    yPos = scrollingElement.scrollTop + (yPos - getCoordinates(scrollingElement).top) - parseInt(css(scrollingElement, 'border-top-width'), 10);
                    scroll = (x, y) => {
                        scrollingElement.scrollTop = y;
                        scrollingElement.scrollLeft = x;
                    };
                } else {
                    scroll = window.scrollTo;
                }
            } else {
                throw new Error("Scrolling element must be a HTML element");
            }
        } else {
            scroll = window.scrollTo;
        }

        if (toElement) {
            if (!(toElement instanceof Element)) {
                throw new Error("Element to scroll to must be a HTML element");
            }
            const { top, left } = getCoordinates(toElement);
            if (scrollingElement) {
                const { top: sTop, left: sLeft } = getCoordinates(scrollingElement);
                yPos = scrollingElement.scrollTop + (top - sTop);
                xPos = scrollingElement.scrollLeft + (left - sLeft);
            } else {
                yPos = top;
                xPos = left;
            }
        }

        if (block) {
            if (block === 'start') {
                yPos = yPos - (paddingTop || 0);
            } else if (block === 'end') {
                yPos = yPos - (vh - (paddingTop || 0));
            } else if (block === 'center') {
                yPos = yPos - (vh / 2 - (paddingTop || 0));
            }
        }

        if (inline) {
            if (inline === 'start') {
                xPos = xPos - (paddingLeft || 0);
            } else if (inline === 'end') {
                xPos = xPos - (vw - (paddingLeft || 0));
            } else if (inline === 'center') {
                xPos = xPos - (vw / 2 - (paddingLeft || 0));
            }
        }

        const easingFunction = easingFunctions[easing] || easingFunctions[defaults.easing];
        const scrollAnimation = tick(() => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const easingValue = easingFunction(progress);

            if (scrollingElement) {
                scroll(
                    getScrollPos(xPos, containerWidth, easingValue),
                    getScrollPos(yPos, containerHeight, easingValue)
                );
            } else {
                scroll(
                    getScrollPos(xPos, maxScrollLeft, easingValue),
                    getScrollPos(yPos, maxScrollTop, easingValue)
                );
            }

            if (elapsed >= duration) {
                scrollAnimation.destroy();
                if (typeof complete === "function") complete();
            }
        });

        let start = Date.now();
        if (preventUserScroll) {
            scrollEvents.forEach(evt => addEventHandler(window, evt, stop.bind(null, tickObj => tickObj.destroy === scrollAnimation.destroy)));
            scrollKeys.forEach(keyCode => addEventHandler(window, 'keydown', e => {
                if (scrollKeys.includes(e.keyCode)) stop();
            }));
        }

        return scrollAnimation;
    };

})(window);
