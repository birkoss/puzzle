import { BLOCK_ASSET_KEYS, MAP_ASSET_KEYS, PANEL_ASSET_KEYS, UI_ASSET_KEYS, UNIT_ASSET_KEYS } from "./keys/asset.js";
import { Button } from "./ui/button.js";
import { ToggleButton } from "./ui/toggle/button.js";
import { Toggle } from "./ui/toggle/toggle.js";

export class Skills {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #container;

    #toggle;

    /**
     * @param {Phaser.Scene} scene - The scene this panel belongs to
     * @param {number} x - The x coordinate of the tile on the grid
     * @param {number} y - The y coordinate of the tile on the grid
     */
    constructor(scene, x, y) {
        this.#scene = scene;
        this.#container = scene.add.container(x, y);

        this.#toggle = new Toggle((value) => {
            console.log("VALUE...");
        });

        let frame = this.#scene.add.image(0, 0, BLOCK_ASSET_KEYS.BLANK).setOrigin(0).setTint(0x000000);
        frame.displayWidth = this.#scene.game.scale.width;
        frame.displayHeight = 220;
        this.#container.add(frame);

        let button_y = 45;

        let toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleButton.container.x -= (toggleButton.container.getBounds().width/2) * 3 + 15;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleButton.container.x -= (toggleButton.container.getBounds().width/2) + 5;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleButton.container.x += (toggleButton.container.getBounds().width/2) + 5;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleButton.container.x += (toggleButton.container.getBounds().width/2) * 3 + 15;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        button_y += 70;

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleButton.container.x -= (toggleButton.container.getBounds().width/2) * 3 + 15;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleButton.container.x -= (toggleButton.container.getBounds().width/2) + 5;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleButton.container.x += (toggleButton.container.getBounds().width/2) + 5;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleButton.container.x += (toggleButton.container.getBounds().width/2) * 3 + 15;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        if (this.#toggle.buttons.length > 0) {
            this.#toggle.select(this.#toggle.buttons[0]);
        }

        let maxWidth = 4 * toggleButton.container.getBounds().width + 3 * 10;

        let button = new Button(this.#scene, this.#scene.game.scale.width/2 - 33, frame.displayHeight, "USE SKILL", () => {
            console.log("USE SKILL");
        });
        button.container.y -= button.container.getBounds().height/2 + 15;
        button.setWidth(maxWidth - 50 - 15);
        if (this.#toggle.buttons.length === 0) {
            button.desactivate();
        }
        this.#container.add(button.container);

        button = new Button(this.#scene, this.#scene.game.scale.width/2 + 110, frame.displayHeight, "?", () => {
            console.log("?");
        });
        button.container.y -= button.container.getBounds().height/2 + 15;
        button.setWidth(50);
        if (this.#toggle.buttons.length === 0) {
            button.desactivate();
        }
        this.#container.add(button.container);
    }

    get container() { return this.#container; }
}
