/**
 * LiveData.js is an observable data holder class inspired from Google Android Jetpack library.
 */
class LiveData {
    static version = '1.0.0'
    // _valueIsInitialized<boolean>
    // _value<any> = undefined
    // _nullSafe = boolean | null | undefined
    // _arrOfFn<array<void>> = []
    // _arrOfDebouncedFn<array<void>> = []
    // _arrOfThrottledFn<array<void>> = []

    /**
     * 
     * @param {any?} value
     * @param {boolean} nullSafe whether notify for value change when value is undefined | null
     */
    constructor(value, nullSafe = false) {
        this._valueIsInitialized = (value !== undefined)
        this._value = value
        this._nullSafe = nullSafe
        this._arrOfFn = []
        this._arrOfDebouncedFn = []
        this._arrOfThrottledFn = []
    }

    /**
     * Create instance via static method
     * @deprecated use class instantiation method
     * @param {any} value
     * @returns LiveData
     */
    static make(value, nullSafe = false) {
        return new this(value, nullSafe)
    }

    /**
     * Returns whether an explicit value has been set on this LiveData. If this returns true, then the current value can be retrieved from getValue.
     * @returns boolean
     */
    isInitialized() { return this._valueIsInitialized }

    /**
     * Broadcast the value to all active observers
     */
    async notify() {
        if (this._value || !this._nullSafe) {
            this._arrOfFn.forEach(f => {
                f(this._value)
            })
        }
    }

    async notifyDebounce() {
        if (this._value || !this._nullSafe) {
            this._arrOfDebouncedFn.forEach(f => {
                f(this._value)
            })
        }
    }

    async notifyThrottle() {
        if (this._value || !this._nullSafe) {
            this._arrOfThrottledFn.forEach(f => {
                f(this._value)
            })
        }
    }

    /**
     * Posts an asynchronous task to a main thread to set the given value.
     * @param {any} v
     * @return Promise
     */
    async postValue(v) {
        this._value = v
        this.notify()
        this.notifyDebounce()
        this.notifyThrottle()
        this._valueIsInitialized = true
    }

    /**
     * Mutates the current value by applying the provided function and posting the result as the new value.
     *
     * @param {Function} fn - The function used to mutate the current value.
     * @return {Object} - The instance of the LiveData object for method chaining.
     */
    mutateValue(fn) {
        this.postValue(fn(this._value))
        return this
    }

    /**
     * Returns the current value.
     */
    getValue() {
        return this._value
    }

    /**
     * Sets the value of the LiveData object to the provided value without notify the active observer.
     *
     * @param {any} v - The value to set for the LiveData object.
     */
    set value(v) {
        this.postValue(v)
    }

    /**
     * Returns the current value.
     *
     * @return {any} The current value.
     */
    get value() {
        return this._value
    }

    /**
     * Adds the given observer to the observers list within the lifespan of the given owner. The events are dispatched on the main thread.
     * If LiveData already has data set, it will be delivered to the observer.
     * @param {void} fn 
     */
    observe(fn) {
        this._arrOfFn.push(async (v) => { fn(v) })
        if (this._valueIsInitialized) {
            async (v) => { fn(v) }
        }
    }

    /**
     * Adds a debounced observer function to the array of debounced functions.
     * The observer function will be called with the current value after a specified delay
     * since the last time it was called.
     *
     * @param {function} fn - The observer function to be called.
     * @param {number} [delay=500] - The delay in milliseconds before the observer function is called.
     */
    observeDebounce(fn, delay = 500) {
        this._arrOfDebouncedFn.push(this._debounce(async (v) => { fn(v) }, delay))
        if (this._valueIsInitialized) {
            this._debounce(async (v) => { fn(v) }, delay)
        }
    }

