// Regex function for search functionality
const escapeRegex = (string: string) => {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
// Exporting Function
// module.exports = escapeRegex
export default escapeRegex
