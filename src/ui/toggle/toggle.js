import Phaser from "../../lib/phaser.js";

import { ToggleButton } from "./button.js";

export class Toggle {
    /** @type {ToggleButton[]} */
    #buttons;

    /** @type {(value: any) => void} */
    #callback;

    /**
     * @param {(value: any) => void} callback
     */
    constructor(callback) {
        this.#callback = callback;

        this.#buttons = [];
    }
    
    /** @type {ToggleButton[]} */
    get buttons() {
        return this.#buttons.filter(singleButton => singleButton.isActive);
    }

    /** @type {any} */
    get value() {
        return this.#buttons.find(singleButton => singleButton.isSelected).value;
    }

    getAllButtons() {
        return this.#buttons;
    }

    getSelectedValue() {
        return this.#buttons.find(singleButton => singleButton.isSelected).value;
    }

    /**
     * @param {ToggleButton} button
     */
    add(button) {
        this.#buttons.push(button);

        button.background.setInteractive();
        button.background.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.select(button);
        });
    }

    /**
     * @param {ToggleButton} button
     */
    select(button) {
        if (button.isActive) {
            this.#buttons.forEach(singleButton => {
                singleButton.unselect();
            });
            button.select();
            if (this.#callback) {
                this.#callback(button.value);
            }
        }
    }
}
