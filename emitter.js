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

    /**
     * Добавляет новый eventObject
     * @param {String} event - Событие
     * @param {Object} eventObject - Объект события
     * @param {Map} eventsMap - Хранилище событиый
     */
    function addEventObject(event, eventObject, eventsMap) {
        if (!eventsMap.has(event)) {
            eventsMap.set(event, []);
        }

        eventsMap.get(event).push(eventObject);
    }

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
            const eventObject = {
                context,
                handler,
                repeat: Infinity,
                frequency: 1,
                step: 0 };

            addEventObject(event, eventObject, this.events);

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
            const eventObject = {
                context,
                handler,
                repeat: times <= 0 ? Infinity : times,
                frequency: 1,
                step: 0 };

            addEventObject(event, eventObject, this.events);

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
            const eventObject = {
                context,
                handler,
                repeat: Infinity,
                frequency: frequency <= 0 ? 1 : frequency,
                step: 0 };

            addEventObject(event, eventObject, this.events);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
