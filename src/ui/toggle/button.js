import Phaser from "../../lib/phaser.js";

export class ToggleButton {
    /** @type {Phaser.GameObjects.Container} */
    #container;

    /** @type {Phaser.GameObjects.Image} */
    #background;
    /** @type {Phaser.GameObjects.Image} */
    #image;

    #isActive;

    /** @type {any} */
    #value;

    /** @type {boolean} */
    #select;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} assetKey 
     * @param {any} [value]
     */
    constructor(scene, x, y, assetKey, value) {
        this.#value = value;
        this.#select = false;
        this.#isActive = false;

        this.#container = scene.add.container(x, y);

        this.#background = scene.add.image(0, 0, assetKey, 0);
        this.#background.setOrigin(0.5);
        this.#container.add(this.#background);

        if (!this.#isActive) {
            this.#background.setAlpha(0.5);
        }
    }

    /** @type {Phaser.GameObjects.Image} */
    get background() {
        return this.#background;
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() {
        return this.#container;
    }

    get isActive() { return this.#isActive; }

    /** @type {boolean} */
    get isSelected() {
        return this.#select;
    }

    /** @type {any} */
    get value() {
        return this.#value;
    }

    /**
     * @param {string} assetKey
     * @param {number} assetFrame
     */
    addIcon(assetKey, assetFrame) {
        this.#image = this.#container.scene.add.image(0, 0, assetKey, assetFrame).setOrigin(0.5);
        this.#image.setScale(3);
        this.#container.add(this.#image);
        this.#isActive = true;
        this.#background.setAlpha(1);
    }

    add(container) {
        this.#container.add(container);
        this.#isActive = true;
        this.#background.setAlpha(1);
    }

    select() {
        this.#background.setFrame(1);
        this.#select = true;
    }

    unselect() {
        this.#background.setFrame(0);
        this.#select = false;
    }
}
