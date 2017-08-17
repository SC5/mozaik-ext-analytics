export const mapEntry = mapping => entry => {
    const result = {}

    Object.keys(mapping).forEach(key => {
        const match = entry.find(d => d.col.name === key)
        if (match) {
            const transform = mapping[key][1]
            result[mapping[key][0]] = transform ? transform(match.value) : match.value
        }
    })

    return result
}

export const resultsMapper = mapping => results => results.map(mapEntry(mapping))
