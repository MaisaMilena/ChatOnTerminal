import ComponentsBuilder from "./components.js"
import { constants } from "./constants.js"

export default class TerminalController{
    #userColors = new Map()

    constructor() {}

    #pickColor() {
        return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
    }

    #getUserColor(userName){
        if(this.#userColors.has(userName)){
            return this.#userColors.get(userName)
        } else {
            const color = this.#pickColor()
            this.#userColors.set(userName, color)
            return color
        }  
    }


    #onInputReceived(eventEmitter){
        return function () {
            const message = this.getValue()
            eventEmitter.emit(constants.events.app.MESSAGE_SENT, message)
            this.clearValue()
        }
    }

    #onMessageReceived({screen, chat}) {
        return msg => {
            const { userName, message } = msg
            const nameColor = this.#getUserColor(userName)
            
            chat.addItem(`{${nameColor}}{bold}${userName}{/}: ${message}`)
            screen.render()
        }
    }

    #onLogChanged({screen, activityLog}) {
        
        return msg => {
            const [userName] = msg.split(/\s/)
            const color = this.#getUserColor(userName)
            activityLog.addItem(`{${color}}{bold}${msg.toString()}{/}`)
            screen.render()
        }
    }

    #onStatusChanged({screen, status}){

        return users => {
            const {content} = status.items.shift();
            status.clearItems();
            status.addItem(content);

            users.forEach(userName => {
                const color = this.#getUserColor(userName)
                status.addItem(`{${color}}{bold}${userName}{/}`) 
            })

            screen.render();
        }
    }
    
    #registerEvents(eventEmitter, components){
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
    }

    async initializeTable(eventEmitter) {
        const components = new ComponentsBuilder()
            .setScreen({ title: 'HackerChat - Maisa'})
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setActivityLog()
            .setStatusComponent()
            .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus();
        components.screen.render();

        // setInterval(() => {
            // const users = ['maisa']
            // eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
            // users.push('victor')
            // eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
            // users.push('belanna', 'neelix')
            // eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        // }, 1000)
    }
}