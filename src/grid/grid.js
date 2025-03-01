import { BLOCK_ASSET_KEYS, FONT_ASSET_KEYS, MAP_ASSET_KEYS } from "../keys/asset.js";
import { Block } from "./block.js";
import { Tile } from "./tile.js";

const TILE_SIZE = 36;

/**
 * @typedef {Object} Streak
 * @property {number} bonus
 * @property {Tile[]} tiles
 */

export class Grid {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {number} */
    #width;
    /** @type {number} */
    #height;

    /** @type {Phaser.GameObjects.Container} */
    #container;

    /** @type {Tile[]} */
    #tiles;
    /** @type {Tile} */
    #selectedTile;
    /** @type {Block[]} */
    #blocksPooled;

    /** @type {(tile:Tile) => void} */
    #callbackTileSelected;
    /** @type {() => void} */
    #callbackEndOfTurn;
    /** @type {(Object) => void} */
    #callbackStreaks;


    /**
     * @param {Phaser.Scene} scene
     * @param {number} width
     * @param {number} height
     */
    constructor(scene, width, height) {
        this.#scene = scene;
        this.#width = width;
        this.#height = height;

        this.#container = this.#scene.add.container(0, 0);

        this.#tiles = [];
        this.#blocksPooled = [];
        this.#selectedTile = null;
    }