    /**
     * Observes changes in the data object with a throttled mechanism.
     *
     * @param {Function} fn - The function to be throttled.
     * @param {number} delay - The time delay for throttling in milliseconds. Default is 500.
     */
    observeThrottle(fn, delay = 500) {
        this._arrOfThrottledFn.push(this._throttle(async (v) => { fn(v) }, delay))
        if (this._valueIsInitialized) {
            this._throttle(async (v) => { fn(v) }, delay)
        }
    }

    /**
     * A debounce function that delays invoking the provided function until after `delay` milliseconds have elapsed since the last time it was invoked.
     *
     * @param {Function} func - The function to be debounced.
     * @param {number} [delay=500] - The delay in milliseconds before invoking the debounced function.
     * @return {Function} - A debounced function.
     */
    _debounce(func, delay = 500) {
        let timerId;
        return async function () {
            const context = this;
            const args = arguments;
            clearTimeout(timerId);
            timerId = setTimeout(function () {
                func.apply(context, args);
            }, delay);
        };
    }

    /**
     * Throttles the execution of a function to a maximum of one execution per given delay.
     *
     * @param {Function} func - The function to be throttled.
     * @param {number} [delay=500] - The delay in milliseconds between function executions. Default is 500.
     * @return {Function} - The throttled function.
     */
    _throttle(func, delay = 500) {
        let shouldWait = false;
        return async function () {
            if (shouldWait) return;
            const context = this
            const args = arguments
            func.apply(context, args);
            shouldWait = true;
            setTimeout(() => {
                shouldWait = false;
            }, delay);
        };
    }
}

/**
 * @deprecated removed in the future, use LiveValidator instead.
 */
class ValidatorMap extends Map {

    constructor() {
        super()
    }

    set(key, value) {
        if (value) {
            super.set(key, true)
        } else {
            super.set(key, false)
        }
        return this
    }

    isValid() {
        if (this.size === 0) {
            return false
        }
        return !Array.from(this.values()).includes(false)
    }
}

/**
 *  LiveValidator is an observable data validation holder class inspired from LiveData
 */
class LiveValidator extends Map {
    // _arrOfFn array<void>
    // _map Map

    /**
     * Initializes a new instance of the LiveValidator class.
     *
     * @param {Array} keys - An optional array of keys to initialize the map with.
     */
    constructor(keys) {
        super()
        this._arrOfFn = []
        if (keys && Array.isArray(keys)) {
            keys.forEach(key => this.set(key, false))
        }
    }

    /**
     * Asynchronously notifies all observers with the current validity and the map.
     *
     * @return {Promise<void>} A promise that resolves when all notifications are complete.
     */
    async notify() {
        this._arrOfFn.forEach(fn => {
            fn(this.isValid(), this)
        })
    }

    /**
     * Returns an iterator allowing to go through all keys of the map.
     *
     * @return {Iterator} An iterator object.
     */
    keys() {
        return super.keys()
    }

    /**
     * Sets the validity for the given key in the map, then notifies all observers.
     *
     * @param {string} key - The key to set validity for in the map.
     * @param {boolean} validity - The validity status to set for the key.
     * @return {LiveValidator} The current LiveValidator instance.
     */
    set(key, validity) {
        super.set(key, !(!validity))
        this.notify()
        return this
    }

    /**
     * Returns the data validity associated with the specified key from the map.
     *
     * @param {string} key - The key whose associated validity is to be returned.
     * @return {boolean} The validity associated with the specified key, or undefined if the key is not found.
     */
    get(key) {
        return super.get(key)
    }

    /**
     * Adds a function to the array of observers. The function will be called with the validity and map whenever the validity or map changes.
     *
     * @param {function} fn - The function to be called when the validity or map changes. It will be called with the validity and map as arguments.
     * @return {void} This function does not return anything.
     */
    observe(fn) {
        this._arrOfFn.push(async (validity, map) => { fn(validity, map) })
    }

    /**
     * Checks the validity of the map by ensuring it is not empty and does not contain any false values.
     *
     * @return {boolean} The validity status of the map.
     */
    isValid() {
        if (this.size === 0) {
            return false
        }
        return !Array.from(this.values()).includes(false)
    }
}