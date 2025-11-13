/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started");

// ----------------------
// DOOR CONFIG
// ----------------------

const doorCoords = [
    { x: 17, y: 23, part: "tl" },
    { x: 18, y: 23, part: "tr" },
    { x: 17, y: 24, part: "ml" },
    { x: 18, y: 24, part: "mr" },
    { x: 17, y: 25, part: "bl" },
    { x: 18, y: 25, part: "br" },
];

let doorOpen = false;

// ----------------------
// POPUP STATE
// ----------------------

let currentPopup: any = undefined;

// ----------------------
// WORKADVENTURE INIT
// ----------------------

WA.onInit().then(() => {
    console.log("Scripting API ready");

    // Show clock popup
    WA.room.area.onEnter("clock").subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    });

    WA.room.area.onLeave("clock").subscribe(closePopup);

    // DOOR ZONE LOGIC — **must be inside onInit**
WA.room.onEnterZone("openDoorZone", () => {
    WA.ui.actionBar.addButton({
        id: "open-door-btn",
        label: "Open",
        callback: openAnimatedDoor
    });
});

WA.room.onLeaveZone("openDoorZone", () => {
    WA.ui.actionBar.removeButton("open-door-btn");
});


    // Extra scripting features
    bootstrapExtra()
        .then(() => console.log("Scripting API Extra ready"))
        .catch(e => console.error(e));

}).catch((e: unknown) => console.error(e));


// ----------------------
// POPUP CLOSE HELPER
// ----------------------

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

// ----------------------
// DOOR LOGIC
// ----------------------

function openAnimatedDoor() {
    if (doorOpen) return;

    doorOpen = true;

    const frames = [
        "door_frame1",
        "door_frame2",
        "door_frame3",
        "door_frame4",
        "door_frame5"
    ];

    // Opening animation
    frames.forEach((frame, i) => {
        setTimeout(() => setDoorFrame(frame), i * 100);
    });

    // Auto-close after 3 seconds
    setTimeout(() => closeDoor(frames), 3000);
}

function closeDoor(frames: string[]) {
    const reverse = [...frames].reverse();
    reverse.forEach((frame, i) => {
        setTimeout(() => {
            setDoorFrame(frame);
            if (i === reverse.length - 1) {
                doorOpen = false;
            }
        }, i * 100);
    });
}

function setDoorFrame(baseName: string) {
    WA.room.setTiles(
        doorCoords.map((coord) => ({
            x: coord.x,
            y: coord.y,
            tile: `${baseName}_${coord.part}`,
            layer: "door"
        }))
    );
}

console.log("WorkAdventure map loaded!");

export {};
