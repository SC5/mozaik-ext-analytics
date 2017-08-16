export const mapEntry = mapping => entry => {
    const result = {}

    Object.keys(mapping).forEach(key => {
        const match = entry.find(d => d.col.name === key)
        if (match) {
            result[mapping[key]] = match.value
        }
    })

    return result
}

export const mapResults = mapping => results => results.map(mapEntry(mapping))
