'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        events: new Map(),

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {this}
         */
        on: function (event, context, handler) {
            if (!this.events.has(event)) {
                this.events.set(event, []);
            }

            this.events.get(event)
                .push({ context, handler, repeat: Infinity, frequency: 1, step: 0 });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {this}
         */
        off: function (event, context) {
            [...this.events.keys()]
                .filter(eventName => eventName === event || eventName.startsWith(`${event}.`))
                .forEach(eventName => {
                    this.events.get(eventName).forEach((eventObject, index) => {
                        if (eventObject.context === context) {
                            this.events.get(eventName).splice(index, 1);
                        }
                    });
                });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {this}
         */
        emit: function (event) {
            [...this.events.keys()]
                .filter(eventName => eventName === event || event.startsWith(`${eventName}.`))
                .sort((eventName1, eventName2) => eventName1.localeCompare(eventName2))
                .reverse()
                .forEach(eventName => {
                    this.events.get(eventName).forEach(eventObject => {
                        if (eventObject.repeat > eventObject.step &&
                            eventObject.step % eventObject.frequency === 0) {
                            eventObject.handler.call(eventObject.context);
                        }
                        eventObject.step++;
                    });
                });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {this}
         */
        several: function (event, context, handler, times) {
            if (!this.events.has(event)) {
                this.events.set(event, []);
            }

            const repeat = times <= 0 ? Infinity : times;

            this.events.get(event)
                .push({ context, handler, repeat, frequency: 1, step: 0 });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {this}
         */
        through: function (event, context, handler, frequency) {
            if (!this.events.has(event)) {
                this.events.set(event, []);
            }

            const freq = frequency <= 0 ? 1 : frequency;

            this.events.get(event)
                .push({ context, handler, repeat: Infinity, frequency: freq, step: 0 });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