    create() {
        const x = (this.#scene.scale.width - (this.#width * TILE_SIZE)) / 2;
        const y = (this.#scene.scale.height - 220 - 100 - (this.#height * TILE_SIZE)) / 2 + 100;

        // Create the walls and inside of the grid
        for (let y2 = 0; y2 < this.#height+2; y2++) {
            for(let x2 = 0; x2 < this.#width+2; x2++) {
                let frame = Phaser.Math.Between(1, 100) <= 50 ? 85 : 131;
                if ((y2 === 0 && x2 > 0 && x2 < this.#width+1) || y2 === this.#height+1) {
                    frame = Phaser.Math.Between(1, 100) <= 50 ? 62 : 108;
                } else if (x2 > 0 && x2 < this.#width+1 && y2 > 0 && y2 < this.#height+1) {
                    frame = ((y2 * this.#height) + x2) % 2 === 0 ? 94 : 99;
                }

                let background = this.#scene.add.sprite(TILE_SIZE * x2 + TILE_SIZE/2 + x, TILE_SIZE * y2 + TILE_SIZE/2 + y, MAP_ASSET_KEYS.WORLD, frame).setScale(3);
                background.x -= TILE_SIZE;
                background.y -= TILE_SIZE;
            }
        }

        this.#container = this.#scene.add.container(x, y);

        for (let y = 0; y < this.#height; y++) {
            for(let x = 0; x < this.#width; x++) {
                let container = this.#scene.add.container(TILE_SIZE * x + TILE_SIZE/2, TILE_SIZE * y + TILE_SIZE/2);

                let icon = this.#scene.add.sprite(0, 0, BLOCK_ASSET_KEYS.ICON);
                container.add(icon);
                this.#container.add(container);

                let tile = new Tile(x, y, new Block(container, icon));
                this.#tiles.push(tile);
            }
        }

        // Create a mask for the container (Hide reused tiles)
        // TODO: Fix bottom mask, last tiles trimmed
        const mask = this.#scene.add.graphics()
            .fillStyle(0x000000, 0)
            .fillRect(this.#container.x, this.#container.y, this.#container.getBounds().width, this.#container.getBounds().height);
        this.#container.mask = new Phaser.Display.Masks.GeometryMask(this.#scene, mask);

        // Enable click
        this.#scene.input.on("pointerdown", this.#selectTile, this);
        this.#scene.input.on("pointerup", this.#unselectTile, this);
    }

    reset() {
        for (let y = 0; y < this.#height; y++) {
            for(let x = 0; x < this.#width; x++) {
                let tile = this.#getTileAt(x, y);
                if (tile === null) {
                    continue;
                }

                let maxTries = 10;
                do {
                    console.log("RETRY...");
                    maxTries--;
                    tile.block.updateColor(this.#generateRandomColor(2));
                } while(this.#isMatchAt(x, y) && maxTries > 0);
            }
        }
    }

    setCallbacks(callbackTileSelected, callbackStreaks, callbackEndOfTurn) {
        this.#callbackTileSelected = callbackTileSelected;
        this.#callbackStreaks = callbackStreaks;
        this.#callbackEndOfTurn = callbackEndOfTurn;
    }

    /**
     * Add new tiles to the top of the grid from the block pool
     */
    #addNewTiles() {
        for(let x = 0; x < this.#width; x++) {
            let holes = this.#getHolesBelow(x);
            if (holes > 0) {
                for (let i = 0; i < holes; i ++) {
                    let tile = this.#getTileAt(x, i);
                    if (tile === null) {
                        continue;
                    }

                    tile.block = this.#blocksPooled.pop();

                    tile.block.updateColor(this.#generateRandomColor());
                    tile.block.icon.setAlpha(1);

                    tile.block.container.visible = true;
                    tile.block.container.x = TILE_SIZE * x + TILE_SIZE / 2;
                    tile.block.container.y = TILE_SIZE / 2 - (holes - i) * TILE_SIZE;
                    tile.block.container.alpha = 1;
                    tile.block.unhighlight();
                    tile.updateState({isEmpty: false});
                }
            }
        }
    }

    /**
     * Animate the tiles of a specific streak until all streaks have been animated
     * @param {Streak[]} streaks
     * @param {number} currentStreak
     * @param {number} [currentTile]
     */
    #animateStreakTiles(streaks, currentStreak, currentTile = 0) {
        if (currentTile >= streaks[currentStreak].tiles.length) {
            this.#scene.time.addEvent({
                delay: 200,
                callback: () => {
                    // Get total scores for the current streak
                    
                    const points = {
                        hp: 0,
                        exp: 0,
                        gold: 0,
                        monster: 0,
                    }
                    streaks[currentStreak].tiles.forEach(singleTile => {
                        const value = singleTile.block.value * streaks[currentStreak].bonus;
                        switch (singleTile.block.color) {
                            case 0:
                                points.hp += value;
                                break;
                            case 1:
                                points.gold += value;
                                break;
                            case 2:
                                points.exp += value;
                                break;
                            case 3:
                                points.monster += value;
                                break;
                        }
                    });

                    if (this.#callbackStreaks) {
                        this.#callbackStreaks(points);
                    }

                    this.#destroyStreaks(streaks, currentStreak + 1);
                }
            });
            return;
        }

        let tile = streaks[currentStreak].tiles[currentTile];
        if (tile === null) {
            return;
        }

        let label = (tile.block.color === 4 ? "-" : "+") + (tile.block.value * streaks[currentStreak].bonus);
        let color = 0xffffff;
        if (tile.block.color === 4) {
            color = 0xd40200;
        }

        let text = this.#scene.add.bitmapText(0, 0, FONT_ASSET_KEYS.POINT, label, 20).setTint(color).setOrigin(0.5);
        tile.block.showValue(text);
        
        text.setAlpha(0);
        this.#scene.tweens.add({
            targets: text,
            y: text.y - 10,
            duration: 200,
            scale: 1.2,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
        });

        this.#scene.tweens.add({
            targets: tile.block.icon,
            alpha: 0.5,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
        });

        this.#scene.tweens.add({
            targets: text,
            alpha: 1,
            y: text.y - 10,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.InOut,
            onComplete: () => {
                this.#scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        this.#scene.tweens.add({
                            targets: text,
                            alpha: 0,
                            duration: 200,
                            ease: Phaser.Math.Easing.Sine.InOut,
                        });
                    }
                });
            }
        });

        this.#scene.time.addEvent({
            delay: 75,
            callback: () => {
                this.#animateStreakTiles(streaks, currentStreak, currentTile+1);
            }
        });
    }

    /**
     * Destroy the streaks
     * - First animate the tiles and points
     * - Then hide the tiles and replenish the board
     * @param {Streak[]} streaks
     * @param {number} [currentStreak]
     */
    #destroyStreaks(streaks, currentStreak = 0) {
        if (currentStreak >= streaks.length) {
            this.#scene.time.addEvent({
                delay: 200,
                callback: () => {
                    this.#HideStreakTiles(streaks);
                }
            });

            return;
        }

        this.#animateStreakTiles(streaks, currentStreak);
    }

    /**
     * Pick a random color from the available colors
     * - Used to pick an icon for the tile's block
     * @returns {number}
     */
    #generateRandomColor(limit = 3) {
        // TODO: Make sure the total number of index is dynamic
        return Phaser.Math.Between(0, limit);
    }

    /**
     * Return the number of empty tiles below the specified tile
     * - Used to determine how many tiles to move down
     * @param {number} x
     * @param {number} [y]
     * @returns {number}
     */
    #getHolesBelow(x, y = -1) {
        let holes = 0;
        for(let y2 = y + 1; y2 < this.#height; y2++) {
            let tile = this.#getTileAt(x, y2);
            if (tile === null) {
                continue;
            }
            if (tile.isEmpty) {
                holes++;
            }
        }
        return holes;
    }

    /**
     * Get a tile at the specified coordinates
     * - Returns null if the coordinates are out of bounds
     * @param {number} x
     * @param {number} y
     * @returns {Tile}
     */
    #getTileAt(x, y) {
        if(y < 0 || y >= this.#height || x < 0 || x >= this.#width) {
            return null;
        }
        let index = (y * this.#width) + x;
        if (index >= this.#tiles.length) {
            return null;
        }
        return this.#tiles[index];
    }

    /**
     * Handle the matches on the board
     * - Find streaks of 3 or more tiles of the same color
     */
    #handleMatches() {
        let streaks = [];

        for (let x = 0; x < this.#width; x++) {
            let colorStreak = 1;
            let currentColor = -1;
            let startStreak = 0;
            let colorToWatch = 0;

            for (let y = 0; y < this.#height; y++) {
                let tile = this.#getTileAt(x, y);
                if (tile === null) {
                    continue;
                }

                colorToWatch = tile.block.color;
                if(colorToWatch === currentColor){
                    colorStreak++;
                }
                // Another color or at the bottom
                if (colorToWatch !== currentColor || y === this.#height - 1) {
                    let endStreak = (colorToWatch === currentColor ? y : y - 1);
                    if (colorStreak >= 3) {
                        let streak = {
                            bonus: (colorStreak === 3 ? 2 : 3),
                            tiles: [],
                        }
                        for (let k = 0; k < colorStreak; k++) {
                            let tile = this.#getTileAt(x, endStreak - k);
                            if (tile === null) {
                                continue;
                            }
                            streak.tiles.push(tile);
                        }

                        streaks.push(streak);
                    }
                    startStreak = x;
                    colorStreak = 1;
                    currentColor = colorToWatch;
                }
            }
        }

        this.#destroyStreaks(streaks);
    }

    /**
     * Determine if there are any matches on the board
     * @returns {boolean}
     */
    #hasMatches() {
        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                if (this.#isMatchAt(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Hide all the tiles in the all the streaks
     * @param {Streak[]} streaks
     */
    #HideStreakTiles(streaks) {
        let totalTiles = 0;

        streaks.forEach(singleStreak => {
            totalTiles += singleStreak.tiles.length;

            singleStreak.tiles.forEach(singleTile => {
                this.#scene.tweens.add({
                    targets: singleTile.block.container,
                    alpha: 0,
                    duration: 500,
                    ease: Phaser.Math.Easing.Sine.InOut,
                    onComplete: () => {
                        totalTiles--;
    
                        singleTile.block.clear();
                        this.#blocksPooled.push(singleTile.block);
    
                        singleTile.updateState({isEmpty: true, toRemove: false});
    
                        singleTile.block.container.visible = false;
                        if (totalTiles === 0) {
                            // Move row, col for each remaining tile
                            this.#moveExistingTiles();
                            // Place new tile on top
                            this.#addNewTiles();
                            // Tween each sprite to its new position
                            this.#makeTilesFall();
                        }
                    }
                });
            });
        });
    }

    /**
     * Determine if there are any matches at the specified coordinates
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    #isMatchAt(x, y) {
        // Only check vertical matches for now...
        let tile = this.#getTileAt(x, y);
        if (tile === null) {
            return false;
        }
        // Check for X tiles below
        let matchesThreshold = 3;

        for (let i = 1; i < 3; i++) {
            let otherTile = this.#getTileAt(x, y - i);
            if (otherTile === null) {
                continue;
            }
            if (tile.block.color === otherTile.block.color) {
                matchesThreshold--;
            }
        }

        return (matchesThreshold <= 1);
    }

    /**
     * Tween the tiles to fall into their new positions
     */
    #makeTilesFall() {
        let totalTiles = 0;

        for (let y = this.#height - 1; y >= 0; y--) {
            for (let x = 0; x < this.#width; x++) {
                let tile = this.#getTileAt(x, y);
                if (tile === null || tile.isEmpty) {
                    continue;
                }

                let newY = tile.y * TILE_SIZE + TILE_SIZE / 2;
                if (newY !== tile.block.container.y) {
                    let totalHoles = (newY - tile.block.container.y) / TILE_SIZE;

                    totalTiles++;

                    this.#scene.tweens.add({
                        targets: tile.block.container,
                        y: newY,
                        duration: 100 * totalHoles,
                        onComplete: () => {
                            totalTiles--;

                            if (totalTiles === 0) {
                                // Game Over?
    
                                if (this.#hasMatches()) {
                                    // Pause before removing the matches
                                    this.#scene.time.addEvent({
                                        delay: 200,
                                        callback: this.#handleMatches,
                                        callbackScope: this,
                                    });
                                } else {
                                    if (this.#callbackEndOfTurn) {
                                        this.#callbackEndOfTurn();
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    }

    /**
     * Move the existing tiles down to fill in the holes
     */
    #moveExistingTiles() {
        for (let y = this.#height - 2; y >= 0; y--) {
            for (let x = 0; x < this.#width; x++) {
                let tile = this.#getTileAt(x, y);
                if (tile === null || tile.isEmpty) {
                    continue;
                }
                
                let holes = this.#getHolesBelow(x, y);
                if (holes > 0) {
                    let otherTile = this.#getTileAt(x, y + holes);
                    otherTile.block = tile.block;
                    otherTile.updateState({isEmpty: false});

                    tile.updateState({isEmpty: true});
                }
            }
        }
    }

    /**
     * Called when the player selects a tile
     * - Highlights the entire row
     * @param {Phaser.Input.Pointer} pointer 
     */
    #selectTile(pointer) {
        let x = Math.floor((pointer.x - this.#container.x) / TILE_SIZE);
        let y = Math.floor((pointer.y - this.#container.y) / TILE_SIZE);

        let tile = this.#getTileAt(x, y);
        if (tile === null) {
            return;
        }

        if (this.#selectedTile === null) {
            this.#selectedTile = tile;

            // Highlight the entire row)
            for (let i = 0; i < this.#width; i++) {
                let otherTile = this.#getTileAt(i, y);
                if (otherTile === null) {
                    continue;
                }
                otherTile.block.highlight();
            }
        }
    }

    /**
     * Called when the player unselects a tile
     * - Removes the highlight from the entire row
     * - Removes the row if already selected
     * @param {Phaser.Input.Pointer} pointer 
     */
    #unselectTile(pointer) {
        if (this.#selectedTile === null) {
            return;
        }
        
        for (let i = 0; i < this.#width; i++) {
            let rowTile = this.#getTileAt(i, this.#selectedTile.y);
            if (rowTile === null) {
                continue;
            }
            rowTile.block.unhighlight();
        }


        let x = Math.floor((pointer.x - this.#container.x) / TILE_SIZE);
        let y = Math.floor((pointer.y - this.#container.y) / TILE_SIZE);

        let tile = this.#getTileAt(x, y);
        if (tile !== null && tile === this.#selectedTile) {
            if (this.#callbackTileSelected) {
                this.#callbackTileSelected(tile);
            }

            let streak = {
                bonus: 1,
                tiles: [],
            }
            // Delete entire selected row
            for (let i = 0; i < this.#width; i++) {
                let rowTile = this.#getTileAt(i, this.#selectedTile.y);
                if (rowTile === null) {
                    continue;
                }
                streak.tiles.push(rowTile);
            }
            
            this.#destroyStreaks([streak]);
        }

        this.#selectedTile = null;
    }
}
