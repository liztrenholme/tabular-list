import produce from 'immer'

import { useRef } from 'react';

export const alphaSort = (items, dir, val) => {
    if (dir === 'up') {
    items.sort((a, b) => {
        const nameA = a[val].toUpperCase(); // ignore upper and lowercase
        const nameB = b[val].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    })
} else {
    items.sort((a, b) => {
        const nameA = a[val].toUpperCase(); // ignore upper and lowercase
        const nameB = b[val].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return 1;
        }
        if (nameA > nameB) {
            return -1;
        }

        // names must be equal
        return 0;
    })
}
}

export const numSort = (dir, a, b) => {
    if (dir === 'up') {
        return a - b;
    } else {
        return b - a;
    }
}

function getPosFromId(id) {
  return id.split(",").map((n) => parseInt(n, 10));
}

export function onDragStart(evt) {
  evt.persist();
  //store id as key so onDragOver can read it via "types"
  evt.dataTransfer.setData(evt.target.id, "");
}

export function onDragOver(evt) {
  evt.persist();
  const fromPos = getPosFromId(evt.dataTransfer.types[0]);
  const toPos = getPosFromId(evt.target.closest("td").id);
  if (
    (fromPos[0] === toPos[0] && fromPos[1] !== toPos[1]) || //horizontal only
    (fromPos[1] === toPos[1] && fromPos[0] !== toPos[0]) //vertical only
  ) {
    evt.preventDefault(); //allow drop
  }
}

export function onDrop(evt, setGrid) {
  evt.preventDefault();
  const fromPos = getPosFromId(evt.dataTransfer.types[0]);
  const toPos = getPosFromId(evt.target.closest("td").id);
  if (fromPos[0] === toPos[0] && fromPos[1] !== toPos[1]) {
    //horizontal drag
    const dist = Math.abs(toPos[1] - fromPos[1]);
    const dir = toPos[1] > fromPos[1] ? 1 : -1; //to right or left
    setGrid(
      produce((draft) => {
        const cell = draft[fromPos[0]][fromPos[1]];
        for (var i = 0; i < dist; i += 1) {
          draft[fromPos[0]][fromPos[1] + i * dir] =
            draft[fromPos[0]][fromPos[1] + (i + 1) * dir];
        }
        draft[fromPos[0]][fromPos[1] + dist * dir] = cell;
      })
    );
  } else {
    //vertical drag
    const dist = Math.abs(toPos[0] - fromPos[0]);
    const dir = toPos[0] > fromPos[0] ? 1 : -1; //to down or up
    setGrid(
      produce((draft) => {
        const cell = draft[fromPos[0]][fromPos[1]];
        for (var i = 0; i < dist; i += 1) {
          draft[fromPos[0] + i * dir][fromPos[1]] =
            draft[fromPos[0] + (i + 1) * dir][fromPos[1]];
        }
        draft[fromPos[0] + dist * dir][fromPos[1]] = cell;
      })
    );
  }
}

export function arrayMove(arr, old_index, new_index) {
    console.log(old_index, new_index)
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

export function createHeaders(headers) {
  return headers.map((item) => ({
      val: item,
      ref: useRef()
  }));
};