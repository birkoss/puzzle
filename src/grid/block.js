import Phaser from "../lib/phaser.js";

export class Block {
    /** @type {number} */
    #color;
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.GameObjects.Sprite} */
    #icon;
    /** @type {number} */
    #value;
    /** @type {Phaser.GameObjects.BitmapText} */
    #text;

    /**
     * @param {Phaser.GameObjects.Container} container
     * @param {Phaser.GameObjects.Sprite} icon
     */
    constructor(container, icon) {
        this.#color = -1;
        this.#value = 1;

        this.#container = container;
        this.#icon = icon;
    }

    get color() { return this.#color; }
    get container() { return this.#container; }
    get icon() { return this.#icon; }
    get value() { return this.#value; }

    highlight() {
        this.#icon.setScale(1.2);
    }
    
    unhighlight() {
        this.#icon.setScale(1);
    }

    /**
     * @param {number} newColor
     */
    updateColor(newColor) {
        this.#color = newColor;
        if (this.#icon) {
            this.#icon.setFrame(newColor);
        }
    }

    clear() {
        this.#container.remove(this.#text);
        this.#text.destroy();
    }

    /**
     * @param {Phaser.GameObjects.BitmapText} text
     */
    showValue(text) {
        this.#text = text;
        this.#container.add(this.#text);
    }
}
