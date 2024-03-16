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