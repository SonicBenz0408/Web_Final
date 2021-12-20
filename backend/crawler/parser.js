export default async function jsonParser (path) {
    const data = await require(path)
    return data
}