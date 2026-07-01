import { isExists } from '../is'


type Key = string | number


class FastSet {

    private _size = 0
    storage: Obj

    constructor(array?: readonly Key[]) {
        this.storage = Object.create(null)

        if (array) {
            for (let i = 0, l = array.length; i < l; i++) {
                this.add(array[i])
            }
        }
    }

    has(key: Key) {
        return isExists(this.storage[key])
    }

    add(key: Key) {
        this.storage[key] = 1
        this._size++
    }

    delete(key: Key) {
        this.storage[key] = undefined
        this._size--
    }

    toggle(key: Key) {
        this.storage[key] = this.has(key)
            ?   this.delete(key)
            :   this.add(key)
    }

    size() {
        return this._size
    }
}


export default FastSet