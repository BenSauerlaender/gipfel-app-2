import api from './index'

export const createAscent = (ascentData) => api.post('/ascent/new', ascentData)
export const deleteAscent = (ascentId) => api.delete(`/ascent/${ascentId}`)
