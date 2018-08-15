export const getNamespacedType = (
    namespace: any | any [],
    type: string
) => {
    const namespaces = [].concat(namespace).join('/')
    return `${namespaces}/${type}`
}