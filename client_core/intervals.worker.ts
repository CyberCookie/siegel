type MessageIncome = {
    id: string
    ms?: number
}

type MessageOutcome = MessageEvent<MessageIncome['id']>


const activeIntervalsById: Indexable<number> = {}


onmessage = ({ data }: MessageEvent<MessageIncome>) => {
    const { ms, id } = data

    if (ms) {
        activeIntervalsById[id] = (setInterval as Window['setInterval'])(() => {
            postMessage(id)
        }, ms)

    } else {
        clearInterval(activeIntervalsById[id])
        delete activeIntervalsById[id]
    }
}


export default {} as () => Worker
export type { MessageOutcome, MessageIncome }