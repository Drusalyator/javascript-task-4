'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

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

            this.events.get(event).push({ context, handler });

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
                        eventObject.handler.call(eventObject.context);
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
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
