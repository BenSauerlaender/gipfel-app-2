const getRouteGrade = (route) => {
    if(route.difficulty.jump) {
        return route.difficulty.jump
    } else if(route.difficulty.normal) {
        return route.difficulty.normal
    }
}
export { getRouteGrade }