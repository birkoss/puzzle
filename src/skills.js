import { BLOCK_ASSET_KEYS, UI_ASSET_KEYS } from "./keys/asset.js";
import { Skill } from "./skill.js";
import { Bubble } from "./ui/bubble.js";
import { Button } from "./ui/button.js";
import { ToggleButton } from "./ui/toggle/button.js";
import { Toggle } from "./ui/toggle/toggle.js";

export class Skills {
    static CONFIG = {
        PANEL_HEIGHT: 220,
        BUTTONS_PER_ROW: 4,
        BUTTON_SPACING: 70,
        BUTTON_GAP: 10,
        BUTTON_Y: 45,
        BUTTON_MULTIPLIER: 3,
        HELP_BUTTON_WIDTH: 50,

    };

    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #container;

    /** @type {Toggle} */
    #toggle;

    /** @type {Button} */
    #btnUse;
    /** @type {Button} */
    #btnHelp;

    /** @type {Skill[]} */
    #skills;

    /** @type {(skillId: string) => void} */
    #callback;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {(skillId: string) => void} [callback]
     */
    constructor(scene, x, y, callback) {
        this.#scene = scene;
        this.#container = scene.add.container(x, y);
        this.#callback = callback;
        this.#skills = [];

        this.#initializeToggle();
        this.#createBackground();
        this.#createToggleButtons();
        this.#createActionButtons();
    }

    get container() { return this.#container; }

    /**
     * @param {string} skillId 
     */
    addSkill(skillId) {
        const skill = new Skill(this.#scene, skillId);

        this.#skills.push(skill);

        let toggleButton = this.#toggle.getAllButtons().find((button) => !button.isActive);
        toggleButton.add(skill.container);

        this.#btnHelp.activate();

        if (this.#toggle.buttons.length === 1) {
            this.#toggle.select(this.#toggle.buttons[0]);
        }
    }

    endTurn() {
        this.#skills.forEach((skill) => {
            skill.tick();
        });

        this.#updateBtnUseLabel();
    }

    #createActionButtons() {
        const maxWidth = Skills.CONFIG.BUTTONS_PER_ROW * this.#toggle.getAllButtons()[0].container.getBounds().width + ((Skills.CONFIG.BUTTONS_PER_ROW - 1) * Skills.CONFIG.BUTTON_GAP);

        this.#btnUse = new Button(
            this.#scene,
            this.#scene.game.scale.width/2 - 33,
            Skills.CONFIG.PANEL_HEIGHT,
            "USE SKILL",
            () => {
                this.#skills[parseInt(this.#toggle.getSelectedValue())].use();
                this.#updateBtnUseLabel();
                if (this.#callback) {
                    this.#callback(this.#skills[parseInt(this.#toggle.getSelectedValue())].id);
                }
            }
        );

        this.#btnUse.container.y -= this.#btnUse.container.getBounds().height/2 + 15;
        this.#btnUse.setWidth(maxWidth - Skills.CONFIG.HELP_BUTTON_WIDTH - 15);
        this.#btnUse.desactivate();
        this.#container.add(this.#btnUse.container);

        this.#btnHelp = new Button(
            this.#scene,
            this.#scene.game.scale.width/2 + 110,
            Skills.CONFIG.PANEL_HEIGHT,
            "?",
            () => {
                let description = this.#skills[parseInt(this.#toggle.getSelectedValue())].description;
                if (this.#skills[parseInt(this.#toggle.getSelectedValue())].cooldown === -1) {
                    description += "\n\nThis is a passive skill.";
                } else {
                    description += "\n\nCooldown: " + this.#skills[parseInt(this.#toggle.getSelectedValue())].maxCooldown + " turns";  
                }

                let bubble = new Bubble({
                    scene: this.#scene,
                    message: description,
                    x: this.#scene.game.scale.width/2,
                    y: Skills.CONFIG.PANEL_HEIGHT/2 - 28,
                    minSize: { width: 230, height: 80 },
                    scale: 3,
                    tailPosition: 6,
                    showBackground: true,
                });
                this.#container.add(bubble.container);
                bubble.show();
            }
        );

        this.#btnHelp.container.y -= this.#btnHelp.container.getBounds().height/2 + 15;
        this.#btnHelp.setWidth(Skills.CONFIG.HELP_BUTTON_WIDTH);
        this.#btnHelp.desactivate();
        this.#container.add(this.#btnHelp.container);
    }

    #createBackground() {
        const frame = this.#scene.add.image(0, 0, BLOCK_ASSET_KEYS.BLANK).setOrigin(0).setTint(0x000000);
        frame.displayWidth = this.#scene.game.scale.width;
        frame.displayHeight = Skills.CONFIG.PANEL_HEIGHT;
        this.#container.add(frame);
    }

    #createToggleButtons() {
        const totalButtons = 8;
        const buttonPerRow = Skills.CONFIG.BUTTONS_PER_ROW;
       
        for (let i=0; i<totalButtons; i++) {
            const row = Math.floor(i / buttonPerRow);
            const button = this.#createToggleButton(i, row);
        }

        if (this.#toggle.buttons.length > 0) {
            this.#toggle.select(this.#toggle.buttons[0]);
        }
    }

    #createToggleButton(index, row = 0) {
        const centerX = this.#scene.game.scale.width/2;
        const y = Skills.CONFIG.BUTTON_Y + (row * Skills.CONFIG.BUTTON_SPACING);
        
        const button = new ToggleButton(this.#scene, centerX, y, UI_ASSET_KEYS.TOGGLE, index.toString());
        const buttonWidth = button.container.getBounds().width;

        const colIndex = index % Skills.CONFIG.BUTTONS_PER_ROW;
        const xOffset = (colIndex - (Skills.CONFIG.BUTTONS_PER_ROW - 1) / 2) * (buttonWidth + Skills.CONFIG.BUTTON_GAP);
        button.container.x += xOffset;

        this.#container.add(button.container);
        this.#toggle.add(button);

        return button;
    }

    #initializeToggle() {
        this.#toggle = new Toggle((value) => {
            this.#updateBtnUseLabel();
        });
    }

    #updateBtnUseLabel() {
        let cooldown = this.#skills[parseInt(this.#toggle.getSelectedValue())].cooldown;

        if (cooldown === -1) {
            this.#btnUse.desactivate();
            this.#btnUse.setText("No activation needed");
        } else if (cooldown === 0) {
            this.#btnUse.activate();
            this.#btnUse.setText("USE SKILL");
        } else {
            this.#btnUse.setText("aWait " + cooldown + " turns");
            this.#btnUse.desactivate();
        }
    }
}
