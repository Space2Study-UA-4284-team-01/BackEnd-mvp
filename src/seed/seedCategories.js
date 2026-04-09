const Category = require('~/models/category')
const logger = require('~/logger/logger')

const categoriesData = [
  { name: 'Mathematics', appearance: { icon: '/icons/category.png', color: '#FF6B6B' } },
  { name: 'Physics', appearance: { icon: '/icons/category.png', color: '#4ECDC4' } },
  { name: 'Chemistry', appearance: { icon: '/icons/category.png', color: '#45B7D1' } },
  { name: 'Biology', appearance: { icon: '/icons/category.png', color: '#96CEB4' } },
  { name: 'Computer Science', appearance: { icon: '/icons/category.png', color: '#FFEAA7' } },
  { name: 'History', appearance: { icon: '/icons/category.png', color: '#DDA0DD' } },
  { name: 'Geography', appearance: { icon: '/icons/category.png', color: '#98D8C8' } },
  { name: 'Literature', appearance: { icon: '/icons/category.png', color: '#F7DC6F' } },
  { name: 'Languages', appearance: { icon: '/icons/category.png', color: '#BB8FCE' } },
  { name: 'Music', appearance: { icon: '/icons/category.png', color: '#85C1E9' } },
  { name: 'Art', appearance: { icon: '/icons/category.png', color: '#F8C471' } },
  { name: 'Painting', appearance: { icon: '/icons/category.png', color: '#82E0AA' } },
  { name: 'Design', appearance: { icon: '/icons/category.png', color: '#F1948A' } },
  { name: 'Economics', appearance: { icon: '/icons/category.png', color: '#AED6F1' } },
  { name: 'Finance', appearance: { icon: '/icons/category.png', color: '#A9DFBF' } },
  { name: 'Accounting', appearance: { icon: '/icons/category.png', color: '#FAD7A0' } },
  { name: 'Audit', appearance: { icon: '/icons/category.png', color: '#D7BDE2' } },
  { name: 'Psychology', appearance: { icon: '/icons/category.png', color: '#A3E4D7' } },
  { name: 'Philosophy', appearance: { icon: '/icons/category.png', color: '#F9E79F' } },
  { name: 'Sociology', appearance: { icon: '/icons/category.png', color: '#ABEBC6' } },
  { name: 'Political Science', appearance: { icon: '/icons/category.png', color: '#F5B7B1' } },
  { name: 'Law', appearance: { icon: '/icons/category.png', color: '#D2B4DE' } },
  { name: 'Medicine', appearance: { icon: '/icons/category.png', color: '#A9CCE3' } },
  { name: 'Nursing', appearance: { icon: '/icons/category.png', color: '#FADBD8' } },
  { name: 'Engineering', appearance: { icon: '/icons/category.png', color: '#AED6F1' } },
  { name: 'Astronomy', appearance: { icon: '/icons/category.png', color: '#85C1E9' } },
  { name: 'Environmental Science', appearance: { icon: '/icons/category.png', color: '#82E0AA' } },
  { name: 'Statistics', appearance: { icon: '/icons/category.png', color: '#F8C471' } },
  { name: 'Data Science', appearance: { icon: '/icons/category.png', color: '#BB8FCE' } },
  { name: 'Machine Learning', appearance: { icon: '/icons/category.png', color: '#D7BDE2' } },
  { name: 'Artificial Intelligence', appearance: { icon: '/icons/category.png', color: '#A3E4D7' } },
  { name: 'Cybersecurity', appearance: { icon: '/icons/category.png', color: '#F9E79F' } },
  { name: 'Web Development', appearance: { icon: '/icons/category.png', color: '#ABEBC6' } },
  { name: 'Mobile Development', appearance: { icon: '/icons/category.png', color: '#F5B7B1' } },
  { name: 'Game Development', appearance: { icon: '/icons/category.png', color: '#D2B4DE' } },
  { name: 'Photography', appearance: { icon: '/icons/category.png', color: '#A9CCE3' } },
  { name: 'Film Studies', appearance: { icon: '/icons/category.png', color: '#FADBD8' } },
  { name: 'Theater', appearance: { icon: '/icons/category.png', color: '#AED6F1' } },
  { name: 'Dance', appearance: { icon: '/icons/category.png', color: '#85C1E9' } },
  { name: 'Sports Science', appearance: { icon: '/icons/category.png', color: '#82E0AA' } }
]

const seedCategories = {
  createCategories: async () => {
    try {
      let addedCount = 0
      for (const categoryData of categoriesData) {
          const existingCategory = await Category.findOne({ name: String(categoryData.name) })
        if (!existingCategory) {
          await Category.create(categoryData)
          addedCount++
        }
      }
      if (addedCount > 0) {
        logger.info(`Categories seeded successfully. Added ${addedCount} new categories.`)
      } else {
        logger.info('All categories already exist, no new categories added.')
      }
    } catch (err) {
        logger.error('Error seeding categories:', err)
        // server should continue running even if seeding fails, so we don't rethrow the error
    }
  }
}

module.exports = { seedCategories, categoriesData }
